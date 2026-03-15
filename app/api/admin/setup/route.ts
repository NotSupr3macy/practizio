import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, adminSetupInviteEmail } from '@/lib/email/resend'

function isAdmin(email: string | undefined): boolean {
  if (!email) return false
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
  return adminEmails.includes(email.toLowerCase())
}

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  const suffix = Math.random().toString(36).substring(2, 6)
  return `${base}-${suffix}`
}

export async function POST(req: Request) {
  // Auth check
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const admin = createAdminClient()

  const body = await req.json()
  const { name, email, industry, interaction_type, phone, website, address } = body

  if (!name || !email || !industry) {
    return NextResponse.json(
      { error: 'Name, email, and industry are required' },
      { status: 400 }
    )
  }

  // Check if user already exists (e.g. from lead signup)
  let userId: string

  const { data: existingUsers } = await admin.auth.admin.listUsers()
  const existingUser = existingUsers?.users?.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  )

  if (existingUser) {
    // Check if they already have a practice
    const { data: existingPractice } = await admin
      .from('practices')
      .select('id')
      .eq('user_id', existingUser.id)
      .single()

    if (existingPractice) {
      return NextResponse.json(
        { error: 'This user already has a business set up' },
        { status: 400 }
      )
    }

    userId = existingUser.id
  } else {
    // Create new auth user
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
    })

    if (authError) {
      return NextResponse.json(
        { error: `Failed to create user: ${authError.message}` },
        { status: 400 }
      )
    }

    userId = authData.user.id
  }
  const slug = generateSlug(name)

  // Create practice
  const { data: practice, error: practiceError } = await admin
    .from('practices')
    .insert({
      user_id: userId,
      name,
      slug,
      industry,
      interaction_type: interaction_type || 'appointment',
      phone: phone || null,
      website: website || null,
      address: address || null,
      plan: 'free',
      is_active: true,
      tags: [],
      additional_info: {},
      booking_system_connected: false,
      timezone: 'America/New_York',
      default_hold_minutes: 30,
    })
    .select()
    .single()

  if (practiceError) {
    return NextResponse.json(
      { error: `Failed to create practice: ${practiceError.message}` },
      { status: 500 }
    )
  }

  // Generate a password reset link so the user can set their password
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  let resetPasswordUrl = `${appUrl}/login`

  try {
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${appUrl}/callback`,
      },
    })

    if (linkData?.properties?.action_link) {
      // Replace redirect_to to point to /reset instead of /callback
      resetPasswordUrl = linkData.properties.action_link.replace(
        /redirect_to=[^&]*/,
        `redirect_to=${encodeURIComponent(`${appUrl}/reset`)}`
      )
    }
    if (linkError) {
      console.error('Failed to generate reset link:', linkError)
    }
  } catch (err) {
    console.error('Error generating reset link:', err)
  }

  // Send invite email to the business owner (non-blocking)
  sendEmail({
    to: email,
    subject: `${name} is now AI-bookable on SpadeChat!`,
    html: adminSetupInviteEmail({
      businessName: name,
      dashboardUrl: `${appUrl}/dashboard`,
      resetPasswordUrl,
    }),
  }).catch(err => console.error('Failed to send setup invite email:', err))

  return NextResponse.json({ practice })
}
