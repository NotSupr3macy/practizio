import { NextRequest } from 'next/server'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  getPracticeInfoTool,
  getServicesTool,
  getProvidersTool,
  checkAvailabilityTool,
  bookAppointmentTool,
} from '@/lib/mcp/tools'

// ---------------------------------------------------------------------------
// CORS headers — AI agents will call this endpoint cross-origin
// ---------------------------------------------------------------------------

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, mcp-session-id',
  'Access-Control-Expose-Headers': 'mcp-session-id',
}

function corsResponse(body: string | null, status: number, extra?: Record<string, string>) {
  return new Response(body, {
    status,
    headers: { ...CORS_HEADERS, ...extra },
  })
}

// ---------------------------------------------------------------------------
// Resolve practice from slug
// ---------------------------------------------------------------------------

async function resolvePractice(slug: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('practices')
    .select('id, name, is_active')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  if (!data.is_active) return null
  return { id: data.id as string, name: data.name as string }
}

// ---------------------------------------------------------------------------
// Build an MCP server with all tools registered for a given practice
// ---------------------------------------------------------------------------

function buildMcpServer(slug: string, practiceId: string, practiceName: string) {
  const supabase = createAdminClient()

  const server = new McpServer({
    name: `practizio-${slug}`,
    version: '1.0.0',
  })

  // --- Register tools ---

  const practiceInfo = getPracticeInfoTool(supabase, practiceId)
  server.tool(practiceInfo.name, practiceInfo.description, practiceInfo.handler)

  const services = getServicesTool(supabase, practiceId)
  server.tool(services.name, services.description, services.handler)

  const providers = getProvidersTool(supabase, practiceId)
  server.tool(providers.name, providers.description, providers.handler)

  const availability = checkAvailabilityTool(supabase, practiceId)
  server.tool(
    availability.name,
    availability.description,
    availability.inputSchema!.shape,
    async (params: Record<string, unknown>) => availability.handler(params)
  )

  const booking = bookAppointmentTool(supabase, practiceId, practiceName)
  server.tool(
    booking.name,
    booking.description,
    booking.inputSchema!.shape,
    async (params: Record<string, unknown>) => booking.handler(params)
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
// POST — Main MCP protocol endpoint (stateless)
// ---------------------------------------------------------------------------

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params

  const practice = await resolvePractice(slug)
  if (!practice) {
    return corsResponse(JSON.stringify({ error: 'Practice not found' }), 404, {
      'Content-Type': 'application/json',
    })
  }

  try {
    const server = buildMcpServer(slug, practice.id, practice.name)

    // Stateless mode: no session persistence across requests
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    })

    await server.connect(transport)

    const response = await transport.handleRequest(request)

    // Append CORS headers to the response returned by the transport
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
// GET — SSE stream (method not supported in stateless mode)
// ---------------------------------------------------------------------------

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params

  const practice = await resolvePractice(slug)
  if (!practice) {
    return corsResponse(JSON.stringify({ error: 'Practice not found' }), 404, {
      'Content-Type': 'application/json',
    })
  }

  return corsResponse(
    JSON.stringify({
      error: 'SSE transport is not supported in stateless mode. Use POST for MCP requests.',
    }),
    405,
    { 'Content-Type': 'application/json' }
  )
}

// ---------------------------------------------------------------------------
// DELETE — Session cleanup (no-op in stateless mode)
// ---------------------------------------------------------------------------

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params

  const practice = await resolvePractice(slug)
  if (!practice) {
    return corsResponse(JSON.stringify({ error: 'Practice not found' }), 404, {
      'Content-Type': 'application/json',
    })
  }

  return corsResponse(
    JSON.stringify({ message: 'Session terminated (stateless — no-op).' }),
    200,
    { 'Content-Type': 'application/json' }
  )
}
