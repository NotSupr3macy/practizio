import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Rate limiting: 30 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 30

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  entry.count++
  return entry.count <= RATE_LIMIT
}

export async function GET(request: NextRequest) {
  // Rate limit
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    )
  }

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)

  const query = searchParams.get('query') || ''
  const location = searchParams.get('location') || ''
  const category = searchParams.get('category') || ''
  const service = searchParams.get('service') || ''
  const radiusMiles = parseInt(searchParams.get('radius_miles') || '25')

  let dbQuery = supabase
    .from('practices')
    .select('id, slug, name, industry, tags, address, phone, website, additional_info')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (query) {
    dbQuery = dbQuery.or(`name.ilike.%${query}%,industry.ilike.%${query}%`)
  }

  if (category) {
    dbQuery = dbQuery.or(`industry.ilike.%${category}%,tags.cs.{${category}}`)
  }

  if (location) {
    dbQuery = dbQuery.or(
      `address->>city.ilike.%${location}%,address->>state.ilike.%${location}%,address->>zip.ilike.%${location}%`
    )
  }

  const { data: practices } = await dbQuery

  let filtered = practices ?? []

  // Filter by service if specified
  if (service && filtered.length > 0) {
    const ids = filtered.map((p) => p.id)
    const { data: matchingServices } = await supabase
      .from('services')
      .select('practice_id')
      .in('practice_id', ids)
      .ilike('name', `%${service}%`)

    if (matchingServices) {
      const matchIds = new Set(matchingServices.map((s) => s.practice_id))
      filtered = filtered.filter((p) => matchIds.has(p.id))
    }
  }

  // Log search appearances (non-blocking)
  if (filtered.length > 0) {
    const agentId = request.headers.get('x-agent-identifier') || request.headers.get('user-agent') || 'unknown'
    const searchQuery = [query, category, location, service].filter(Boolean).join(' ') || 'search'
    const appearances = filtered.map((p) => ({
      practice_id: p.id,
      query_text: searchQuery,
      agent_identifier: agentId,
    }))
    supabase.from('search_appearances').insert(appearances).then(() => {})
  }

  const results = filtered.map((p) => ({
    name: p.name,
    industry: p.industry,
    tags: p.tags,
    address: p.address,
    phone: p.phone,
    website: p.website,
    mcp_endpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/mcp/${p.slug}`,
    profile_url: `${process.env.NEXT_PUBLIC_APP_URL}/biz/${p.slug}`,
    additional_info: p.additional_info,
  }))

  return NextResponse.json({
    results,
    total: results.length,
    query: { query, location, category, service, radius_miles: radiusMiles },
  })
}
