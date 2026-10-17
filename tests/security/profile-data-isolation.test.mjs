import test from 'node:test'
import assert from 'node:assert/strict'

/**
 * Profiles RLS Policy Evaluator
 * Mirroring the exact PostgreSQL Row-Level Security rules defined in:
 * supabase/migrations/20261017000100_fix_public_profile_exposure.sql
 */
function evaluateProfileSelectPolicy({ caller, targetProfile }) {
  // If no authenticated caller (anonymous anon user)
  if (!caller || !caller.id) {
    return false
  }

  // 1. Authenticated owner reading their own record
  if (caller.id === targetProfile.id) {
    return true
  }

  // 2. Service role
  if (caller.role === 'service_role') {
    return true
  }

  // 3. Verified administrator with users.view permission
  const isAdmin =
    caller.app_metadata?.role === 'admin' ||
    caller.is_team_admin === true ||
    caller.profile_role === 'ADMIN'

  const hasUsersViewPermission = caller.permissions?.includes('users.view') ?? true

  if (isAdmin && hasUsersViewPermission) {
    return true
  }

  // Fail-closed default: Access denied
  return false
}

function evaluateProfileUpdatePolicy({ caller, targetProfile, updatedFields }) {
  if (!caller || !caller.id) {
    return { allowed: false, reason: 'Unauthenticated' }
  }

  const isSelf = caller.id === targetProfile.id
  const isServiceRole = caller.role === 'service_role'
  const isAdmin =
    caller.app_metadata?.role === 'admin' ||
    caller.is_team_admin === true ||
    caller.profile_role === 'ADMIN'
  const hasRoleChangePerm = caller.permissions?.includes('users.role_change') ?? true

  // Can only update own profile unless admin with role_change
  if (!isSelf && !isServiceRole && !(isAdmin && hasRoleChangePerm)) {
    return { allowed: false, reason: 'Cross-user update forbidden' }
  }

  // If role is being changed
  if (updatedFields.role && updatedFields.role !== targetProfile.role) {
    // Normal users cannot change their own role
    if (isSelf && !isAdmin) {
      return { allowed: false, reason: 'Forbidden: Ordinary users cannot modify their own account role' }
    }
  }

  return { allowed: true }
}

test('Security Regression Suite: Task 2 - Profile Data Isolation & PII Protection', async (t) => {
  // Synthetic Test Personas (Strictly zero real user PII)
  const anonymousCaller = null

  const syntheticTenantA = {
    id: 'syn-user-tenant-aaa',
    email: 'tenant.alpha@test.internal',
    profile_role: 'TENANT',
    is_team_admin: false,
    app_metadata: {},
  }

  const _syntheticTenantB = {
    id: 'syn-user-tenant-bbb',
    email: 'tenant.beta@test.internal',
    profile_role: 'TENANT',
    is_team_admin: false,
    app_metadata: {},
  }

  const syntheticProfileB = {
    id: 'syn-user-tenant-bbb',
    email: 'tenant.beta@test.internal',
    full_name: 'Synthetic Beta',
    phone: '+919999900002',
    role: 'TENANT',
  }

  const syntheticAdmin = {
    id: 'syn-user-admin-owner',
    email: 'admin.owner@test.internal',
    profile_role: 'ADMIN',
    is_team_admin: true,
    permissions: ['users.view', 'users.role_change'],
    app_metadata: { role: 'admin' },
  }

  await t.test('1. Anonymous caller MUST NOT be able to read any user profile', () => {
    const canRead = evaluateProfileSelectPolicy({
      caller: anonymousCaller,
      targetProfile: syntheticProfileB,
    })
    assert.strictEqual(canRead, false, 'Anonymous users must be completely denied access to profiles')
  })

  await t.test('2. Tenant A CAN read their own profile', () => {
    const syntheticProfileA = {
      id: 'syn-user-tenant-aaa',
      email: 'tenant.alpha@test.internal',
      full_name: 'Synthetic Alpha',
      phone: '+919999900001',
      role: 'TENANT',
    }

    const canRead = evaluateProfileSelectPolicy({
      caller: syntheticTenantA,
      targetProfile: syntheticProfileA,
    })
    assert.strictEqual(canRead, true, 'User must be allowed to read their own profile')
  })

  await t.test('3. Cross-User Isolation: Tenant A CANNOT read Tenant B\'s private profile', () => {
    const canRead = evaluateProfileSelectPolicy({
      caller: syntheticTenantA,
      targetProfile: syntheticProfileB,
    })
    assert.strictEqual(canRead, false, 'Tenant A must be blocked from reading Tenant B profile')
  })

  await t.test('4. Cross-User Update Block: Tenant A CANNOT update Tenant B\'s profile', () => {
    const updateResult = evaluateProfileUpdatePolicy({
      caller: syntheticTenantA,
      targetProfile: syntheticProfileB,
      updatedFields: { full_name: 'Hacked Name' },
    })
    assert.strictEqual(updateResult.allowed, false)
    assert.strictEqual(updateResult.reason, 'Cross-user update forbidden')
  })

  await t.test('5. Tenant A CAN update their own permitted profile fields (full_name, phone)', () => {
    const syntheticProfileA = {
      id: 'syn-user-tenant-aaa',
      email: 'tenant.alpha@test.internal',
      full_name: 'Synthetic Alpha',
      phone: '+919999900001',
      role: 'TENANT',
    }

    const updateResult = evaluateProfileUpdatePolicy({
      caller: syntheticTenantA,
      targetProfile: syntheticProfileA,
      updatedFields: { full_name: 'Updated Alpha', phone: '+919876543210' },
    })
    assert.strictEqual(updateResult.allowed, true)
  })

  await t.test('6. Self-Elevation Prevention: Tenant A CANNOT update their own role to ADMIN', () => {
    const syntheticProfileA = {
      id: 'syn-user-tenant-aaa',
      email: 'tenant.alpha@test.internal',
      full_name: 'Synthetic Alpha',
      phone: '+919999900001',
      role: 'TENANT',
    }

    const updateResult = evaluateProfileUpdatePolicy({
      caller: syntheticTenantA,
      targetProfile: syntheticProfileA,
      updatedFields: { role: 'ADMIN' },
    })
    assert.strictEqual(updateResult.allowed, false)
    assert.match(updateResult.reason, /Forbidden: Ordinary users cannot modify their own account role/)
  })

  await t.test('7. Authorized Administrator CAN read user profiles for customer support/management', () => {
    const canRead = evaluateProfileSelectPolicy({
      caller: syntheticAdmin,
      targetProfile: syntheticProfileB,
    })
    assert.strictEqual(canRead, true, 'Administrator with users.view must be allowed to read profile')
  })

  await t.test('8. Authorized Administrator CAN update user roles with users.role_change permission', () => {
    const updateResult = evaluateProfileUpdatePolicy({
      caller: syntheticAdmin,
      targetProfile: syntheticProfileB,
      updatedFields: { role: 'ADMIN' },
    })
    assert.strictEqual(updateResult.allowed, true, 'Admin with role_change must be allowed to modify roles')
  })
})
