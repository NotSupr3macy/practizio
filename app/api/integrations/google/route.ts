import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET — Start OAuth flow (redirect to Google consent screen)
export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 })
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/google/callback`

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly',
    access_type: 'offline',
    prompt: 'consent', // Force consent to always get refresh token
  })

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}

// DELETE — Disconnect Google Calendar
export async function DELETE() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get practice
  const { data: practice } = await supabase
    .from('practices')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!practice) {
    return NextResponse.json({ error: 'Practice not found' }, { status: 404 })
  }

  // Delete credential
  await supabase
    .from('credentials')
    .delete()
    .eq('practice_id', practice.id)
    .eq('booking_system', 'google_calendar')

  return NextResponse.json({ success: true })
}
