import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rateLimit'
import { z } from 'zod'

const createPropertySchema = z.object({
  title: z
    .string()
    .min(5, 'Listing title must be at least 5 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  locality: z.string().min(2, 'Locality is required'),
  address: z
    .string()
    .min(5, 'Full physical address must be at least 5 characters')
    .max(250, 'Address cannot exceed 250 characters'),
  bhk: z.coerce.number().int().min(1, 'BHK must be at least 1').max(10),
  bathrooms: z.coerce.number().int().min(1, 'Bathrooms must be at least 1').max(10),
  rent: z.coerce.number().positive('Monthly rent must be a positive amount').min(500, 'Minimum rent is ₹500'),
  deposit: z.coerce.number().nonnegative().optional().nullable(),
  maintenance: z.coerce.number().nonnegative().optional().nullable(),
  furnishing: z.enum(['Unfurnished', 'Semi-Furnished', 'Fully Furnished', 'Fully-Furnished']),
  tenantType: z.enum(['Family', 'Bachelor', 'Professional', 'Any']),
  description: z.string().max(2000, 'Description cannot exceed 2000 characters').optional().nullable(),
  phone: z
    .string()
    .min(10, 'Valid 10-digit phone number is required')
    .max(15, 'Phone number cannot exceed 15 digits'),
  propertyType: z.string().optional().default('Apartment'),
  areaSqft: z.coerce.number().positive().optional().nullable(),
})

// GET: Fetch authenticated landlord's owned properties
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to view your properties.' },
        { status: 401 }
      )
    }

    const { data: properties, error } = await supabase
      .from('properties')
      .select(`
        *,
        location:locations(id, name, city)
      `)
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[DATABASE ERROR] Failed to fetch landlord properties:', error)
      return NextResponse.json(
        { error: 'Failed to retrieve properties.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      properties: properties || [],
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}

// POST: Landlord submits a new property listing for verification
export async function POST(request: Request) {
  try {
    // 1. Authenticate Landlord Session (Derive owner strictly from auth)
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in as a landlord to list a property.' },
        { status: 401 }
      )
    }

    // 2. Rate Limiting: Max 5 property submissions per 10 minutes
    const limit = rateLimit(`landlord-prop-${user.id}`, 5, 600000)
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Submission limit reached. Please wait a few minutes before adding another property.' },
        { status: 429 }
      )
    }

    // 3. Payload Parsing & Validation
    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { error: 'Missing or malformed JSON payload.' },
        { status: 400 }
      )
    }

    const validation = createPropertySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error.issues[0]?.message || 'Invalid property parameters',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const data = validation.data

    // 4. Duplicate Prevention (Check if user submitted exact title & address)
    const { data: existingProp } = await supabase
      .from('properties')
      .select('id, title, status')
      .eq('created_by', user.id)
      .ilike('title', data.title.trim())
      .ilike('address', data.address.trim())
      .maybeSingle()

    if (existingProp) {
      return NextResponse.json(
        {
          error: 'A property with this title and address has already been submitted to your account.',
          propertyId: existingProp.id,
        },
        { status: 409 }
      )
    }

    // 5. Resolve Location ID in Kanpur
    const { data: loc } = await supabase
      .from('locations')
      .select('id')
      .ilike('name', data.locality.trim())
      .maybeSingle()

    const locationId = loc?.id || null

    // 6. Generate SEO & Database Unique Slug
    const baseSlug = `${data.title}-${data.locality}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50)
    const slug = `${baseSlug}-${Date.now().toString(36)}`

    // 7. Calculate sensible area if not supplied
    const areaSqft = data.areaSqft || data.bhk * 450

    // 8. Honest Persistence: Enter DRAFT (Pending Physical Verification)
    // CRITICAL SECURITY RULE: status is hardcoded to 'DRAFT'. Client payload cannot auto-approve!
    // created_by is hardcoded to user.id. Client payload cannot assign another owner!
    const { data: newProperty, error: insertError } = await supabase
      .from('properties')
      .insert({
        slug,
        title: data.title.trim(),
        description: data.description?.trim() || `Verified rental property in ${data.locality}, Kanpur. Contact phone: ${data.phone}`,
        price: Math.round(data.rent),
        security_deposit: data.deposit ? Math.round(data.deposit) : null,
        maintenance: data.maintenance ? Math.round(data.maintenance) : 0,
        property_type: data.propertyType || 'Apartment',
        listing_type: 'RENT',
        bhk: Math.round(data.bhk),
        bathrooms: Math.round(data.bathrooms),
        area_sqft: Math.round(areaSqft),
        tenant_type: data.tenantType,
        furnishing: data.furnishing,
        status: 'DRAFT', // Always DRAFT until admin/staff physical verification walkthrough
        location_id: locationId,
        address: data.address.trim(),
        created_by: user.id, // Strictly derived from session
        featured: false,
      })
      .select('*')
      .single()

    if (insertError) {
      console.error('[DATABASE ERROR] Failed to create property listing:', insertError)
      return NextResponse.json(
        { error: 'Failed to record property in database.' },
        { status: 500 }
      )
    }

    // 9. Audit Logging
    try {
      await supabase.from('activity_logs').insert({
        actor_id: user.id,
        actor_email: user.email || 'landlord',
        action: 'LANDLORD_PROPERTY_SUBMITTED',
        entity: 'properties',
        entity_id: newProperty.id,
        summary: `New listing submitted for verification: ${newProperty.title} (${data.locality})`,
        details: {
          slug: newProperty.slug,
          rent: newProperty.price,
          bhk: newProperty.bhk,
          locality: data.locality,
          phone: data.phone,
        },
      })
    } catch {
      // Non-blocking telemetry
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Property listing submitted successfully for verification walkthrough.',
        property: newProperty,
      },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('[SERVER ERROR] Landlord property submission error:', err)
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred during submission.' },
      { status: 500 }
    )
  }
}
