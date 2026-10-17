import test from 'node:test'
import assert from 'node:assert/strict'

/**
 * Security Evaluator: Tenant and Landlord Ownership & Multi-Tenant Data Isolation
 * Evaluates requirements from:
 * - supabase/migrations/20261017000300_enforce_tenant_landlord_ownership.sql
 * - src/lib/data/properties.ts
 * - src/app/dashboard/visits/page.tsx
 * - src/app/landlord/visits/page.tsx
 */

function evaluatePropertyAccess({ caller, property, action, updatePayload }) {
  const isAdmin = caller?.isAdmin === true
  const isOwner = caller?.id && property.created_by === caller.id

  if (action === 'SELECT') {
    if (property.status === 'AVAILABLE' || property.status === 'RENTED' || property.status === 'RESERVED') {
      return { allowed: true }
    }
    if (isOwner || isAdmin) {
      return { allowed: true }
    }
    return { allowed: false, error: 'Property is in draft/hidden state and caller is not the owner or admin' }
  }

  if (action === 'INSERT') {
    if (!caller?.id) {
      return { allowed: false, error: 'Unauthenticated users cannot create properties' }
    }
    return { allowed: true }
  }

  if (action === 'UPDATE') {
    if (!caller?.id) return { allowed: false, error: 'Unauthenticated' }
    if (!isOwner && !isAdmin) {
      return { allowed: false, error: 'Forbidden: You cannot modify a property you do not own' }
    }
    // Anti-spoofing: non-admin cannot alter created_by
    if (updatePayload && updatePayload.created_by && updatePayload.created_by !== property.created_by && !isAdmin) {
      return { allowed: false, error: 'Security violation: Property ownership cannot be modified by non-admin callers' }
    }
    return { allowed: true }
  }

  if (action === 'DELETE') {
    if (!caller?.id) return { allowed: false, error: 'Unauthenticated' }
    if (!isOwner && !isAdmin) {
      return { allowed: false, error: 'Forbidden: You cannot delete a property you do not own' }
    }
    return { allowed: true }
  }

  return { allowed: false }
}

function evaluateVisitAccess({ caller, visit, property, action, updatePayload }) {
  const isAdmin = caller?.isAdmin === true
  const isTenant = caller?.id && visit.user_id === caller.id
  const isLandlordOwner = caller?.id && property && property.created_by === caller.id

  if (action === 'SELECT') {
    if (isTenant || isLandlordOwner || isAdmin) {
      return { allowed: true }
    }
    return { allowed: false, error: 'Forbidden: Visit records are private to the tenant, property owner, and admins' }
  }

  if (action === 'INSERT') {
    if (!caller?.id) return { allowed: false, error: 'Unauthenticated' }
    return { allowed: true }
  }

  if (action === 'UPDATE') {
    if (!caller?.id) return { allowed: false, error: 'Unauthenticated' }
    if (!isTenant && !isLandlordOwner && !isAdmin) {
      return { allowed: false, error: 'Forbidden: Cannot update an unrelated user\'s visit reservation' }
    }
    // Anti-spoofing: user_id cannot be changed
    if (updatePayload && updatePayload.user_id && updatePayload.user_id !== visit.user_id && !isAdmin) {
      return { allowed: false, error: 'Security violation: Visit reservation owner cannot be modified' }
    }
    return { allowed: true }
  }

  if (action === 'DELETE') {
    if (isAdmin) return { allowed: true }
    return { allowed: false, error: 'Forbidden: Only admins can delete visit records' }
  }

  return { allowed: false }
}

function evaluateInquiryAccess({ caller, inquiry, property, action }) {
  const isAdmin = caller?.isAdmin === true
  const isSubmitter = caller?.id && inquiry.user_id === caller.id
  const isLandlordOwner = caller?.id && property && property.created_by === caller.id

  if (action === 'SELECT') {
    if (isSubmitter || isLandlordOwner || isAdmin) {
      return { allowed: true }
    }
    return { allowed: false, error: 'Forbidden: Lead messages are private' }
  }

  if (action === 'INSERT') {
    return { allowed: true } // Public lead generation
  }

  if (action === 'UPDATE') {
    if (isLandlordOwner || isAdmin) return { allowed: true }
    return { allowed: false, error: 'Forbidden: Only the property landlord or admin can update lead status' }
  }

  return { allowed: false }
}

