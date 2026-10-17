import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'

/**
 * Security & Functional Integration Evaluator: Branded 404 and Error Pages
 * Evaluates requirements from Task 14:
 * - src/app/not-found.tsx
 * - src/app/error.tsx
 * - Prevention of stack trace leakage, database errors, secrets in user-facing UI
 * - Navigation links to /rentals, /, /contact
 * - Real reset() mechanism
 */

test('Task 14 Security Suite: Branded 404 and Error Pages', async (t) => {
  const notFoundPath = path.resolve('src/app/not-found.tsx')
  const errorPath = path.resolve('src/app/error.tsx')

  await t.test('1. FILE EXISTENCE: src/app/not-found.tsx exists and is populated', () => {
    assert.equal(fs.existsSync(notFoundPath), true)
    const content = fs.readFileSync(notFoundPath, 'utf8')
    assert.ok(content.length > 500)
    assert.match(content, /Lost in Kanpur\?/i)
    assert.match(content, /\/rentals/i)
    assert.match(content, /\/contact/i)
  })

  await t.test('2. FILE EXISTENCE: src/app/error.tsx exists as client component with reset()', () => {
    assert.equal(fs.existsSync(errorPath), true)
    const content = fs.readFileSync(errorPath, 'utf8')
    assert.ok(content.startsWith("'use client'"))
    assert.match(content, /reset\(\)/)
    assert.match(content, /Something Went Wrong/i)
  })

  await t.test('3. PRIVACY DEFENSE: Error page does NOT dump error.stack or environment secrets to client DOM', () => {
    const content = fs.readFileSync(errorPath, 'utf8')
    assert.equal(content.includes('{error.stack}'), false)
    assert.equal(content.includes('error.stack'), false)
    assert.equal(content.includes('process.env'), false)
  })

  await t.test('4. LOCALITY DIRECTORY: 404 page provides direct search shortcuts to Kanpur neighborhoods', () => {
    const content = fs.readFileSync(notFoundPath, 'utf8')
    assert.match(content, /Kakadeo/i)
    assert.match(content, /Swaroop Nagar/i)
    assert.match(content, /Civil Lines/i)
  })
})
