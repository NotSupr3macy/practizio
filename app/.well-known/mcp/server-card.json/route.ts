import { NextResponse } from 'next/server'

export async function GET() {
  const serverCard = {
    serverInfo: {
      name: 'SpadeChat Directory',
      version: '1.0.0',
    },
    authentication: {
      required: false,
    },
    tools: [
      {
        name: 'search_businesses',
        description: 'Search the SpadeChat business directory. Find businesses by name, industry/category, location (city/state/zip), or service offered. Returns business details and their MCP endpoints for booking.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search by business name or industry (e.g. "yoga", "salon", "restaurant")' },
            category: { type: 'string', description: 'Filter by industry category (e.g. "Yoga Studio", "Hair Salon")' },
            location: { type: 'string', description: 'Filter by city, state, or zip code' },
            service: { type: 'string', description: 'Filter by service name (e.g. "Hot Yoga", "Haircut")' },
          },
        },
      },
      {
        name: 'list_all_businesses',
        description: 'List all businesses registered on SpadeChat with their MCP endpoints. Use this to see every available business.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_business_details',
        description: 'Get detailed information about a specific business including services, hours, location, and how to book. Provide the business name or slug.',
        inputSchema: {
          type: 'object',
          properties: {
            name_or_slug: { type: 'string', description: 'Business name or slug identifier' },
          },
          required: ['name_or_slug'],
        },
      },
    ],
    resources: [],
    prompts: [],
  }

  return NextResponse.json(serverCard, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
