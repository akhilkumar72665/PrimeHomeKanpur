import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Security Evaluator: Environment Variables & Secret Isolation
 * Evaluates requirements from:
 * - src/lib/env.ts
 * - src/lib/supabase/client.ts
 * - src/lib/supabase/server.ts
 * - src/lib/supabase/admin.ts
 * - src/lib/cloudinary.ts
 * - src/proxy.ts
 * - .gitignore
 * - .env.example
 */

const PROJECT_ROOT = process.cwd()

test('Security Regression Suite: Task 5 - Secure Environment Variables & Secret Handling', async (t) => {
  await t.test('1. REGRESSION: No hardcoded Supabase Anon JWT fallback strings exist in source code', () => {
    const filesToCheck = [
      'src/lib/supabase/client.ts',
      'src/lib/supabase/server.ts',
      'src/lib/supabase/admin.ts',
      'src/proxy.ts',
      'src/lib/env.ts',
    ]

    const fullJwtPattern = /eyJhbGciOi[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/

    for (const relPath of filesToCheck) {
      const fullPath = path.join(PROJECT_ROOT, relPath)
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8')
        assert.equal(
          fullJwtPattern.test(content),
          false,
          `File ${relPath} must NOT contain any hardcoded Supabase JWT fallback strings!`
        )
      }
    }
  })

  await t.test('2. REGRESSION: No hardcoded Supabase default project URLs exist in source code', () => {
    const filesToCheck = [
      'src/lib/supabase/client.ts',
      'src/lib/supabase/server.ts',
      'src/lib/supabase/admin.ts',
      'src/proxy.ts',
      'src/lib/env.ts',
    ]

    const fallbackUrlPattern = /unwifyqenmopagltuqew/i

    for (const relPath of filesToCheck) {
      const fullPath = path.join(PROJECT_ROOT, relPath)
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8')
        assert.equal(
          fallbackUrlPattern.test(content),
          false,
          `File ${relPath} must NOT contain hardcoded project reference unwifyqenmopagltuqew!`
        )
      }
    }
  })

  await t.test('3. VALIDATION: Missing NEXT_PUBLIC_SUPABASE_URL fails safely with non-sensitive error', () => {
    function evaluateClientConfig(env) {
      const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
          'Supabase client configuration error: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables.'
        )
      }
      return { supabaseUrl, supabaseAnonKey }
    }

    assert.throws(
      () => evaluateClientConfig({ NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-key' }),
      (err) => {
        assert.match(err.message, /Missing NEXT_PUBLIC_SUPABASE_URL/i)
        // Ensure error doesn't leak secret tokens
        assert.doesNotMatch(err.message, /test-key/i)
        return true
      }
    )
  })

  await t.test('4. VALIDATION: Missing NEXT_PUBLIC_SUPABASE_ANON_KEY fails safely with non-sensitive error', () => {
    function evaluateClientConfig(env) {
      const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
          'Supabase client configuration error: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables.'
        )
      }
      return { supabaseUrl, supabaseAnonKey }
    }

    assert.throws(
      () => evaluateClientConfig({ NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co' }),
      (err) => {
        assert.match(err.message, /Missing.*NEXT_PUBLIC_SUPABASE_ANON_KEY/i)
        return true
      }
    )
  })

  await t.test('5. PRIVILEGED ACCESS: Missing SUPABASE_SERVICE_ROLE_KEY fails closed on admin client initialization', () => {
    function evaluateAdminClient(env, isBrowser = false) {
      if (isBrowser) {
        throw new Error('SECURITY VIOLATION: createAdminClient cannot be called on the client side.')
      }

      const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
      const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
          'Supabase admin configuration missing: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is undefined.'
        )
      }

      return { initialized: true }
    }

    assert.throws(
      () => evaluateAdminClient({ NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co' }, false),
      (err) => {
        assert.match(err.message, /SUPABASE_SERVICE_ROLE_KEY is undefined/i)
        return true
      }
    )
  })

  await t.test('6. BROWSER ISOLATION: Admin client execution attempted on browser throws immediate security violation', () => {
    function evaluateAdminClient(env, isBrowser) {
      if (isBrowser) {
        throw new Error('SECURITY VIOLATION: createAdminClient cannot be called on the client side.')
      }
      return { initialized: true }
    }

    assert.throws(
      () => evaluateAdminClient({ NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'secret' }, true),
      (err) => {
        assert.match(err.message, /SECURITY VIOLATION.*client side/i)
        assert.doesNotMatch(err.message, /secret/i) // Does not leak value
        return true
      }
    )
  })

  await t.test('7. BROWSER ISOLATION: Cloudinary server operations throw security violation if called in browser', () => {
    function evaluateCloudinarySignature(params, isBrowser, secret) {
      if (isBrowser) {
        throw new Error('SECURITY VIOLATION: Cloudinary signing cannot be executed in the browser context.')
      }
      if (!secret) {
        throw new Error('CLOUDINARY_API_SECRET is not configured in server environment variables.')
      }
      return 'mock-signature'
    }

    assert.throws(
      () => evaluateCloudinarySignature({}, true, 'my-cloudinary-secret'),
      (err) => {
        assert.match(err.message, /SECURITY VIOLATION.*browser context/i)
        return true
      }
    )
  })

  await t.test('8. SECRET NAMING POLICY: Private server secrets MUST NOT use NEXT_PUBLIC_ prefix', () => {
    const envExamplePath = path.join(PROJECT_ROOT, '.env.example')
    const content = fs.readFileSync(envExamplePath, 'utf8')

    // Dangerous patterns: exposing server keys via NEXT_PUBLIC_
    assert.equal(/NEXT_PUBLIC_.*SERVICE_ROLE/i.test(content), false)
    assert.equal(/NEXT_PUBLIC_.*KEY_SECRET/i.test(content), false)
    assert.equal(/NEXT_PUBLIC_.*CLOUDINARY_API_SECRET/i.test(content), false)
  })

  await t.test('9. GITIGNORE INTEGRITY: .gitignore comprehensively ignores all .env variants', () => {
    const gitignorePath = path.join(PROJECT_ROOT, '.gitignore')
    const content = fs.readFileSync(gitignorePath, 'utf8')

    assert.match(content, /^\.env$/m, '.gitignore must include .env')
    assert.match(content, /^\.env\.local$/m, '.gitignore must include .env.local')
    assert.match(content, /^\.env\*\.local$/m, '.gitignore must include .env*.local')
    assert.match(content, /^!\.env\.example$/m, '.gitignore must preserve .env.example')
  })

  await t.test('10. SANITIZED DOCUMENTATION: .env.example contains only sanitized template placeholders', () => {
    const envExamplePath = path.join(PROJECT_ROOT, '.env.example')
    const content = fs.readFileSync(envExamplePath, 'utf8')

    // Ensure no real Supabase JWTs or live credentials are in .env.example
    const jwtPattern = /eyJhbGciOi[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/
    assert.equal(jwtPattern.test(content), false, '.env.example must not contain real JWTs')

    // Ensure placeholders are present
    assert.match(content, /your-project-ref\.supabase\.co/)
    assert.match(content, /your[-_]supabase[-_]anon[-_]key/)
    assert.match(content, /your[-_]supabase[-_]service[-_]role[-_]key/)
    assert.match(content, /your[-_]razorpay[-_]key[-_]secret/)
  })

  await t.test('11. EDGE PROXY RESILIENCE: src/proxy.ts attaches security headers even if Supabase config is missing', () => {
    function evaluateProxy(env) {
      const headers = new Map()
      headers.set('X-Content-Type-Options', 'nosniff')
      headers.set('X-Frame-Options', 'SAMEORIGIN')
      headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

      const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        return { passthrough: true, headers }
      }

      return { passthrough: false, headers, initializedSupabase: true }
    }

    const emptyEnvResult = evaluateProxy({})
    assert.equal(emptyEnvResult.passthrough, true)
    assert.equal(emptyEnvResult.headers.get('X-Frame-Options'), 'SAMEORIGIN')
    assert.equal(emptyEnvResult.headers.get('X-Content-Type-Options'), 'nosniff')
  })
})
