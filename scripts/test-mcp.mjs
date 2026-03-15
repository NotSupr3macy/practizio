/**
 * MCP End-to-End Test Script
 *
 * Tests the full AI-agent flow against your local MCP endpoints:
 *   1. Initializes an MCP session
 *   2. Lists available tools
 *   3. Calls get_business_info
 *   4. For appointment businesses: get_services → check_availability → book_appointment
 *   5. For order businesses: get_catalog → place_order
 *
 * Usage:  node scripts/test-mcp.mjs [slug]
 *         Defaults to testing all businesses if no slug is given.
 */

const BASE_URL = 'http://localhost:3000/api/mcp'

// ── MCP JSON-RPC helpers ────────────────────────────────────────────────

let requestId = 0

function rpc(method, params = {}) {
  return { jsonrpc: '2.0', id: ++requestId, method, params }
}

async function mcpRequest(slug, body) {
  const res = await fetch(`${BASE_URL}/${slug}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
    body: JSON.stringify(body),
  })

  const contentType = res.headers.get('content-type') || ''
  const text = await res.text()

  // SSE format: parse "event: message\ndata: {...}\n\n" blocks
  if (contentType.includes('text/event-stream')) {
    const jsonMessages = []
    for (const line of text.split('\n')) {
      if (line.startsWith('data: ')) {
        try { jsonMessages.push(JSON.parse(line.slice(6))) } catch {}
      }
    }
    return jsonMessages[jsonMessages.length - 1]
  }

  // Plain JSON (single or newline-delimited)
  const lines = text.split('\n').filter(Boolean)
  const results = lines.map((line) => JSON.parse(line))
  return results[results.length - 1]
}

async function initSession(slug) {
  const res = await mcpRequest(slug, rpc('initialize', {
    protocolVersion: '2025-03-26',
    capabilities: {},
    clientInfo: { name: 'spadechat-test-script', version: '1.0.0' },
  }))
  console.log(`  ✓ Session initialized (protocol: ${res?.result?.protocolVersion || 'unknown'})`)

  // Send initialized notification
  await fetch(`${BASE_URL}/${slug}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
  })
}

async function listTools(slug) {
  const res = await mcpRequest(slug, rpc('tools/list'))
  const tools = res?.result?.tools || []
  console.log(`  ✓ ${tools.length} tools available: ${tools.map((t) => t.name).join(', ')}`)
  return tools
}

async function callTool(slug, toolName, args = {}) {
  console.log(`  → Calling ${toolName}...`)
  const res = await mcpRequest(slug, rpc('tools/call', { name: toolName, arguments: args }))
  const content = res?.result?.content?.[0]?.text
  if (content) {
    const data = JSON.parse(content)
    console.log(`    ✓ Response:`, JSON.stringify(data, null, 2).split('\n').slice(0, 15).join('\n'))
    if (JSON.stringify(data, null, 2).split('\n').length > 15) console.log('    ... (truncated)')
    return data
  } else {
    console.log(`    ✗ Unexpected response:`, JSON.stringify(res, null, 2))
    return null
  }
}

// ── Test flows ──────────────────────────────────────────────────────────

async function testAppointmentFlow(slug) {
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`APPOINTMENT FLOW: ${slug}`)
  console.log('═'.repeat(60))

  await initSession(slug)
  await listTools(slug)

  // 1. Get business info
  await callTool(slug, 'get_business_info')

  // 2. Get services
  const servicesData = await callTool(slug, 'get_services')
  const services = servicesData?.services || []

  if (services.length === 0) {
    console.log('\n  ⚠ No services configured — skipping availability + booking')
    return
  }

  const serviceName = services[0].name
  console.log(`\n  Using service: "${serviceName}"`)

  // 3. Check availability (next 3 days)
  const today = new Date()
  const startDate = today.toISOString().split('T')[0]
  const endDate = new Date(today.getTime() + 3 * 86400000).toISOString().split('T')[0]

  const availData = await callTool(slug, 'check_availability', {
    start_date: startDate,
    end_date: endDate,
    service_type: serviceName,
  })

  const slots = availData?.available_slots || []
  if (slots.length === 0) {
    console.log('\n  ⚠ No available slots in the next 3 days — skipping booking')
    return
  }

  const slot = slots[0]
  console.log(`\n  Booking slot: ${slot.slot_id} (${slot.date} ${slot.start_time})`)

  // 4. Book appointment
  const booking = await callTool(slug, 'book_appointment', {
    customer_name: 'Test Customer',
    customer_phone: '555-0100',
    customer_email: 'test@example.com',
    slot_id: slot.slot_id,
    service_type: serviceName,
    notes: 'Automated test booking via MCP test script',
  })

  if (booking?.confirmation_id) {
    console.log(`\n  ✅ APPOINTMENT BOOKED! Confirmation: ${booking.confirmation_id}`)
    console.log(`     Check your dashboard → Appointments to see it.`)
  } else {
    console.log(`\n  ⚠ Booking response:`, JSON.stringify(booking, null, 2))
  }
}

