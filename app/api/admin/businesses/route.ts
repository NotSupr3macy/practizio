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

export async function GET() {
  // Auth check
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const admin = createAdminClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  // Fetch practices and AI query counts in parallel
  const [practicesRes, aiQueriesRes] = await Promise.all([
    admin.from('practices').select('*').order('created_at', { ascending: false }),
    admin.from('ai_queries').select('practice_id').gte('created_at', startOfMonth),
  ])

  const queryCounts: Record<string, number> = {}
  if (aiQueriesRes.data) {
    for (const q of aiQueriesRes.data) {
      queryCounts[q.practice_id] = (queryCounts[q.practice_id] || 0) + 1
    }
  }

  const practices = (practicesRes.data || []).map((p) => ({
    ...p,
    ai_queries_this_month: queryCounts[p.id] || 0,
  }))

  return NextResponse.json({ practices })
}
