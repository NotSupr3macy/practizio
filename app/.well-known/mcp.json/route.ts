import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createAdminClient()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://spadechat.com'

  // Fetch all active businesses
  const { data: practices } = await supabase
    .from('practices')
    .select('slug, name, industry, tags, interaction_type')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Build MCP server entries for each business
  const mcpServers: Record<string, {
    url: string
    name: string
    description: string
    transport: string
    capabilities: string[]
  }> = {}

  for (const p of practices || []) {
    const tools: string[] = ['get_business_info']

    if (p.interaction_type === 'appointment' || p.interaction_type === 'hybrid') {
      tools.push('get_services', 'get_providers', 'check_availability', 'book_appointment', 'cancel_appointment', 'get_payment_info', 'create_payment_intent')
    }
    if (p.interaction_type === 'order' || p.interaction_type === 'hybrid') {
      tools.push('get_menu_categories', 'get_catalog', 'place_order', 'get_order_status', 'cancel_order')
    }

    mcpServers[p.slug] = {
      url: `${baseUrl}/api/mcp/${p.slug}`,
      name: p.name,
      description: `${p.name} — ${p.industry}. Book appointments, check availability, and more via AI.`,
      transport: 'streamable-http',
      capabilities: tools,
    }
  }

  const response = {
    // MCP Server Card spec (SEP-1649)
    schema_version: '1.0',
    name: 'SpadeChat',
    description: 'AI-first business directory. Each business has its own MCP endpoint for booking appointments, placing orders, and more.',
    homepage: baseUrl,
    directory_url: `${baseUrl}/api/directory`,
    total_servers: Object.keys(mcpServers).length,
    transport: 'streamable-http',
    servers: mcpServers,
  }

  return NextResponse.json(response, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
