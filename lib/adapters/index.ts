// ---------------------------------------------------------------------------
// Adapter Factory — instantiates the correct adapter for a business
// ---------------------------------------------------------------------------

import type { BookingAdapter } from './types'
import { InternalAdapter } from './internal'
import { ExternalUrlAdapter } from './external-url'
import { CalendlyAdapter } from './calendly'
import { AcuityAdapter } from './acuity'
import { SquareAdapter } from './square'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { BusinessRules } from '@/types/database'

export type { BookingAdapter } from './types'

// Booking system types that use the external URL adapter
const EXTERNAL_URL_SYSTEMS = [
  'google_calendar',
  'cal_com',
  'microsoft_bookings',
  'setmore',
  'simplybook',
  'vagaro',
  'fresha',
  'booksy',
  'glossgenius',
  'boulevard',
  'mindbody',
  'jane_app',
  'zenoti',
  'wellnessliving',
  'opentable',
  'resy',
  'toast',
  'square_online',
  'jobber',
  'servicetitan',
  'housecall_pro',
  'custom',
]

const SYSTEM_LABELS: Record<string, string> = {
  google_calendar: 'Google Calendar',
  cal_com: 'Cal.com',
  microsoft_bookings: 'Microsoft Bookings',
  setmore: 'Setmore',
  simplybook: 'SimplyBook.me',
  vagaro: 'Vagaro',
  fresha: 'Fresha',
  booksy: 'Booksy',
  glossgenius: 'GlossGenius',
  boulevard: 'Boulevard',
  mindbody: 'Mindbody',
  jane_app: 'Jane App',
  zenoti: 'Zenoti',
  wellnessliving: 'WellnessLiving',
  opentable: 'OpenTable',
  resy: 'Resy',
  toast: 'Toast',
  square_online: 'Square Online',
  jobber: 'Jobber',
  servicetitan: 'ServiceTitan',
  housecall_pro: 'HouseCall Pro',
  custom: 'your booking platform',
}

export function createAdapter(params: {
  bookingSystemType: string | null
  supabase: SupabaseClient
  practiceId: string
  rules: BusinessRules | null
  bookingUrl?: string | null
  credentials?: {
    accessToken?: string
    refreshToken?: string
    apiKey?: string
    userId?: string
  }
}): BookingAdapter {
  const { bookingSystemType, supabase, practiceId, rules, bookingUrl, credentials } = params

  // Check if this is an external URL-based system
  if (bookingSystemType && EXTERNAL_URL_SYSTEMS.includes(bookingSystemType) && bookingUrl) {
    const label = SYSTEM_LABELS[bookingSystemType] || bookingSystemType
    return new ExternalUrlAdapter(supabase, practiceId, rules, bookingUrl, label)
  }

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
    case 'square_appointments':
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
