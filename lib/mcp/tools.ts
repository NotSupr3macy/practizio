import { z } from 'zod'
import { SupabaseClient } from '@supabase/supabase-js'
import { createAdapter } from '@/lib/adapters'
import type { BusinessRules } from '@/types/database'

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
// 1. get_business_info — industry-agnostic
// ---------------------------------------------------------------------------

export function getBusinessInfoTool(supabase: SupabaseClient, practiceId: string): ToolDefinition {
  return {
    name: 'get_business_info',
    description:
      'Get business details including name, industry, location, hours, contact info, and any additional information the business has configured.',
    handler: async () => {
      const [{ data: practice }, { data: availability }] = await Promise.all([
        supabase
          .from('practices')
          .select('name, industry, tags, address, phone, website, additional_info, timezone')
          .eq('id', practiceId)
          .single(),
        supabase
          .from('availability')
          .select('day_of_week, open_time, close_time, is_open')
          .eq('practice_id', practiceId)
          .order('day_of_week'),
      ])

      if (!practice) {
        const result = { error: 'Failed to retrieve business information.' }
        await logQuery(supabase, practiceId, 'get_business_info', {}, result)
        return textResult(result)
      }

      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const hours: Record<string, string> = {}
      for (const a of availability ?? []) {
        const day = dayNames[a.day_of_week] ?? `Day ${a.day_of_week}`
        hours[day] = a.is_open ? `${a.open_time} - ${a.close_time}` : 'Closed'
      }

      const result = {
        name: practice.name,
        industry: practice.industry,
        tags: practice.tags ?? [],
        address: practice.address,
        phone: practice.phone,
        website: practice.website,
        hours,
        timezone: practice.timezone,
        additional_info: practice.additional_info ?? {},
      }

      await logQuery(supabase, practiceId, 'get_business_info', {}, result)
      return textResult(result)
    },
  }
}

// ---------------------------------------------------------------------------
// 2. get_services
// ---------------------------------------------------------------------------

export function getServicesTool(supabase: SupabaseClient, practiceId: string): ToolDefinition {
  return {
    name: 'get_services',
    description:
      'List all services offered by this business with durations, descriptions, pricing, and payment requirements.',
    handler: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, price_min, price_max, duration_minutes, description, show_price, pricing')
        .eq('practice_id', practiceId)

      if (error) {
        const result = { error: 'Failed to retrieve services.' }
        await logQuery(supabase, practiceId, 'get_services', {}, result)
        return textResult(result)
      }

      const services = (data ?? []).map((s) => {
        const pricing = s.pricing as {
          price: number | null
          currency: string
          priceType: string
          depositRequired: boolean
          depositAmount: number | null
          paymentTiming: string
        } | null

        return {
          service_id: s.id,
          name: s.name,
          description: s.description,
          duration_minutes: s.duration_minutes,
          pricing: pricing ? {
            price: pricing.price,
            currency: pricing.currency || 'USD',
            priceType: pricing.priceType || 'fixed',
            depositRequired: pricing.depositRequired || false,
            depositAmount: pricing.depositAmount,
            paymentTiming: pricing.paymentTiming || 'at_service',
          } : null,
          // Legacy price_range for backwards compatibility
          price_range: s.show_price && (s.price_min || s.price_max)
            ? {
                min: s.price_min ? s.price_min / 100 : null,
                max: s.price_max ? s.price_max / 100 : null,
                currency: 'USD',
              }
            : null,
        }
      })

      const result = { services }
      await logQuery(supabase, practiceId, 'get_services', {}, result)
      return textResult(result)
    },
  }
}

// ---------------------------------------------------------------------------
// 3. get_providers
// ---------------------------------------------------------------------------

export function getProvidersTool(supabase: SupabaseClient, practiceId: string): ToolDefinition {
  return {
    name: 'get_providers',
    description:
      'Returns the list of staff/providers at this business, including name, title, specialties, and whether they are accepting new clients.',
    handler: async () => {
      const { data, error } = await supabase
        .from('providers')
        .select('name, title, specialties, bio, accepting_new_clients')
        .eq('practice_id', practiceId)

      if (error) {
        const result = { error: 'Failed to retrieve providers.' }
        await logQuery(supabase, practiceId, 'get_providers', {}, result)
        return textResult(result)
      }

      const result = { providers: data ?? [] }
      await logQuery(supabase, practiceId, 'get_providers', {}, result)
      return textResult(result)
    },
  }
}

// ---------------------------------------------------------------------------
// 4. check_availability — uses adapter layer
// ---------------------------------------------------------------------------

