import { z } from 'zod'
import { SupabaseClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

type ToolResult = { content: Array<{ type: 'text'; text: string }> }

type ToolDefinition = {
  name: string
  description: string
  inputSchema?: z.ZodObject<z.ZodRawShape>
  handler: (params: Record<string, unknown>) => Promise<ToolResult>
}

// ---------------------------------------------------------------------------
// Helper: log every tool invocation to ai_queries
// ---------------------------------------------------------------------------

async function logQuery(
  supabase: SupabaseClient,
  practiceId: string,
  toolCalled: string,
  queryPayload: unknown,
  responsePayload: unknown,
  agentIdentifier?: string
) {
  await supabase.from('ai_queries').insert({
    practice_id: practiceId,
    tool_called: toolCalled,
    agent_identifier: agentIdentifier ?? null,
    query_payload: queryPayload ?? {},
    response_payload: responsePayload ?? {},
  })
}

function textResult(data: unknown): ToolResult {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] }
}

// ---------------------------------------------------------------------------
// 1. get_catalog — list available catalog items, optionally filtered by category
// ---------------------------------------------------------------------------

export function getCatalogTool(supabase: SupabaseClient, practiceId: string): ToolDefinition {
  return {
    name: 'get_catalog',
    description:
      'List all available items in the catalog (menu, products, etc.) with prices and options. Optionally filter by category.',
    inputSchema: z.object({
      category: z.string().optional().describe('Optional category name to filter items by'),
    }),
    handler: async (params) => {
      const { category } = params as { category?: string }

      let query = supabase
        .from('catalog_items')
        .select('id, name, description, price, options, category')
        .eq('practice_id', practiceId)
        .eq('is_available', true)

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query.order('category').order('name')

      if (error) {
        const result = { error: 'Failed to retrieve catalog items.' }
        await logQuery(supabase, practiceId, 'get_catalog', params, result)
        return textResult(result)
      }

      // Group items by category
      const grouped: Record<string, Array<{
        id: string
        name: string
        description: string | null
        price: number
        options: unknown
        category: string
      }>> = {}

      for (const item of data ?? []) {
        const cat = item.category ?? 'Uncategorized'
        if (!grouped[cat]) grouped[cat] = []
        grouped[cat].push({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price / 100,
          options: item.options,
          category: cat,
        })
      }

      const result = { catalog: grouped, total_items: (data ?? []).length }
      await logQuery(supabase, practiceId, 'get_catalog', params, result)
      return textResult(result)
    },
  }
}

// ---------------------------------------------------------------------------
// 2. place_order — create a new order with line items
// ---------------------------------------------------------------------------

