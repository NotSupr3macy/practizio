import { NextRequest } from 'next/server'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  getBusinessInfoTool,
  getServicesTool,
  getProvidersTool,
  checkAvailabilityTool,
  bookAppointmentTool,
  cancelAppointmentTool,
} from '@/lib/mcp/tools'
import {
  getCatalogTool,
  placeOrderTool,
  getOrderStatusTool,
  cancelOrderTool,
  getMenuCategoriesTool,
} from '@/lib/mcp/order-tools'
import {
  getPaymentInfoTool,
  createPaymentIntentTool,
} from '@/lib/mcp/payment-tools'
import type { BusinessRules } from '@/types/database'

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
// Resolve practice from slug — now loads full config
// ---------------------------------------------------------------------------

async function resolvePractice(slug: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('practices')
    .select('id, name, is_active, booking_system_type, business_rules, industry, plan, interaction_type')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  if (!data.is_active) return null
  return {
    id: data.id as string,
    name: data.name as string,
    bookingSystemType: (data.booking_system_type as string) ?? 'internal',
    businessRules: (data.business_rules as BusinessRules) ?? null,
    industry: data.industry as string,
    plan: data.plan as string,
    interactionType: (data.interaction_type as string) ?? 'appointment',
  }
}

// ---------------------------------------------------------------------------
// Rate limiting — simple in-memory per-slug
// ---------------------------------------------------------------------------

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 60 // requests per minute

function checkRateLimit(slug: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(slug)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(slug, { count: 1, resetAt: now + 60_000 })
    return true
  }
  entry.count++
  return entry.count <= RATE_LIMIT
}

// ---------------------------------------------------------------------------
// Build MCP server with all tools for a practice
// ---------------------------------------------------------------------------

function buildMcpServer(
  slug: string,
  practice: {
    id: string
    name: string
    bookingSystemType: string
    businessRules: BusinessRules | null
    interactionType: string
  }
) {
  const supabase = createAdminClient()

  const server = new McpServer({
    name: `spadechat-${slug}`,
    version: '2.0.0',
  })

  // --- get_business_info (always registered) ---
  const bizInfo = getBusinessInfoTool(supabase, practice.id)
  server.tool(bizInfo.name, bizInfo.description, bizInfo.handler)

  // --- Appointment tools ---
  if (practice.interactionType === 'appointment' || practice.interactionType === 'hybrid') {
    const services = getServicesTool(supabase, practice.id)
    server.tool(services.name, services.description, services.handler)

    const providers = getProvidersTool(supabase, practice.id)
    server.tool(providers.name, providers.description, providers.handler)

    const availability = checkAvailabilityTool(
      supabase,
      practice.id,
      practice.bookingSystemType,
      practice.businessRules
    )
    server.tool(
      availability.name,
      availability.description,
      availability.inputSchema!.shape,
      async (params: Record<string, unknown>) => availability.handler(params)
    )

    const booking = bookAppointmentTool(
      supabase,
      practice.id,
      practice.name,
      practice.bookingSystemType,
      practice.businessRules
    )
    server.tool(
      booking.name,
      booking.description,
      booking.inputSchema!.shape,
      async (params: Record<string, unknown>) => booking.handler(params)
    )

    const cancel = cancelAppointmentTool(
      supabase,
      practice.id,
      practice.bookingSystemType,
      practice.businessRules
    )
    server.tool(
      cancel.name,
      cancel.description,
      cancel.inputSchema!.shape,
      async (params: Record<string, unknown>) => cancel.handler(params)
    )

    // --- Payment tools ---
    const paymentInfo = getPaymentInfoTool(
      supabase,
      practice.id,
      practice.bookingSystemType,
      practice.businessRules
    )
    server.tool(
      paymentInfo.name,
      paymentInfo.description,
      paymentInfo.inputSchema!.shape,
      async (params: Record<string, unknown>) => paymentInfo.handler(params)
    )

    const paymentIntent = createPaymentIntentTool(supabase, practice.id)
    server.tool(
      paymentIntent.name,
      paymentIntent.description,
      paymentIntent.inputSchema!.shape,
      async (params: Record<string, unknown>) => paymentIntent.handler(params)
    )
  }

  // --- Order tools ---
  if (practice.interactionType === 'order' || practice.interactionType === 'hybrid') {
    const menuCategories = getMenuCategoriesTool(supabase, practice.id)
    server.tool(menuCategories.name, menuCategories.description, menuCategories.handler)

    const catalog = getCatalogTool(supabase, practice.id)
    server.tool(
      catalog.name,
      catalog.description,
      catalog.inputSchema!.shape,
      async (params: Record<string, unknown>) => catalog.handler(params)
    )

    const placeOrder = placeOrderTool(supabase, practice.id, practice.name)
    server.tool(
      placeOrder.name,
      placeOrder.description,
      placeOrder.inputSchema!.shape,
      async (params: Record<string, unknown>) => placeOrder.handler(params)
    )

    const orderStatus = getOrderStatusTool(supabase, practice.id)
    server.tool(
      orderStatus.name,
      orderStatus.description,
      orderStatus.inputSchema!.shape,
      async (params: Record<string, unknown>) => orderStatus.handler(params)
    )

    const cancelOrder = cancelOrderTool(supabase, practice.id)
    server.tool(
      cancelOrder.name,
      cancelOrder.description,
      cancelOrder.inputSchema!.shape,
      async (params: Record<string, unknown>) => cancelOrder.handler(params)
    )
  }

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!checkRateLimit(slug)) {
    return corsResponse(
      JSON.stringify({ error: 'Rate limit exceeded. Max 60 requests per minute.' }),
      429,
      { 'Content-Type': 'application/json' }
    )
  }

  const practice = await resolvePractice(slug)
  if (!practice) {
    return corsResponse(JSON.stringify({ error: 'Business not found or inactive' }), 404, {
      'Content-Type': 'application/json',
    })
  }

  try {
    const server = buildMcpServer(slug, practice)

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
    console.error(`[MCP ${slug}] POST error:`, error)
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const practice = await resolvePractice(slug)
  if (!practice) {
    return corsResponse(JSON.stringify({ error: 'Business not found' }), 404, {
      'Content-Type': 'application/json',
    })
  }

  const tools: string[] = ['get_business_info']

  if (practice.interactionType === 'appointment' || practice.interactionType === 'hybrid') {
    tools.push('get_services', 'get_providers', 'check_availability', 'book_appointment', 'cancel_appointment', 'get_payment_info', 'create_payment_intent')
  }

  if (practice.interactionType === 'order' || practice.interactionType === 'hybrid') {
    tools.push('get_menu_categories', 'get_catalog', 'place_order', 'get_order_status', 'cancel_order')
  }

  return corsResponse(
    JSON.stringify({
      name: practice.name,
      industry: practice.industry,
      mcp_endpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/mcp/${slug}`,
      protocol: 'MCP',
      transport: 'Streamable HTTP',
      tools,
      usage: 'Send MCP protocol requests via POST to this endpoint.',
    }),
    200,
    { 'Content-Type': 'application/json' }
  )
}

// ---------------------------------------------------------------------------
// DELETE — Session cleanup (no-op in stateless mode)
// ---------------------------------------------------------------------------

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await params
  return corsResponse(
    JSON.stringify({ message: 'Session terminated (stateless — no-op).' }),
    200,
    { 'Content-Type': 'application/json' }
  )
}
