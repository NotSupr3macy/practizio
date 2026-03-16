import { NextRequest } from 'next/server'
import { z } from 'zod'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createAdminClient } from '@/lib/supabase/admin'

// ---------------------------------------------------------------------------
// CORS headers
// ---------------------------------------------------------------------------

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, mcp-session-id, Authorization',
  'Access-Control-Expose-Headers': 'mcp-session-id',
}

function corsResponse(body: string | null, status: number, extra?: Record<string, string>) {
  return new Response(body, { status, headers: { ...CORS_HEADERS, ...extra } })
}

// ---------------------------------------------------------------------------
// Build the root MCP server — directory-level gateway
// ---------------------------------------------------------------------------

function buildDirectoryMcpServer() {
  const supabase = createAdminClient()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://spadechat.com'

  const server = new McpServer({
    name: 'spadechat-directory',
    version: '1.0.0',
  })

  // --- search_businesses ---
  server.tool(
    'search_businesses',
    'Search the SpadeChat business directory. Find businesses by name, industry/category, location (city/state/zip), or service offered. Returns business details and their MCP endpoints for booking.',
    {
      query: z.string().optional().describe('Search by business name or industry (e.g. "yoga", "salon", "restaurant")'),
      category: z.string().optional().describe('Filter by industry category (e.g. "Yoga Studio", "Hair Salon", "Restaurant")'),
      location: z.string().optional().describe('Filter by city, state, or zip code'),
      service: z.string().optional().describe('Filter by service name (e.g. "Hot Yoga", "Haircut", "Massage")'),
    },
    async (params) => {
      let dbQuery = supabase
        .from('practices')
        .select('slug, name, industry, tags, address, phone, website, additional_info, interaction_type')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (params.query) {
        dbQuery = dbQuery.or(`name.ilike.%${params.query}%,industry.ilike.%${params.query}%`)
      }
      if (params.category) {
        dbQuery = dbQuery.or(`industry.ilike.%${params.category}%,tags.cs.{${params.category}}`)
      }
      if (params.location) {
        dbQuery = dbQuery.or(`address->>city.ilike.%${params.location}%,address->>state.ilike.%${params.location}%,address->>zip.ilike.%${params.location}%`)
      }

      const { data: practices } = await dbQuery

      let filtered = practices ?? []

      // Service-level filtering
      if (params.service && filtered.length > 0) {
        const practiceIds = filtered.map((p) => p.slug)
        const idMap = Object.fromEntries(filtered.map((p) => [p.slug, p]))
        const realIds = filtered.map((p) => {
          // We need actual IDs for service query — re-fetch
          return p
        })

        // Get practice IDs for service matching
        const { data: allPractices } = await supabase
          .from('practices')
          .select('id, slug')
          .in('slug', practiceIds)

        if (allPractices) {
          const slugToId = Object.fromEntries(allPractices.map((p) => [p.slug, p.id]))
          const ids = Object.values(slugToId)

          const { data: matchingServices } = await supabase
            .from('services')
            .select('practice_id')
            .in('practice_id', ids)
            .ilike('name', `%${params.service}%`)

          if (matchingServices) {
            const matchingIds = new Set(matchingServices.map((s) => s.practice_id))
            const idToSlug = Object.fromEntries(allPractices.map((p) => [p.id, p.slug]))
            const matchingSlugs = new Set(
              [...matchingIds].map((id) => idToSlug[id]).filter(Boolean)
            )
            filtered = filtered.filter((p) => matchingSlugs.has(p.slug))
          }
        }
      }

      const businesses = filtered.map((p) => {
        const tools: string[] = ['get_business_info']
        if (p.interaction_type === 'appointment' || p.interaction_type === 'hybrid') {
          tools.push('get_services', 'check_availability', 'book_appointment', 'cancel_appointment')
        }
        if (p.interaction_type === 'order' || p.interaction_type === 'hybrid') {
          tools.push('get_catalog', 'place_order', 'get_order_status', 'cancel_order')
        }

        return {
          name: p.name,
          industry: p.industry,
          tags: p.tags ?? [],
          address: p.address,
          phone: p.phone,
          website: p.website,
          mcp_endpoint: `${baseUrl}/api/mcp/${p.slug}`,
          available_tools: tools,
          profile_url: `${baseUrl}/biz/${p.slug}`,
        }
      })

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            results: businesses,
            total: businesses.length,
            usage_hint: 'To interact with a business (book appointments, place orders, etc.), connect to its mcp_endpoint URL and use the available_tools listed.',
          }),
        }],
      }
    }
  )

  // --- list_all_businesses ---
  server.tool(
    'list_all_businesses',
    'List all businesses registered on SpadeChat with their MCP endpoints. Use this to see every available business.',
    async () => {
      const { data: practices } = await supabase
        .from('practices')
        .select('slug, name, industry, tags, address, interaction_type')
        .eq('is_active', true)
        .order('name')

      const businesses = (practices ?? []).map((p) => ({
        name: p.name,
        industry: p.industry,
        tags: p.tags ?? [],
        city: p.address?.city ?? null,
        state: p.address?.state ?? null,
        mcp_endpoint: `${baseUrl}/api/mcp/${p.slug}`,
        interaction_type: p.interaction_type ?? 'appointment',
      }))

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            businesses,
            total: businesses.length,
            usage_hint: 'Connect to any mcp_endpoint to book appointments, place orders, or get business details.',
          }),
        }],
      }
    }
  )

  // --- get_business_details ---
  server.tool(
    'get_business_details',
    'Get detailed information about a specific business including services, hours, location, and how to book. Provide the business name or slug.',
    {
      name_or_slug: z.string().describe('Business name or slug identifier'),
    },
    async (params) => {
      const { data: practice } = await supabase
        .from('practices')
        .select('id, slug, name, industry, tags, address, phone, website, additional_info, interaction_type, timezone')
        .eq('is_active', true)
        .or(`slug.eq.${params.name_or_slug},name.ilike.%${params.name_or_slug}%`)
        .limit(1)
        .single()

      if (!practice) {
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ error: 'Business not found.' }) }],
        }
      }

      // Fetch services
      const { data: services } = await supabase
        .from('services')
        .select('name, description, duration_minutes, price_min, price_max')
        .eq('practice_id', practice.id)

      // Fetch hours
      const { data: availability } = await supabase
        .from('practice_availability')
        .select('day_of_week, open_time, close_time, is_open')
        .eq('practice_id', practice.id)
        .order('day_of_week')

      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const hours: Record<string, string> = {}
      for (const a of availability ?? []) {
        const day = dayNames[a.day_of_week] ?? `Day ${a.day_of_week}`
        hours[day] = a.is_open ? `${a.open_time} - ${a.close_time}` : 'Closed'
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            name: practice.name,
            industry: practice.industry,
            tags: practice.tags ?? [],
            address: practice.address,
            phone: practice.phone,
            website: practice.website,
            timezone: practice.timezone,
            hours,
            services: (services ?? []).map((s) => ({
              name: s.name,
              description: s.description,
              duration_minutes: s.duration_minutes,
              price_range: s.price_min && s.price_max
                ? `$${s.price_min} - $${s.price_max}`
                : s.price_min ? `$${s.price_min}` : null,
            })),
            additional_info: practice.additional_info ?? {},
            mcp_endpoint: `${baseUrl}/api/mcp/${practice.slug}`,
            usage_hint: 'To book an appointment or place an order, connect to the mcp_endpoint and use the booking/order tools.',
          }),
        }],
      }
    }
  )

  return server
}

