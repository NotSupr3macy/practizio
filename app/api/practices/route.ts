import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils'
import { NextResponse } from 'next/server'
import { sendEmail, welcomeEmail } from '@/lib/email/resend'

interface ServicePricingPayload {
  price: number | null
  currency: string
  priceType: 'fixed' | 'starting_at' | 'varies' | 'free'
  depositRequired: boolean
  depositAmount: number | null
  paymentTiming: 'at_booking' | 'at_service' | 'deposit_then_remainder' | 'free'
}

interface ServicePayload {
  name: string
  price_min: number | null
  price_max: number | null
  duration_minutes: number | null
  description: string | null
  show_price?: boolean
  pricing?: ServicePricingPayload
  payment_link?: string
  reservation_hold_minutes?: number
}

interface AvailabilityPayload {
  day_of_week: number
  open_time: string
  close_time: string
  is_open: boolean
}

interface CatalogItemPayload {
  name: string
  category: string | null
  price: number // cents
  description: string | null
  options: Array<{ name: string; choices: string[] }>
}

interface CreatePracticeBody {
  name: string
  industry: string
  interaction_type?: 'appointment' | 'order' | 'hybrid'
  tags?: string[]
  phone: string | null
  website: string | null
  address: {
    street: string
    city: string
    state: string
    zip: string
  } | null
  additional_info?: Record<string, string>
  booking_system_type?: string
  services?: ServicePayload[]
  availability?: AvailabilityPayload[]
  business_rules?: {
    min_advance_hours: number
    max_advance_days: number
    buffer_minutes: number
    additional_rules: string
  }
  catalog_items?: CatalogItemPayload[]
  booking_url?: string | null
  payment_url?: string
  default_hold_minutes?: number
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: CreatePracticeBody = await request.json()

    if (!body.name || !body.industry) {
      return NextResponse.json(
        { error: 'Name and industry are required' },
        { status: 400 }
      )
    }

    const slug = generateSlug(body.name)

    const { data: practice, error: practiceError } = await supabase
      .from('practices')
      .insert({
        user_id: user.id,
        slug,
        name: body.name,
        industry: body.industry,
        tags: body.tags ?? [],
        phone: body.phone,
        website: body.website,
        address: body.address,
        additional_info: body.additional_info ?? {},
        interaction_type: body.interaction_type ?? 'appointment',
        booking_system_type: body.booking_system_type ?? 'internal',
        booking_url: body.booking_url ?? null,
        booking_system_connected: true,
        business_rules: body.business_rules ?? null,
        is_active: true,
        plan: 'free',
        timezone: 'America/New_York',
        payment_url: body.payment_url ?? null,
        default_hold_minutes: body.default_hold_minutes ?? 15,
      })
      .select()
      .single()

    if (practiceError) {
      return NextResponse.json({ error: practiceError.message }, { status: 500 })
    }

    if (body.services && body.services.length > 0) {
      const servicesData = body.services
        .filter((s) => s.name.trim() !== '')
        .map((service) => ({
          practice_id: practice.id,
          name: service.name,
          price_min: service.price_min,
          price_max: service.price_max,
          duration_minutes: service.duration_minutes,
          description: service.description,
          show_price: service.show_price ?? true,
          pricing: service.pricing ?? {
            price: null,
            currency: 'USD',
            priceType: 'fixed',
            depositRequired: false,
            depositAmount: null,
            paymentTiming: 'at_service',
          },
        }))

      if (servicesData.length > 0) {
        await supabase.from('services').insert(servicesData)
      }
    }

    // Insert catalog items for order/hybrid businesses
    if (body.catalog_items && body.catalog_items.length > 0) {
      const catalogData = body.catalog_items
        .filter((c) => c.name.trim() !== '')
        .map((item) => ({
          practice_id: practice.id,
          name: item.name,
          category: item.category,
          price: item.price,
          description: item.description,
          options: item.options ?? [],
          is_available: true,
        }))

      if (catalogData.length > 0) {
        await supabase.from('catalog_items').insert(catalogData)
      }
    }

    if (body.availability && body.availability.length > 0) {
      const availabilityData = body.availability.map((avail) => ({
        practice_id: practice.id,
        day_of_week: avail.day_of_week,
        open_time: avail.open_time,
        close_time: avail.close_time,
        is_open: avail.is_open,
      }))

      await supabase.from('availability').insert(availabilityData)
    }

    // Send welcome email (non-blocking)
    if (user.email) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://spadechat.com'
      sendEmail({
        to: user.email,
        subject: `${practice.name} is now AI-bookable on SpadeChat!`,
        html: welcomeEmail({
          businessName: practice.name,
          industry: body.industry || 'business',
          dashboardUrl: `${appUrl}/dashboard`,
          profileUrl: `${appUrl}/directory/${practice.slug}`,
        }),
      }).catch(err => console.error('Failed to send welcome email:', err))
    }

    return NextResponse.json({ practice }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: practices, error } = await supabase
      .from('practices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ practices })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
