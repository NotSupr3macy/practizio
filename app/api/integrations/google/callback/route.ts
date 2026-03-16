import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const error = request.nextUrl.searchParams.get('error')
  const from = request.nextUrl.searchParams.get('state') || 'settings'

  // Determine redirect destination based on where the OAuth started
  const successUrl = from === 'onboarding'
    ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?google_connected=true`
    : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?google_connected=true`
  const errorBaseUrl = from === 'onboarding'
    ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`

  if (error || !code) {
    return NextResponse.redirect(`${errorBaseUrl}?google_error=denied`)
  }

  // Exchange code for tokens
  const clientId = process.env.GOOGLE_CLIENT_ID!
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/google/callback`

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokens.access_token) {
      console.error('[Google OAuth] Token exchange failed:', tokens)
      return NextResponse.redirect(`${errorBaseUrl}?google_error=token_failed`)
    }

    // Get the user's primary calendar ID
    const calendarResponse = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary',
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    )
    const calendarData = await calendarResponse.json()
    const calendarId = calendarData.id || 'primary'

    // Get the authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(`${errorBaseUrl}?google_error=not_authenticated`)
    }

    // Get their practice
    const { data: practice } = await supabase
      .from('practices')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!practice) {
      return NextResponse.redirect(`${errorBaseUrl}?google_error=no_practice`)
    }

    // Store credentials using admin client (bypasses RLS for insert)
    const adminSupabase = createAdminClient()

    // Upsert credentials
    const { error: upsertError } = await adminSupabase
      .from('credentials')
      .upsert(
        {
          practice_id: practice.id,
          booking_system: 'google_calendar',
          credential_type: 'oauth',
          access_token_encrypted: tokens.access_token,
          refresh_token_encrypted: tokens.refresh_token || null,
          token_expires_at: tokens.expires_in
            ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
            : null,
          calendar_id: calendarId,
          is_valid: true,
          last_validated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'practice_id,booking_system' }
      )

    if (upsertError) {
      console.error('[Google OAuth] Credential store failed:', upsertError)
      return NextResponse.redirect(`${errorBaseUrl}?google_error=store_failed`)
    }

    // Update practice to mark Google Calendar as connected
    await adminSupabase
      .from('practices')
      .update({ booking_system_connected: true })
      .eq('id', practice.id)

    return NextResponse.redirect(successUrl)
  } catch (err) {
    console.error('[Google OAuth] Callback error:', err)
    return NextResponse.redirect(`${errorBaseUrl}?google_error=unknown`)
  }
}