// ---------------------------------------------------------------------------
// OPTIONS — CORS preflight
// ---------------------------------------------------------------------------

export async function OPTIONS() {
  return corsResponse(null, 204)
}

// ---------------------------------------------------------------------------
// POST — Main MCP protocol endpoint
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const server = buildDirectoryMcpServer()

    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    })

    await server.connect(transport)
    const response = await transport.handleRequest(request)

    const headers = new Headers(response.headers)
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      headers.set(key, value)
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  } catch (error) {
    console.error('[MCP Directory] POST error:', error)
    return corsResponse(
      JSON.stringify({ error: 'Internal server error' }),
      500,
      { 'Content-Type': 'application/json' }
    )
  }
}

// ---------------------------------------------------------------------------
// GET — Info endpoint
// ---------------------------------------------------------------------------

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://spadechat.com'

  return corsResponse(
    JSON.stringify({
      name: 'SpadeChat Directory',
      description: 'AI-first business directory. Search and discover businesses, then connect to their individual MCP endpoints to book appointments, place orders, and more.',
      mcp_endpoint: `${baseUrl}/api/mcp`,
      protocol: 'MCP',
      transport: 'Streamable HTTP',
      tools: ['search_businesses', 'list_all_businesses', 'get_business_details'],
      usage: 'Send MCP protocol requests via POST to this endpoint to search the directory. Each business has its own MCP endpoint for booking/ordering.',
    }),
    200,
    { 'Content-Type': 'application/json' }
  )
}

// ---------------------------------------------------------------------------
// DELETE — Session cleanup (no-op in stateless mode)
// ---------------------------------------------------------------------------

export async function DELETE() {
  return corsResponse(
    JSON.stringify({ message: 'Session terminated (stateless — no-op).' }),
    200,
    { 'Content-Type': 'application/json' }
  )
}