test('Security Regression Suite: Task 6 - Tenant and Landlord Ownership Enforcement', async (t) => {
  // Test entities
  const landlordA = { id: 'usr-landlord-a', isAdmin: false }
  const landlordB = { id: 'usr-landlord-b', isAdmin: false }
  const tenantA = { id: 'usr-tenant-a', isAdmin: false }
  const tenantB = { id: 'usr-tenant-b', isAdmin: false }
  const adminUser = { id: 'usr-admin-1', isAdmin: true }
  const anonymousCaller = null

  const propLandlordA = {
    id: 'prop-101',
    title: 'Kakadeo 2BHK Flat',
    created_by: 'usr-landlord-a',
    status: 'AVAILABLE',
  }

  const draftPropLandlordA = {
    id: 'prop-102',
    title: 'Swaroop Nagar Penthouse (Draft)',
    created_by: 'usr-landlord-a',
    status: 'DRAFT',
  }

  const visitTenantAOnPropA = {
    id: 'visit-501',
    user_id: 'usr-tenant-a',
    property_id: 'prop-101',
    status: 'pending',
  }

  const inquiryTenantAOnPropA = {
    id: 'inq-701',
    user_id: 'usr-tenant-a',
    property_id: 'prop-101',
    status: 'new',
  }

  // ============================================================================
  // 1. PUBLIC / ANONYMOUS ACCESS TESTS
  // ============================================================================
  await t.test('1. Anonymous visitor CAN view AVAILABLE listings', () => {
    const res = evaluatePropertyAccess({ caller: anonymousCaller, property: propLandlordA, action: 'SELECT' })
    assert.equal(res.allowed, true)
  })

  await t.test('2. Anonymous visitor CANNOT view DRAFT or INACTIVE listings', () => {
    const res = evaluatePropertyAccess({ caller: anonymousCaller, property: draftPropLandlordA, action: 'SELECT' })
    assert.equal(res.allowed, false)
  })

  await t.test('3. Anonymous visitor CANNOT view private visit schedules', () => {
    const res = evaluateVisitAccess({ caller: anonymousCaller, visit: visitTenantAOnPropA, property: propLandlordA, action: 'SELECT' })
    assert.equal(res.allowed, false)
  })

  await t.test('4. Anonymous visitor CANNOT view private leads or inquiries', () => {
    const res = evaluateInquiryAccess({ caller: anonymousCaller, inquiry: inquiryTenantAOnPropA, property: propLandlordA, action: 'SELECT' })
    assert.equal(res.allowed, false)
  })

  // ============================================================================
  // 2. LANDLORD OWNER ISOLATION TESTS
  // ============================================================================
  await t.test('5. Landlord A CAN view their own draft listings in any status', () => {
    const res = evaluatePropertyAccess({ caller: landlordA, property: draftPropLandlordA, action: 'SELECT' })
    assert.equal(res.allowed, true)
  })

  await t.test('6. Landlord A CAN update and manage their own property', () => {
    const res = evaluatePropertyAccess({ caller: landlordA, property: propLandlordA, action: 'UPDATE' })
    assert.equal(res.allowed, true)
  })

  await t.test('7. Landlord A CAN view visits scheduled on their owned property', () => {
    const res = evaluateVisitAccess({ caller: landlordA, visit: visitTenantAOnPropA, property: propLandlordA, action: 'SELECT' })
    assert.equal(res.allowed, true)
  })

  await t.test('8. Landlord A CAN view leads and inquiries submitted for their property', () => {
    const res = evaluateInquiryAccess({ caller: landlordA, inquiry: inquiryTenantAOnPropA, property: propLandlordA, action: 'SELECT' })
    assert.equal(res.allowed, true)
  })

  // ============================================================================
  // 3. CROSS-LANDLORD ISOLATION TESTS (Unrelated Landlord Block)
  // ============================================================================
  await t.test('9. CROSS-LANDLORD: Landlord B CANNOT view Landlord A\'s draft properties', () => {
    const res = evaluatePropertyAccess({ caller: landlordB, property: draftPropLandlordA, action: 'SELECT' })
    assert.equal(res.allowed, false)
  })

  await t.test('10. CROSS-LANDLORD: Landlord B CANNOT update Landlord A\'s properties', () => {
    const res = evaluatePropertyAccess({ caller: landlordB, property: propLandlordA, action: 'UPDATE' })
    assert.equal(res.allowed, false)
    assert.match(res.error, /do not own/i)
  })

  await t.test('11. CROSS-LANDLORD: Landlord B CANNOT delete Landlord A\'s properties', () => {
    const res = evaluatePropertyAccess({ caller: landlordB, property: propLandlordA, action: 'DELETE' })
    assert.equal(res.allowed, false)
    assert.match(res.error, /do not own/i)
  })

  await t.test('12. CROSS-LANDLORD: Landlord B CANNOT view visits for Landlord A\'s properties', () => {
    const res = evaluateVisitAccess({ caller: landlordB, visit: visitTenantAOnPropA, property: propLandlordA, action: 'SELECT' })
    assert.equal(res.allowed, false)
  })

  await t.test('13. CROSS-LANDLORD: Landlord B CANNOT view inquiries sent to Landlord A', () => {
    const res = evaluateInquiryAccess({ caller: landlordB, inquiry: inquiryTenantAOnPropA, property: propLandlordA, action: 'SELECT' })
    assert.equal(res.allowed, false)
  })

  // ============================================================================
  // 4. TENANT ISOLATION TESTS
  // ============================================================================
  await t.test('14. Tenant A CAN view their own scheduled visit', () => {
    const res = evaluateVisitAccess({ caller: tenantA, visit: visitTenantAOnPropA, property: propLandlordA, action: 'SELECT' })
    assert.equal(res.allowed, true)
  })

  await t.test('15. Tenant A CAN cancel their own visit', () => {
    const res = evaluateVisitAccess({ caller: tenantA, visit: visitTenantAOnPropA, property: propLandlordA, action: 'UPDATE' })
    assert.equal(res.allowed, true)
  })

  await t.test('16. CROSS-TENANT: Tenant B CANNOT view Tenant A\'s scheduled visit', () => {
    const res = evaluateVisitAccess({ caller: tenantB, visit: visitTenantAOnPropA, property: propLandlordA, action: 'SELECT' })
    assert.equal(res.allowed, false)
  })

  await t.test('17. CROSS-TENANT: Tenant B CANNOT modify or cancel Tenant A\'s visit', () => {
    const res = evaluateVisitAccess({ caller: tenantB, visit: visitTenantAOnPropA, property: propLandlordA, action: 'UPDATE' })
    assert.equal(res.allowed, false)
    assert.match(res.error, /unrelated user/i)
  })

  // ============================================================================
  // 5. ANTI-SPOOFING TESTS (Payload Tampering Prevention)
  // ============================================================================
  await t.test('18. ANTI-SPOOFING: Non-admin Landlord cannot hijack ownership of property', () => {
    const res = evaluatePropertyAccess({
      caller: landlordA,
      property: propLandlordA,
      action: 'UPDATE',
      updatePayload: { created_by: 'usr-landlord-b' }, // Hijack attempt
    })
    assert.equal(res.allowed, false)
    assert.match(res.error, /Security violation.*ownership cannot be modified/i)
  })

  await t.test('19. ANTI-SPOOFING: Tenant cannot reassign visit reservation user_id', () => {
    const res = evaluateVisitAccess({
      caller: tenantA,
      visit: visitTenantAOnPropA,
      property: propLandlordA,
      action: 'UPDATE',
      updatePayload: { user_id: 'usr-tenant-b' }, // Tamper attempt
    })
    assert.equal(res.allowed, false)
    assert.match(res.error, /Security violation.*owner cannot be modified/i)
  })

  // ============================================================================
  // 6. AUTHORIZED ADMINISTRATOR TESTS
  // ============================================================================
  await t.test('20. ADMIN: Authorized admin can view, update, and manage all properties', () => {
    const selectRes = evaluatePropertyAccess({ caller: adminUser, property: draftPropLandlordA, action: 'SELECT' })
    const updateRes = evaluatePropertyAccess({ caller: adminUser, property: propLandlordA, action: 'UPDATE' })
    const deleteRes = evaluatePropertyAccess({ caller: adminUser, property: propLandlordA, action: 'DELETE' })

    assert.equal(selectRes.allowed, true)
    assert.equal(updateRes.allowed, true)
    assert.equal(deleteRes.allowed, true)
  })

  await t.test('21. ADMIN: Authorized admin can view and manage all visits and inquiries', () => {
    const visitRes = evaluateVisitAccess({ caller: adminUser, visit: visitTenantAOnPropA, property: propLandlordA, action: 'SELECT' })
    const inqRes = evaluateInquiryAccess({ caller: adminUser, inquiry: inquiryTenantAOnPropA, property: propLandlordA, action: 'SELECT' })

    assert.equal(visitRes.allowed, true)
    assert.equal(inqRes.allowed, true)
  })
})
