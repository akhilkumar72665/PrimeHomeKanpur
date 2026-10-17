/**
 * Environment Variables Security & Validation Module
 *
 * Guarantees:
 * 1. Strict separation of Public Client Config vs Private Server Secrets.
 * 2. Immediate fatal error if private secrets are accessed in browser context.
 * 3. Fails closed with non-sensitive error messages (no secret values in logs or errors).
 * 4. Validation boundaries for Supabase, Razorpay, and Cloudinary.
 */

export interface PublicEnvConfig {
  supabaseUrl: string
  supabaseAnonKey: string
  siteUrl: string
  cloudinaryCloudName?: string
  razorpayKeyId?: string
}

export interface ServerEnvSecrets {
  supabaseServiceRoleKey: string
  cloudinaryApiKey?: string
  cloudinaryApiSecret?: string
  razorpayKeySecret?: string
}

/**
 * Returns validated public environment variables safe for browser or server rendering.
 * Fails safely with clear, non-sensitive error messages if required keys are missing.
 */
export function getPublicEnv(): PublicEnvConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    const missing: string[] = []
    if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
    if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')

    throw new Error(
      `Configuration Error: Required public environment variable(s) missing: ${missing.join(', ')}.`
    )
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://primehomekanpur.vercel.app',
    cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  }
}

/**
 * Returns validated private server-only environment secrets.
 * STRICT SECURITY: Immediately throws if executed in a browser environment.
 */
export function getServerEnv(): ServerEnvSecrets {
  if (typeof window !== 'undefined') {
    throw new Error(
      'SECURITY VIOLATION: Private server secrets cannot be accessed in the browser context.'
    )
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error(
      'Configuration Error: SUPABASE_SERVICE_ROLE_KEY is missing in server environment.'
    )
  }

  return {
    supabaseServiceRoleKey: serviceRoleKey,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  }
}

/**
 * Checks the status of environment configuration without exposing secret values.
 */
export function auditEnvironmentConfiguration(): {
  publicConfigValid: boolean
  hasServiceRoleKey: boolean
  hasRazorpaySecret: boolean
  hasCloudinarySecret: boolean
} {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const hasAnon = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )

  return {
    publicConfigValid: hasUrl && hasAnon,
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    hasRazorpaySecret: Boolean(process.env.RAZORPAY_KEY_SECRET),
    hasCloudinarySecret: Boolean(process.env.CLOUDINARY_API_SECRET),
  }
}
