import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: practice } = await supabase
      .from('practices')
      .select('id, skip_connection_count')
      .eq('user_id', user.id)
      .single()

    if (!practice) {
      return NextResponse.json({ error: 'Practice not found' }, { status: 404 })
    }

    await supabase
      .from('practices')
      .update({ skip_connection_count: (practice.skip_connection_count || 0) + 1 })
      .eq('id', practice.id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
