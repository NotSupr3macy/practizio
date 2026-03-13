import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createAdminClient()

  const { data: practices } = await supabase
    .from('practices')
    .select('slug, name, practice_type, address, phone, website')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const directory = (practices || []).map((p) => ({
    name: p.name,
    type: p.practice_type,
    slug: p.slug,
    mcp_endpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/mcp/${p.slug}`,
    address: p.address,
    phone: p.phone,
    website: p.website,
  }))

  return NextResponse.json({
    directory,
    total: directory.length,
    mcp_base_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mcp`,
    updated_at: new Date().toISOString(),
  })
}
