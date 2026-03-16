import { z } from 'zod'
import { SupabaseClient } from '@supabase/supabase-js'
import { createAdapter } from '@/lib/adapters'
import type { BusinessRules } from '@/types/database'

// ---------------------------------------------------------------------------
// Shared types (same as tools.ts)
// ---------------------------------------------------------------------------

type ToolResult = { content: Array<{ type: 'text'; text: string }> }

type ToolDefinition = {
  name: string
  description: string
  inputSchema?: z.ZodObject<z.ZodRawShape>
  handler: (params: Record<string, unknown>) => Promise<ToolResult>
}

async function logQuery(
  supabase: SupabaseClient,
  practiceId: string,
  toolCalled: string,
  queryPayload: unknown,
  responsePayload: unknown,
) {
  await supabase.from('ai_queries').insert({
    practice_id: practiceId,
    tool_called: toolCalled,
    query_payload: queryPayload ?? {},
    response_payload: responsePayload ?? {},
  })
}

function textResult(data: unknown): ToolResult {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] }
}

// ---------------------------------------------------------------------------
// get_payment_info — returns payment requirements for a service
// ---------------------------------------------------------------------------

export function getPaymentInfoTool(
  supabase: SupabaseClient,
  practiceId: string,
  bookingSystemType: string | null,
  rules: BusinessRules | null,
  bookingUrl?: string | null
): ToolDefinition {
  return {
    name: 'get_payment_info',
    description:
      'Get payment requirements for a specific service and, if a deposit is required, return a payment link the customer can use to complete it.',
    inputSchema: z.object({
      service_type: z.string().describe('The service being booked'),
      confirmation_id: z.string().optional().describe('If a booking already exists that is pending deposit payment'),
    }),
    handler: async (params) => {
      const { service_type, confirmation_id } = params as {
        service_type: string
        confirmation_id?: string
      }

      try {
        // Look up service pricing
        const { data: service } = await supabase
          .from('services')
          .select('pricing')
          .eq('practice_id', practiceId)
          .ilike('name', service_type)
          .limit(1)
          .single()

        const pricing = service?.pricing as {
          price: number | null
          currency: string
          priceType: string
          depositRequired: boolean
          depositAmount: number | null
          paymentTiming: string
        } | null

        if (!pricing) {
          const result = { payment_required: false, message: 'No pricing information available for this service.' }
          await logQuery(supabase, practiceId, 'get_payment_info', params, result)
          return textResult(result)
        }

        const needsPayment = pricing.paymentTiming === 'at_booking' || pricing.paymentTiming === 'deposit_then_remainder'
        const amount = needsPayment
          ? pricing.paymentTiming === 'deposit_then_remainder'
            ? pricing.depositAmount ?? pricing.price
            : pricing.price
          : pricing.price
        const paymentType = pricing.paymentTiming === 'deposit_then_remainder' ? 'deposit' : 'full'

        // Get payment URL — try adapter first, fall back to static URL
        let paymentUrl: string | null = null
        let expiresAt: string | null = null

        if (needsPayment && confirmation_id && amount) {
          // Try adapter's getPaymentLink if available
          try {
            const adapter = await createAdapter({ bookingSystemType, supabase, practiceId, rules, bookingUrl })
            if (adapter.getPaymentLink) {
              const linkResult = await adapter.getPaymentLink({
                confirmationId: confirmation_id,
                amount,
                currency: pricing.currency || 'USD',
              })
              paymentUrl = linkResult.paymentUrl
              expiresAt = linkResult.expiresAt
            }
          } catch {
            // Fall through to static URL
          }
        }

        // Fall back to business's static payment URL
        if (!paymentUrl && needsPayment) {
          const { data: practice } = await supabase
            .from('practices')
            .select('payment_url, default_hold_minutes')
            .eq('id', practiceId)
            .single()

          paymentUrl = practice?.payment_url ?? null
          if (!expiresAt && confirmation_id) {
            // Look up existing booking deadline
            const { data: appt } = await supabase
              .from('appointments')
              .select('payment_deadline')
              .eq('practice_id', practiceId)
              .eq('confirmation_number', confirmation_id)
              .single()
            expiresAt = appt?.payment_deadline ?? null
          }
        }

        const result = {
          payment_required: needsPayment,
          amount,
          currency: pricing.currency || 'USD',
          payment_type: needsPayment ? paymentType : null,
          payment_url: paymentUrl,
          expires_at: expiresAt,
          price_type: pricing.priceType,
          service_price: pricing.price,
        }

        await logQuery(supabase, practiceId, 'get_payment_info', params, result)
        return textResult(result)
      } catch (err) {
        const result = { error: err instanceof Error ? err.message : 'Failed to get payment info' }
        await logQuery(supabase, practiceId, 'get_payment_info', params, result)
        return textResult(result)
      }
    },
  }
}

// ---------------------------------------------------------------------------
// create_payment_intent — placeholder for future AI payment protocols
// ---------------------------------------------------------------------------

export function createPaymentIntentTool(
  supabase: SupabaseClient,
  practiceId: string
): ToolDefinition {
  return {
    name: 'create_payment_intent',
    description:
      'Create a payment intent for a booking, allowing an authorized AI agent to process payment on behalf of the user. (Not yet available — use get_payment_info for manual payment links.)',
    inputSchema: z.object({
      confirmation_id: z.string().describe('The booking confirmation ID'),
      payment_token: z.string().describe('Token from the AI agent payment protocol'),
      amount: z.number().describe('Payment amount'),
      currency: z.string().describe('Currency code (e.g. USD)'),
    }),
    handler: async (params) => {
      const result = {
        error: 'payment_processing_not_yet_available',
        message: 'Direct AI payment processing is not yet available. Please use the payment link provided by get_payment_info to complete payment manually.',
      }

      await logQuery(supabase, practiceId, 'create_payment_intent', params, result)
      return textResult(result)
    },
  }
}
