import path from 'path'

export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export const ALLOWED_DOCUMENT_MIMES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const

export const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'] as const

/**
 * Validates actual binary magic bytes of the uploaded file buffer.
 * Defends against MIME-spoofing attacks (e.g. uploading .exe or .html with image/jpeg header).
 */
export function validateDocumentMagicBytes(buffer: Buffer): {
  valid: boolean
  detectedMime?: string
  error?: string
} {
  if (!buffer || buffer.length < 4) {
    return { valid: false, error: 'File buffer is too small or empty to verify magic headers.' }
  }

  // 1. PDF: %PDF (0x25 0x50 0x44 0x46)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return { valid: true, detectedMime: 'application/pdf' }
  }

  // 2. PNG: 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, detectedMime: 'image/png' }
  }

  // 3. JPEG/JPG: 0xFF 0xD8 0xFF
  if (
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { valid: true, detectedMime: 'image/jpeg' }
  }

  return {
    valid: false,
    error: 'Binary signature mismatch. Only authentic PDF, PNG, and JPEG documents are permitted.',
  }
}

/**
 * Sanitizes uploaded file names by stripping path traversal sequences and dangerous characters.
 * Cross-platform compatible (normalizes both Windows \ and POSIX / separators).
 */
export function sanitizeDocumentFileName(fileName: string): string {
  // Normalize both Windows and POSIX separators to defend against path traversal on all operating systems
  const normalized = (fileName || '').replace(/\\/g, '/')
  const base = path.posix.basename(normalized).trim()

  // Strip null bytes, directory climbing artifacts, and dangerous characters
  const clean = base
    .replace(/\0/g, '')
    .replace(/\.\.+/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 100)

  return clean || 'document'
}
