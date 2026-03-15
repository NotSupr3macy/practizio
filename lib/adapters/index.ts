// ---------------------------------------------------------------------------
// Adapter Factory — instantiates the correct adapter for a business
// ---------------------------------------------------------------------------

import type { BookingAdapter } from './types'
import { InternalAdapter } from './internal'
import { CalendlyAdapter } from './calendly'
import { AcuityAdapter } from './acuity'
import { SquareAdapter } from './square'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { BusinessRules } from '@/types/database'

export type { BookingAdapter } from './types'

export function createAdapter(params: {
  bookingSystemType: string | null
  supabase: SupabaseClient
  practiceId: string
  rules: BusinessRules | null
  credentials?: {
    accessToken?: string
    refreshToken?: string
    apiKey?: string
    userId?: string
  }
}): BookingAdapter {
  const { bookingSystemType, supabase, practiceId, rules, credentials } = params

  switch (bookingSystemType) {
    case 'calendly':
      if (!credentials?.accessToken) {
        throw new Error('Calendly adapter requires an access token')
      }
      return new CalendlyAdapter(credentials.accessToken, credentials.refreshToken ?? null)

    case 'acuity':
      if (!credentials?.apiKey || !credentials?.userId) {
        throw new Error('Acuity adapter requires API key and user ID')
      }
      return new AcuityAdapter(credentials.apiKey, credentials.userId)

    case 'square':
      if (!credentials?.accessToken) {
        throw new Error('Square adapter requires an access token')
      }
      return new SquareAdapter(credentials.accessToken)

    case 'internal':
    case null:
    case undefined:
    default:
      return new InternalAdapter(supabase, practiceId, rules)
  }
}
