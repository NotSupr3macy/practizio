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

  const query = searchParams.get('query') || searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const location = searchParams.get('location') || ''
  const service = searchParams.get('service') || ''
  const agentId = request.headers.get('x-agent-identifier') || request.headers.get('user-agent') || 'unknown'

  let dbQuery = supabase
    .from('practices')
    .select('id, slug, name, industry, tags, address, phone, website, additional_info, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Text search across name and industry
  if (query) {
    dbQuery = dbQuery.or(`name.ilike.%${query}%,industry.ilike.%${query}%`)
  }

  // Category filter (matches industry or tags)
  if (category) {
    dbQuery = dbQuery.or(`industry.ilike.%${category}%,tags.cs.{${category}}`)
  }

  // Location filter (search in address JSON)
  if (location) {
    dbQuery = dbQuery.or(`address->>city.ilike.%${location}%,address->>state.ilike.%${location}%,address->>zip.ilike.%${location}%`)
  }

  const { data: practices } = await dbQuery

  // Additional client-side filtering for service name search
  let filtered = practices ?? []
  if (service && filtered.length > 0) {
    const practiceIds = filtered.map((p) => p.id)
    const { data: matchingServices } = await supabase
      .from('services')
      .select('practice_id')
      .in('practice_id', practiceIds)
      .ilike('name', `%${service}%`)

    if (matchingServices) {
      const matchingPracticeIds = new Set(matchingServices.map((s) => s.practice_id))
      filtered = filtered.filter((p) => matchingPracticeIds.has(p.id))
    }
  }

  // Log search appearances for each practice returned (non-blocking)
  if (filtered.length > 0) {
    const searchQuery = [query, category, location, service].filter(Boolean).join(' ') || 'directory_browse'
    const appearances = filtered.map((p) => ({
      practice_id: p.id,
      query_text: searchQuery,
      agent_identifier: agentId,
    }))
    supabase.from('search_appearances').insert(appearances).then(() => {})
  }

  const directory = filtered.map((p) => ({
    name: p.name,
    industry: p.industry,
    tags: p.tags,
    slug: p.slug,
    mcp_endpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/mcp/${p.slug}`,
    address: p.address,
    phone: p.phone,
    website: p.website,
    additional_info: p.additional_info,
    profile_url: `${process.env.NEXT_PUBLIC_APP_URL}/biz/${p.slug}`,
  }))

  return NextResponse.json({
    directory,
    total: directory.length,
    mcp_base_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mcp`,
    updated_at: new Date().toISOString(),
  })
}