async function testOrderFlow(slug) {
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`ORDER FLOW: ${slug}`)
  console.log('═'.repeat(60))

  await initSession(slug)
  await listTools(slug)

  // 1. Get business info
  await callTool(slug, 'get_business_info')

  // 2. Get catalog
  const catalogData = await callTool(slug, 'get_catalog', {})
  // Catalog may be flat array or grouped by category: { catalog: { "Category": [...] } }
  let items = catalogData?.items || []
  if (!items.length && catalogData?.catalog && typeof catalogData.catalog === 'object') {
    items = Object.values(catalogData.catalog).flat()
  }

  if (items.length === 0) {
    console.log('\n  ⚠ No catalog items configured — skipping order placement')
    return
  }

  const item = items[0]
  console.log(`\n  Ordering: "${item.name}" (${item.price ? '$' + item.price : 'no price'}) [id: ${item.id}]`)

  // 3. Place order — requires catalog_item_id, not name
  const order = await callTool(slug, 'place_order', {
    customer_name: 'Test Buyer',
    customer_phone: '555-0200',
    customer_email: 'buyer@example.com',
    items: [{ catalog_item_id: item.id, quantity: 1 }],
    notes: 'Automated test order via MCP test script',
  })

  if (order?.order_number || order?.order_id) {
    console.log(`\n  ✅ ORDER PLACED! Order: ${order.order_number || order.order_id}`)
    console.log(`     Check your dashboard → Orders to see it.`)
  } else {
    console.log(`\n  ⚠ Order response:`, JSON.stringify(order, null, 2))
  }
}

async function testInfoOnly(slug) {
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`INFO QUERY: ${slug}`)
  console.log('═'.repeat(60))

  await initSession(slug)
  await listTools(slug)
  await callTool(slug, 'get_business_info')
}

// ── Main ────────────────────────────────────────────────────────────────

const slugArg = process.argv[2]

const businesses = [
  { slug: 'fred-meyer-7jdy', type: 'appointment' },
  { slug: 'kay-jewlers-lx6z', type: 'order' },
  { slug: 'medical-place-nkkb', type: 'appointment' },
]

async function main() {
  console.log('🧪 SpadeChat MCP End-to-End Test')
  console.log(`   Target: ${BASE_URL}`)
  console.log(`   Time: ${new Date().toISOString()}\n`)

  const toTest = slugArg
    ? businesses.filter((b) => b.slug === slugArg || b.slug.startsWith(slugArg))
    : businesses

  if (toTest.length === 0) {
    console.log(`No business found matching "${slugArg}". Available:`)
    businesses.forEach((b) => console.log(`  - ${b.slug} (${b.type})`))
    process.exit(1)
  }

  for (const biz of toTest) {
    try {
      if (biz.type === 'appointment') {
        await testAppointmentFlow(biz.slug)
      } else if (biz.type === 'order') {
        await testOrderFlow(biz.slug)
      } else {
        await testInfoOnly(biz.slug)
      }
    } catch (err) {
      console.error(`\n  ✗ Error testing ${biz.slug}:`, err.message)
    }
  }

  console.log(`\n${'═'.repeat(60)}`)
  console.log('DONE — Check your dashboard for new entries in:')
  console.log('  • Analytics → AI Queries (all tool calls logged)')
  console.log('  • Appointments (booked appointments)')
  console.log('  • Orders (placed orders)')
  console.log('═'.repeat(60))
}

main().catch(console.error)
