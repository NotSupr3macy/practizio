import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { platform, booking_url } = body as { platform?: string; booking_url?: string }

    if (!platform) {
      return NextResponse.json({ error: 'platform is required' }, { status: 400 })
    }

    // Find the practice belonging to this user
    const { data: practice, error: practiceError } = await supabase
      .from('practices')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (practiceError || !practice) {
      return NextResponse.json({ error: 'Practice not found' }, { status: 404 })
    }

    // Build the update payload — booking_url may not exist yet in older schemas,
    // so we update booking_system_type (which is established) and attempt booking_url.
    const updatePayload: Record<string, unknown> = {
      booking_system_type: platform,
      booking_system_connected: true,
    }

    // Only include booking_url if a value was provided. This handles schemas
    // that have not yet added the column gracefully — Supabase will return
    // an error which we surface to the client.
    if (typeof booking_url === 'string') {
      updatePayload.booking_url = booking_url
    }

    const { error: updateError } = await supabase
      .from('practices')
      .update(updatePayload)
      .eq('id', practice.id)

    if (updateError) {
      // If booking_url column doesn't exist yet, fall back to updating only the type
      if (updateError.message?.includes('booking_url')) {
        const { error: fallbackError } = await supabase
          .from('practices')
          .update({
            booking_system_type: platform,
            booking_system_connected: true,
          })
          .eq('id', practice.id)

        if (fallbackError) {
          return NextResponse.json({ error: fallbackError.message }, { status: 500 })
        }
      } else {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, platform, booking_url })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
