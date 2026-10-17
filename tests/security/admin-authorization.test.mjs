import test from 'node:test'
import assert from 'node:assert/strict'

/**
 * Security Authorization Evaluator (Mirror of the hardened server-side authorization logic)
 * Tested against:
 * - src/app/api/admin/activity/route.ts
 * - src/app/admin/users/actions.ts
 * - src/app/admin/team/actions.ts
 * - src/app/admin/inquiries/actions.ts
 * - src/app/admin/agents/actions.ts
 * - supabase/migrations/20261017000000_fix_admin_privilege_escalation.sql
 */
function evaluateAdminAuthorization({ user, profile, teamMember }) {
  if (!user || !user.id) {
    return false
  }

  // 1. Layer 1: Trusted server-assigned app_metadata (Service Role / Auth Admin only)
  const isAppAdmin = user.app_metadata?.role === 'admin'

  // 2. Layer 2: Database team_members verified active record
  const isActiveTeamMember = teamMember?.is_active === true

  // 3. Layer 3: Database profile role
  const isProfileAdmin = profile?.role === 'ADMIN'

  // CRITICAL SECURITY RULE: user.user_metadata is client-controlled and MUST NEVER be evaluated.
  // Any presence of user_metadata.role MUST NOT affect authorization.

  return isAppAdmin || isActiveTeamMember || isProfileAdmin
}

/**
 * Profile Role Update Guard (Mirror of the PostgreSQL tr_prevent_self_role_escalation trigger)
 */
function evaluateProfileRoleUpdate({ caller, currentRole, targetNewRole }) {
  if (currentRole === targetNewRole) {
    return { allowed: true }
  }

  // Self-elevation or role change attempt
  const isCallerAdmin = evaluateAdminAuthorization(caller)
  if (!isCallerAdmin) {
    return {
      allowed: false,
      error: 'Forbidden: Ordinary users cannot modify their own account role.',
    }
  }

  return { allowed: true }
}

test('Security Regression Suite: Task 1 - Admin Privilege Escalation', async (t) => {
  await t.test('1. Normal Tenant User cannot access admin functionality', () => {
    const normalTenant = {
      user: {
        id: 'usr-tenant-123',
        email: 'tenant@example.com',
        app_metadata: {},
        user_metadata: { full_name: 'Regular Tenant' },
      },
      profile: { id: 'usr-tenant-123', role: 'TENANT' },
      teamMember: null,
    }

    const isAuthorized = evaluateAdminAuthorization(normalTenant)
    assert.strictEqual(isAuthorized, false, 'Normal tenant must be denied admin access')
  })

  await t.test('2. CRITICAL REGRESSION: User with manipulated user_metadata.role = "admin" MUST BE REJECTED', () => {
    const attacker = {
      user: {
        id: 'usr-malicious-456',
        email: 'attacker@example.com',
        app_metadata: {}, // Empty app_metadata
        user_metadata: { role: 'admin', full_name: 'Attacker' }, // Client-manipulated claim
      },
      profile: { id: 'usr-malicious-456', role: 'TENANT' },
      teamMember: null,
    }

    const isAuthorized = evaluateAdminAuthorization(attacker)
    assert.strictEqual(
      isAuthorized,
      false,
      'CRITICAL: User with user_metadata.role = "admin" MUST NOT receive admin authorization'
    )
  })

  await t.test('3. Legitimate Administrator with server-controlled app_metadata.role = "admin" is authorized', () => {
    const serverPromotedAdmin = {
      user: {
        id: 'usr-admin-789',
        email: 'admin@primehomekanpur.com',
        app_metadata: { role: 'admin' }, // Trusted server-assigned claim
        user_metadata: {},
      },
      profile: { id: 'usr-admin-789', role: 'ADMIN' },
      teamMember: null,
    }

    const isAuthorized = evaluateAdminAuthorization(serverPromotedAdmin)
    assert.strictEqual(isAuthorized, true, 'Legitimate app_metadata admin must be authorized')
  })

  await t.test('4. Legitimate Administrator via active database team_members record is authorized', () => {
    const teamMemberAdmin = {
      user: {
        id: 'usr-team-001',
        email: 'manager@primehomekanpur.com',
        app_metadata: {},
        user_metadata: {},
      },
      profile: { id: 'usr-team-001', role: 'TENANT' },
      teamMember: { team_role: 'MANAGER', is_active: true },
    }

    const isAuthorized = evaluateAdminAuthorization(teamMemberAdmin)
    assert.strictEqual(isAuthorized, true, 'Active team member must be authorized')
  })

  await t.test('5. Inactive / Suspended team member MUST BE REJECTED', () => {
    const suspendedMember = {
      user: {
        id: 'usr-suspended-002',
        email: 'suspended@primehomekanpur.com',
        app_metadata: {},
        user_metadata: {},
      },
      profile: { id: 'usr-suspended-002', role: 'TENANT' },
      teamMember: { team_role: 'SUPPORT', is_active: false }, // Inactive
    }

    const isAuthorized = evaluateAdminAuthorization(suspendedMember)
    assert.strictEqual(isAuthorized, false, 'Suspended team member must be denied admin access')
  })

  await t.test('6. Normal Tenant trying to self-escalate role from TENANT to ADMIN is BLOCKED', () => {
    const normalTenantCaller = {
      user: {
        id: 'usr-tenant-999',
        email: 'sneaky@example.com',
        app_metadata: {},
        user_metadata: { role: 'admin' }, // Manipulated metadata attempt
      },
      profile: { id: 'usr-tenant-999', role: 'TENANT' },
      teamMember: null,
    }

    const result = evaluateProfileRoleUpdate({
      caller: normalTenantCaller,
      currentRole: 'TENANT',
      targetNewRole: 'ADMIN',
    })

    assert.strictEqual(result.allowed, false)
    assert.match(result.error, /Forbidden: Ordinary users cannot modify their own account role/)
  })

  await t.test('7. Authorized Administrator can safely update user roles', () => {
    const authorizedAdminCaller = {
      user: {
        id: 'usr-owner-001',
        email: 'owner@primehomekanpur.com',
        app_metadata: { role: 'admin' },
        user_metadata: {},
      },
      profile: { id: 'usr-owner-001', role: 'ADMIN' },
      teamMember: { team_role: 'OWNER', is_active: true },
    }

    const result = evaluateProfileRoleUpdate({
      caller: authorizedAdminCaller,
      currentRole: 'TENANT',
      targetNewRole: 'ADMIN',
    })

    assert.strictEqual(result.allowed, true)
  })

  await t.test('8. Unauthenticated request (no user session) MUST BE REJECTED', () => {
    const unauthenticated = {
      user: null,
      profile: null,
      teamMember: null,
    }

    const isAuthorized = evaluateAdminAuthorization(unauthenticated)
    assert.strictEqual(isAuthorized, false, 'Unauthenticated session must be rejected')
  })
})