export function placeOrderTool(
  supabase: SupabaseClient,
  practiceId: string,
  practiceName: string
): ToolDefinition {
  return {
    name: 'place_order',
    description:
      'Place a new order with one or more items from the catalog. Requires customer name, phone, and at least one item.',
    inputSchema: z.object({
      customer_name: z.string().describe('Full name of the customer'),
      customer_phone: z.string().describe('Phone number of the customer'),
      customer_email: z.string().optional().describe('Email address of the customer'),
      items: z
        .array(
          z.object({
            catalog_item_id: z.string().describe('ID of the catalog item to order'),
            quantity: z.number().describe('Quantity of this item'),
            options: z.record(z.string(), z.string()).optional().describe('Selected options for this item'),
            notes: z.string().optional().describe('Special instructions for this item'),
          })
        )
        .describe('Array of items to order'),
      notes: z.string().optional().describe('General notes or special instructions for the entire order'),
    }),
    handler: async (params) => {
      const {
        customer_name,
        customer_phone,
        customer_email,
        items,
        notes,
      } = params as {
        customer_name: string
        customer_phone: string
        customer_email?: string
        items: Array<{
          catalog_item_id: string
          quantity: number
          options?: Record<string, string>
          notes?: string
        }>
        notes?: string
      }

      // Generate order number: ORD- + 8 random alphanumeric chars
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let orderNumber = 'ORD-'
      for (let i = 0; i < 8; i++) {
        orderNumber += chars.charAt(Math.floor(Math.random() * chars.length))
      }

      // Look up each catalog item to get name and price
      const catalogItemIds = items.map((i) => i.catalog_item_id)
      const { data: catalogItems, error: catalogError } = await supabase
        .from('catalog_items')
        .select('id, name, price')
        .eq('practice_id', practiceId)
        .in('id', catalogItemIds)

      if (catalogError || !catalogItems || catalogItems.length === 0) {
        const result = { error: 'Failed to look up catalog items. Please verify item IDs are correct.' }
        await logQuery(supabase, practiceId, 'place_order', params, result)
        return textResult(result)
      }

      const catalogMap = new Map(catalogItems.map((ci) => [ci.id, ci]))

      // Validate all items exist
      for (const item of items) {
        if (!catalogMap.has(item.catalog_item_id)) {
          const result = { error: `Catalog item not found: ${item.catalog_item_id}` }
          await logQuery(supabase, practiceId, 'place_order', params, result)
          return textResult(result)
        }
      }

      // Calculate subtotal
      let subtotal = 0
      const lineItems = items.map((item) => {
        const catalogItem = catalogMap.get(item.catalog_item_id)!
        const lineTotal = catalogItem.price * item.quantity
        subtotal += lineTotal
        return {
          catalog_item_id: item.catalog_item_id,
          item_name: catalogItem.name,
          unit_price: catalogItem.price,
          quantity: item.quantity,
          line_total: lineTotal,
          options: item.options ?? null,
          notes: item.notes ?? null,
        }
      })

      // Insert order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          practice_id: practiceId,
          order_number: orderNumber,
          customer_name,
          customer_phone,
          customer_email: customer_email ?? null,
          status: 'pending',
          subtotal,
          total: subtotal,
          notes: notes ?? null,
        })
        .select('id')
        .single()

      if (orderError || !order) {
        const result = { error: 'Failed to create order. Please try again.' }
        await logQuery(supabase, practiceId, 'place_order', params, result)
        return textResult(result)
      }

      // Insert order items
      const orderItemRows = lineItems.map((li) => ({
        order_id: order.id,
        catalog_item_id: li.catalog_item_id,
        item_name: li.item_name,
        unit_price: li.unit_price,
        quantity: li.quantity,
        line_total: li.line_total,
        options: li.options,
        notes: li.notes,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItemRows)

      if (itemsError) {
        const result = { error: 'Order created but failed to save line items. Please contact support.' }
        await logQuery(supabase, practiceId, 'place_order', params, result)
        return textResult(result)
      }

      const result = {
        order_number: orderNumber,
        customer_name,
        items: lineItems.map((li) => ({
          name: li.item_name,
          quantity: li.quantity,
          unit_price: li.unit_price / 100,
          line_total: li.line_total / 100,
        })),
        subtotal: subtotal / 100,
        total: subtotal / 100,
        currency: 'USD',
        status: 'pending',
        message: `Order ${orderNumber} has been placed successfully at ${practiceName}. Your order is now pending.`,
      }

      await logQuery(supabase, practiceId, 'place_order', params, result)
      return textResult(result)
    },
  }
}

// ---------------------------------------------------------------------------
// 3. get_order_status — look up an existing order by order number
// ---------------------------------------------------------------------------

export function getOrderStatusTool(supabase: SupabaseClient, practiceId: string): ToolDefinition {
  return {
    name: 'get_order_status',
    description:
      'Look up the status and details of an existing order by its order number.',
    inputSchema: z.object({
      order_number: z.string().describe('The order number (e.g. ORD-abc12345)'),
    }),
    handler: async (params) => {
      const { order_number } = params as { order_number: string }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('id, order_number, status, customer_name, subtotal, total, notes, created_at')
        .eq('practice_id', practiceId)
        .eq('order_number', order_number)
        .single()

      if (orderError || !order) {
        const result = { error: `Order not found: ${order_number}` }
        await logQuery(supabase, practiceId, 'get_order_status', params, result)
        return textResult(result)
      }

      const { data: orderItems } = await supabase
        .from('order_items')
        .select('item_name, unit_price, quantity, line_total, options, notes')
        .eq('order_id', order.id)

      const result = {
        order_number: order.order_number,
        status: order.status,
        customer_name: order.customer_name,
        items: (orderItems ?? []).map((oi) => ({
          name: oi.item_name,
          quantity: oi.quantity,
          unit_price: oi.unit_price / 100,
          line_total: oi.line_total / 100,
          options: oi.options,
          notes: oi.notes,
        })),
        subtotal: order.subtotal / 100,
        total: order.total / 100,
        currency: 'USD',
        notes: order.notes,
        created_at: order.created_at,
      }

      await logQuery(supabase, practiceId, 'get_order_status', params, result)
      return textResult(result)
    },
  }
}

