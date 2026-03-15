import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { sendEmail, leadConfirmationEmail } from '@/lib/email/resend'

// Simple in-memory rate limiting for lead submissions
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5 // max 5 submissions per IP per hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600_000 }) // 1 hour window
    return true
  }
  entry.count++
  return entry.count <= RATE_LIMIT
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { business_name, owner_name, email, phone, booking_system, referral_source, referred_by_slug } = body

    // Validate required fields
    if (!business_name || !owner_name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: business_name, owner_name, and email are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { error } = await supabase.from('leads').insert({
      business_name,
      owner_name,
      email,
      phone: phone || null,
      booking_system: booking_system || "I don't use one yet",
      referral_source: referral_source || null,
      referred_by_slug: referred_by_slug || null,
      status: 'new',
    })

    if (error) {
      console.error('Failed to insert lead:', error)
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      )
    }

    // Send confirmation email (non-blocking)
    sendEmail({
      to: email,
      subject: `Thanks, ${owner_name}! We'll set up ${business_name} on SpadeChat`,
      html: leadConfirmationEmail({ ownerName: owner_name, businessName: business_name }),
    }).catch(err => console.error('Failed to send lead confirmation email:', err))

    return NextResponse.json(
      { success: true, message: 'Lead created' },
      { status: 201 }
    )
  } catch (err) {
    console.error('Lead submission error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Check authentication
    const serverClient = await createClient()
    const { data: { user }, error: authError } = await serverClient.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim()).filter(Boolean)
    if (!user.email || !adminEmails.includes(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const supabase = createAdminClient()
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch leads:', error)
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
    }

    return NextResponse.json({ leads })
  } catch (err) {
    console.error('Leads GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
