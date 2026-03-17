import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { booking_system_name } = body as { booking_system_name?: string }

    if (!booking_system_name?.trim()) {
      return NextResponse.json({ error: 'booking_system_name is required' }, { status: 400 })
    }

    const { data: practice } = await supabase
      .from('practices')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!practice) {
      return NextResponse.json({ error: 'Practice not found' }, { status: 404 })
    }

    const { error: insertError } = await supabase
      .from('integration_requests')
      .insert({
        practice_id: practice.id,
        booking_system_name: booking_system_name.trim(),
      })

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