// ---------------------------------------------------------------------------
// 4. cancel_order — cancel a pending or confirmed order
// ---------------------------------------------------------------------------

export function cancelOrderTool(supabase: SupabaseClient, practiceId: string): ToolDefinition {
  return {
    name: 'cancel_order',
    description:
      'Cancel an existing order. Requires the order number and customer phone for verification. Only pending or confirmed orders can be cancelled.',
    inputSchema: z.object({
      order_number: z.string().describe('The order number to cancel'),
      customer_phone: z.string().describe('Customer phone number for verification'),
    }),
    handler: async (params) => {
      const { order_number, customer_phone } = params as {
        order_number: string
        customer_phone: string
      }

      // Look up order and verify phone
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('id, order_number, status, customer_phone')
        .eq('practice_id', practiceId)
        .eq('order_number', order_number)
        .single()

      if (orderError || !order) {
        const result = { error: `Order not found: ${order_number}` }
        await logQuery(supabase, practiceId, 'cancel_order', params, result)
        return textResult(result)
      }

      // Verify customer phone
      if (order.customer_phone !== customer_phone) {
        const result = { error: 'Phone number does not match order records. Cancellation denied.' }
        await logQuery(supabase, practiceId, 'cancel_order', params, result)
        return textResult(result)
      }

      // Check if order can be cancelled
      if (order.status !== 'pending' && order.status !== 'confirmed') {
        const result = {
          error: `Order cannot be cancelled. Current status: ${order.status}. Only pending or confirmed orders can be cancelled.`,
        }
        await logQuery(supabase, practiceId, 'cancel_order', params, result)
        return textResult(result)
      }

      // Update status to cancelled
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', order.id)

      if (updateError) {
        const result = { error: 'Failed to cancel order. Please try again.' }
        await logQuery(supabase, practiceId, 'cancel_order', params, result)
        return textResult(result)
      }

      const result = {
        order_number,
        status: 'cancelled',
        message: `Order ${order_number} has been successfully cancelled.`,
      }

      await logQuery(supabase, practiceId, 'cancel_order', params, result)
      return textResult(result)
    },
  }
}

// ---------------------------------------------------------------------------
// 5. get_menu_categories — list distinct categories with item counts
// ---------------------------------------------------------------------------

export function getMenuCategoriesTool(supabase: SupabaseClient, practiceId: string): ToolDefinition {
  return {
    name: 'get_menu_categories',
    description:
      'List all available categories (e.g. menu sections, product categories) with the number of items in each.',
    handler: async () => {
      const { data, error } = await supabase
        .from('catalog_items')
        .select('category')
        .eq('practice_id', practiceId)
        .eq('is_available', true)

      if (error) {
        const result = { error: 'Failed to retrieve categories.' }
        await logQuery(supabase, practiceId, 'get_menu_categories', {}, result)
        return textResult(result)
      }

      // Count items per category
      const counts: Record<string, number> = {}
      for (const item of data ?? []) {
        const cat = item.category ?? 'Uncategorized'
        counts[cat] = (counts[cat] ?? 0) + 1
      }

      const categories = Object.entries(counts)
        .map(([name, count]) => ({ name, item_count: count }))
        .sort((a, b) => a.name.localeCompare(b.name))

      const result = { categories, total_categories: categories.length }
      await logQuery(supabase, practiceId, 'get_menu_categories', {}, result)
      return textResult(result)
    },
  }
}
