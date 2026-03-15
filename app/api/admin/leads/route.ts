import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

function isAdmin(email: string | undefined): boolean {
  if (!email) return false
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
  return adminEmails.includes(email.toLowerCase())
}

export async function PATCH(req: Request) {
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
  const { id, status } = body

  if (!id || !status) {
    return NextResponse.json(
      { error: 'id and status are required' },
      { status: 400 }
    )
  }

  const validStatuses = [
    'new',
    'contacted',
    'setup_in_progress',
    'setup_complete',
    'not_interested',
  ]

  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
      { status: 400 }
    )
  }

  const { error } = await admin
    .from('leads')
    .update({ status })
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: `Failed to update lead: ${error.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
