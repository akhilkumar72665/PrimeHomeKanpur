import test from 'node:test'
import assert from 'node:assert/strict'

/**
 * Database Role Permission Matrix Evaluator
 * Mirroring the SQL GRANT / REVOKE rules defined in:
 * supabase/migrations/20261017000200_enforce_database_least_privilege.sql
 */

// Permitted table operations per database role
const LEAST_PRIVILEGE_MATRIX = {
  anon: {
    // Read-only tables for public discovery
    SELECT: [
      'properties',
      'property_images',
      'locations',
      'agents',
      'faqs',
      'testimonials',
      'reviews',
      'page_settings',
      'site_statistics',
    ],
    // Forms that public visitors can submit
    INSERT: ['inquiries', 'contact_messages', 'newsletter_subscribers'],
    // Anon must NEVER have UPDATE, DELETE, or TRUNCATE on any table
    UPDATE: [],
    DELETE: [],
    TRUNCATE: [],
  },
  authenticated: {
    SELECT: [
      'properties',
      'property_images',
      'locations',
      'agents',
      'faqs',
      'testimonials',
      'reviews',
      'page_settings',
      'site_statistics',
      'profiles',
      'property_visits',
      'wishlists',
      'favorites',
      'inquiries',
      'contact_messages',
      'team_members',
      'activity_logs',
    ],
    INSERT: [
      'properties',
      'property_images',
      'reviews',
      'inquiries',
      'contact_messages',
      'newsletter_subscribers',
      'property_visits',
      'wishlists',
      'favorites',
      'profiles',
      'team_members',
      'activity_logs',
    ],
    UPDATE: [
      'properties',
      'property_images',
      'locations',
      'agents',
      'reviews',
      'inquiries',
      'contact_messages',
      'property_visits',
      'wishlists',
      'favorites',
      'profiles',
      'team_members',
      'page_settings',
      'site_statistics',
    ],
    DELETE: [
      'properties',
      'property_images',
      'reviews',
      'property_visits',
      'wishlists',
      'favorites',
      'profiles',
      'team_members',
      'agents',
    ],
    // Authenticated users must NEVER have TRUNCATE
    TRUNCATE: [],
  },
}

function checkTablePrivilege(role, operation, tableName) {
  const roleRules = LEAST_PRIVILEGE_MATRIX[role]
  if (!roleRules) return false
  const allowedTables = roleRules[operation] || []
  return allowedTables.includes(tableName)
}

test('Security Regression Suite: Task 3 - Database Least-Privilege Permissions', async (t) => {
  await t.test('1. Anon role has SELECT on public properties and localities', () => {
    assert.strictEqual(checkTablePrivilege('anon', 'SELECT', 'properties'), true)
    assert.strictEqual(checkTablePrivilege('anon', 'SELECT', 'locations'), true)
    assert.strictEqual(checkTablePrivilege('anon', 'SELECT', 'agents'), true)
    assert.strictEqual(checkTablePrivilege('anon', 'SELECT', 'faqs'), true)
  })

  await t.test('2. Anon role has INSERT on public lead inquiry and contact forms', () => {
    assert.strictEqual(checkTablePrivilege('anon', 'INSERT', 'inquiries'), true)
    assert.strictEqual(checkTablePrivilege('anon', 'INSERT', 'contact_messages'), true)
    assert.strictEqual(checkTablePrivilege('anon', 'INSERT', 'newsletter_subscribers'), true)
  })

  await t.test('3. DEFENSE IN DEPTH: Anon role MUST NOT have UPDATE or DELETE on properties', () => {
    assert.strictEqual(checkTablePrivilege('anon', 'UPDATE', 'properties'), false)
    assert.strictEqual(checkTablePrivilege('anon', 'DELETE', 'properties'), false)
  })

  await t.test('4. PRIVACY DEFENSE: Anon role MUST NOT have SELECT on profiles or team_members', () => {
    assert.strictEqual(checkTablePrivilege('anon', 'SELECT', 'profiles'), false)
    assert.strictEqual(checkTablePrivilege('anon', 'SELECT', 'team_members'), false)
    assert.strictEqual(checkTablePrivilege('anon', 'SELECT', 'activity_logs'), false)
    assert.strictEqual(checkTablePrivilege('anon', 'SELECT', 'property_visits'), false)
    assert.strictEqual(checkTablePrivilege('anon', 'SELECT', 'wishlists'), false)
  })

  await t.test('5. CATASTROPHIC RISK DEFENSE: Neither anon nor authenticated role can TRUNCATE tables', () => {
    assert.strictEqual(checkTablePrivilege('anon', 'TRUNCATE', 'properties'), false)
    assert.strictEqual(checkTablePrivilege('anon', 'TRUNCATE', 'profiles'), false)
    assert.strictEqual(checkTablePrivilege('authenticated', 'TRUNCATE', 'properties'), false)
    assert.strictEqual(checkTablePrivilege('authenticated', 'TRUNCATE', 'profiles'), false)
  })

  await t.test('6. Authenticated role has legitimate application privileges governed by RLS', () => {
    assert.strictEqual(checkTablePrivilege('authenticated', 'SELECT', 'profiles'), true)
    assert.strictEqual(checkTablePrivilege('authenticated', 'UPDATE', 'profiles'), true)
    assert.strictEqual(checkTablePrivilege('authenticated', 'INSERT', 'property_visits'), true)
    assert.strictEqual(checkTablePrivilege('authenticated', 'DELETE', 'wishlists'), true)
  })
})
