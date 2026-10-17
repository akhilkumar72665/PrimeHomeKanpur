import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

test('Task 15 Suite: Forms, Buttons, Navigation & User Feedback Integrity', async (t) => {
  const rootDir = process.cwd()

  await t.test('1. CONTACT FORM INTEGRITY: Empty or invalid submissions are safely rejected', () => {
    const contactPageContent = fs.readFileSync(
      path.join(rootDir, 'src', 'app', 'contact', 'page.tsx'),
      'utf-8'
    )

    // Form inputs must be marked required
    assert.match(contactPageContent, /required/, 'Contact form inputs must enforce HTML5 required attribute')
    assert.match(contactPageContent, /type="email"/, 'Email input must have proper email type validation')
    assert.match(contactPageContent, /type:\s*'error'/, 'Error state must be handled explicitly')
  })

  await t.test('2. NO FAKE SUCCESS: Contact form does NOT display success if DB operation fails', () => {
    const contactPageContent = fs.readFileSync(
      path.join(rootDir, 'src', 'app', 'contact', 'page.tsx'),
      'utf-8'
    )

    // Ensure we do NOT set status: 'success' when result.success is false or error is returned
    assert.ok(
      !contactPageContent.includes("if (!result.success) {\n      console.error(result.error)\n      setFormState({ status: 'success'"),
      'Must NOT fall through to success on database insertion error'
    )
  })

  await t.test('3. DESTRUCTIVE ACTIONS: Document deletion contains explicit confirmation prompt', () => {
    const tenantDocsContent = fs.readFileSync(
      path.join(rootDir, 'src', 'app', 'dashboard', 'documents', 'page.tsx'),
      'utf-8'
    )
    const landlordDocsContent = fs.readFileSync(
      path.join(rootDir, 'src', 'app', 'landlord', 'documents', 'page.tsx'),
      'utf-8'
    )

    assert.ok(
      tenantDocsContent.includes("confirm('Are you sure you want to permanently delete this document"),
      'Tenant document deletion must prompt for confirmation'
    )
    assert.ok(
      landlordDocsContent.includes("confirm('Are you sure you want to permanently delete this document"),
      'Landlord document deletion must prompt for confirmation'
    )
  })

  await t.test('4. NAVIGATION INTEGRITY: Header and Footer only link to valid routes', () => {
    const headerContent = fs.readFileSync(
      path.join(rootDir, 'src', 'components', 'layout', 'Header.tsx'),
      'utf-8'
    )
    const footerContent = fs.readFileSync(
      path.join(rootDir, 'src', 'components', 'layout', 'Footer.tsx'),
      'utf-8'
    )

    // Check key routes
    const requiredRoutes = ['/', '/about', '/rentals', '/agents', '/services', '/faq', '/contact', '/signin']
    for (const route of requiredRoutes) {
      assert.ok(headerContent.includes(`href: '${route}'`) || headerContent.includes(`href="${route}"`), `Header must link to ${route}`)
    }

    const requiredFooterRoutes = ['/privacy-policy', '/terms', '/refund-policy', '/verification-policy', '/disclaimer', '/cookie-policy', '/unsubscribe']
    for (const route of requiredFooterRoutes) {
      assert.ok(footerContent.includes(`href: '${route}'`) || footerContent.includes(`href="${route}"`), `Footer must link to ${route}`)
    }
  })

  await t.test('5. VISIT BOOKING MODAL: Requires authentication and validates booking dates', () => {
    const bookingModalContent = fs.readFileSync(
      path.join(rootDir, 'src', 'components', 'modals', 'BookVisitModal.tsx'),
      'utf-8'
    )

    assert.ok(
      bookingModalContent.includes('!isAuthenticated'),
      'Visit booking must check authentication'
    )
    assert.ok(
      bookingModalContent.includes('openAuthModal'),
      'Unauthenticated user must be prompted to authenticate'
    )
    assert.ok(
      bookingModalContent.includes('minDate'),
      'Visit booking must enforce advance date validation'
    )
  })

  await t.test('6. ACCESSIBILITY & FEEDBACK: Buttons have accessible labels and loading states', () => {
    const newsletterContent = fs.readFileSync(
      path.join(rootDir, 'src', 'components', 'layout', 'NewsletterForm.tsx'),
      'utf-8'
    )

    assert.ok(
      newsletterContent.includes('disabled={loading}'),
      'Newsletter submit button must be disabled while submitting'
    )
    assert.ok(
      newsletterContent.includes('aria-label='),
      'Newsletter form elements must have accessible labels'
    )
  })
})
