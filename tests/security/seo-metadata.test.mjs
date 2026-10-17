import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

test('Task 16 Suite: SEO, Canonical URLs & Metadata Validation', async (t) => {
  const rootDir = process.cwd()

  await t.test('1. CANONICAL BASELINE: Production domain is primehomekanpur.vercel.app', () => {
    const layoutContent = fs.readFileSync(
      path.join(rootDir, 'src', 'app', 'layout.tsx'),
      'utf-8'
    )
    const sitemapContent = fs.readFileSync(
      path.join(rootDir, 'src', 'app', 'sitemap.ts'),
      'utf-8'
    )
    const robotsContent = fs.readFileSync(
      path.join(rootDir, 'src', 'app', 'robots.ts'),
      'utf-8'
    )

    const expectedDomain = 'https://primehomekanpur.vercel.app'

    assert.ok(
      layoutContent.includes(expectedDomain),
      'Layout metadata must use primehomekanpur.vercel.app'
    )
    assert.ok(
      sitemapContent.includes(expectedDomain),
      'Sitemap must default to primehomekanpur.vercel.app'
    )
    assert.ok(
      robotsContent.includes(expectedDomain),
      'Robots.txt must reference sitemap on primehomekanpur.vercel.app'
    )
  })

  await t.test('2. ZERO STALE DOMAINS: No prime-home-kanpur.netlify.app references exist', () => {
    const checkFiles = [
      path.join(rootDir, 'src', 'app', 'layout.tsx'),
      path.join(rootDir, 'src', 'app', 'sitemap.ts'),
      path.join(rootDir, 'src', 'app', 'robots.ts'),
    ]

    for (const file of checkFiles) {
      const content = fs.readFileSync(file, 'utf-8')
      assert.ok(
        !content.includes('netlify.app'),
        `File ${path.basename(file)} must not contain netlify.app references`
      )
    }
  })

  await t.test('3. SITEMAP PRIVACY: Dashboard, landlord, admin, and API paths are excluded', () => {
    const sitemapContent = fs.readFileSync(
      path.join(rootDir, 'src', 'app', 'sitemap.ts'),
      'utf-8'
    )

    const privatePaths = ['/admin', '/dashboard', '/landlord', '/api', '/auth']
    for (const p of privatePaths) {
      assert.ok(
        !sitemapContent.includes(`'${p}'`) && !sitemapContent.includes(`"${p}"`),
        `Sitemap must not include private route ${p}`
      )
    }
  })

  await t.test('4. ROBOTS.TXT PROTECTION: Private and sensitive paths are disallowed', () => {
    const robotsContent = fs.readFileSync(
      path.join(rootDir, 'src', 'app', 'robots.ts'),
      'utf-8'
    )

    assert.ok(robotsContent.includes("'/admin/'"), 'Robots must disallow /admin/')
    assert.ok(robotsContent.includes("'/dashboard/'"), 'Robots must disallow /dashboard/')
    assert.ok(robotsContent.includes("'/landlord/'"), 'Robots must disallow /landlord/')
    assert.ok(robotsContent.includes("'/api/'"), 'Robots must disallow /api/')
  })

  await t.test('5. STRUCTURED DATA INTEGRITY: JSON-LD uses RealEstateAgent schema without fabricated reviews', () => {
    const layoutContent = fs.readFileSync(
      path.join(rootDir, 'src', 'app', 'layout.tsx'),
      'utf-8'
    )

    assert.ok(layoutContent.includes('"@type": "RealEstateAgent"'), 'Must define RealEstateAgent schema')
    assert.ok(layoutContent.includes('"telephone": "+919151435647"'), 'Must include official Kanpur desk telephone')
    assert.ok(layoutContent.includes('"addressLocality": "Kanpur"'), 'Must specify Kanpur locality')
    assert.ok(layoutContent.includes('"addressRegion": "Uttar Pradesh"'), 'Must specify Uttar Pradesh')
    // Ensure no fabricated aggregateRating in static layout JSON-LD
    assert.ok(!layoutContent.includes('"aggregateRating"'), 'Static layout JSON-LD must not fabricate fake star ratings')
  })
})