export function checkAvailabilityTool(
  supabase: SupabaseClient,
  practiceId: string,
  bookingSystemType: string | null,
  rules: BusinessRules | null,
  bookingUrl?: string | null
): ToolDefinition {
  return {
    name: 'check_availability',
    description:
      'Check available appointment slots for a given date range and optional service type or provider.',
    inputSchema: z.object({
      start_date: z.string().describe('Start date in YYYY-MM-DD format'),
      end_date: z.string().describe('End date in YYYY-MM-DD format'),
      service_type: z.string().optional().describe('Optional service name to filter by'),
      provider: z.string().optional().describe('Optional provider/staff name to filter by'),
    }),
    handler: async (params) => {
      const { start_date, end_date, service_type, provider } = params as {
        start_date: string
        end_date: string
        service_type?: string
        provider?: string
      }

      try {
        const adapter = await createAdapter({
          bookingSystemType,
          supabase,
          practiceId,
          rules,
          bookingUrl,
        })

        const slots = await adapter.getAvailableSlots({
          startDate: start_date,
          endDate: end_date,
          serviceType: service_type,
          provider,
        })

        const result = {
          start_date,
          end_date,
          total_slots: slots.length,
          available_slots: slots,
        }

        await logQuery(supabase, practiceId, 'check_availability', params, result)
        return textResult(result)
      } catch (err) {
        const result = { error: err instanceof Error ? err.message : 'Failed to check availability' }
        await logQuery(supabase, practiceId, 'check_availability', params, result)
        return textResult(result)
      }
    },
  }
}

// ---------------------------------------------------------------------------
// 5. book_appointment — uses adapter layer
// ---------------------------------------------------------------------------

export function bookAppointmentTool(
  supabase: SupabaseClient,
  practiceId: string,
  practiceName: string,
  bookingSystemType: string | null,
  rules: BusinessRules | null,
  bookingUrl?: string | null
): ToolDefinition {
  return {
    name: 'book_appointment',
    description:
      'Book an appointment at an available time slot. Requires customer name, phone, slot_id from check_availability, and service type.',
    inputSchema: z.object({
      customer_name: z.string().describe('Full name of the customer'),
      customer_phone: z.string().describe('Phone number of the customer'),
      customer_email: z.string().optional().describe('Email address of the customer'),
      slot_id: z.string().describe('The slot_id returned from check_availability'),
      service_type: z.string().describe('Name of the service to book'),
      notes: z.string().optional().describe('Any special requests or notes'),
    }),
    handler: async (params) => {
      const {
        customer_name,
        customer_phone,
        customer_email,
        slot_id,
        service_type,
        notes,
      } = params as {
        customer_name: string
        customer_phone: string
        customer_email?: string
        slot_id: string
        service_type: string
        notes?: string
      }

      try {
        const adapter = await createAdapter({
          bookingSystemType,
          supabase,
          practiceId,
          rules,
          bookingUrl,
        })

        const confirmation = await adapter.createAppointment({
          customer: { name: customer_name, phone: customer_phone, email: customer_email },
          slotId: slot_id,
          serviceType: service_type,
          notes,
        })

        const result = {
          confirmation_id: confirmation.confirmation_id,
          datetime: confirmation.datetime,
          provider: confirmation.provider,
          service_type: confirmation.service_type,
          customer_name,
          message: confirmation.message,
          payment_required: confirmation.payment_required,
          payment_amount: confirmation.payment_amount,
          payment_type: confirmation.payment_type,
          payment_url: confirmation.payment_url,
          payment_deadline: confirmation.payment_deadline,
          booking_status: confirmation.booking_status,
        }

        await logQuery(supabase, practiceId, 'book_appointment', params, result)
        return textResult(result)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to book appointment'
        const isSlotUnavailable = message.includes('slot_unavailable')
        const result = {
          error: isSlotUnavailable ? 'slot_unavailable' : 'booking_failed',
          message: isSlotUnavailable
            ? 'This slot was booked by someone else. Please check availability again for updated options.'
            : message,
        }
        await logQuery(supabase, practiceId, 'book_appointment', params, result)
        return textResult(result)
      }
    },
  }
}

// ---------------------------------------------------------------------------
// 6. cancel_appointment — uses adapter layer
// ---------------------------------------------------------------------------

export function cancelAppointmentTool(
  supabase: SupabaseClient,
  practiceId: string,
  bookingSystemType: string | null,
  rules: BusinessRules | null,
  bookingUrl?: string | null
): ToolDefinition {
  return {
    name: 'cancel_appointment',
    description:
      'Cancel an existing appointment. Requires the confirmation ID and customer phone number for verification.',
    inputSchema: z.object({
      confirmation_id: z.string().describe('The booking confirmation ID'),
      customer_phone: z.string().describe('Customer phone number for verification'),
    }),
    handler: async (params) => {
      const { confirmation_id, customer_phone } = params as {
        confirmation_id: string
        customer_phone: string
      }

      try {
        const adapter = await createAdapter({
          bookingSystemType,
          supabase,
          practiceId,
          rules,
          bookingUrl,
        })

        const result = await adapter.cancelAppointment({
          confirmationId: confirmation_id,
          customerPhone: customer_phone,
        })

        await logQuery(supabase, practiceId, 'cancel_appointment', params, result)
        return textResult(result)
      } catch (err) {
        const result = { error: err instanceof Error ? err.message : 'Failed to cancel appointment' }
        await logQuery(supabase, practiceId, 'cancel_appointment', params, result)
        return textResult(result)
      }
    },
  }
}
