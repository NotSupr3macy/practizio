export interface Practice {
  id: string
  user_id: string
  slug: string
  name: string
  practice_type: 'dental' | 'medical' | 'legal' | 'financial' | 'other'
  address: {
    street: string
    city: string
    state: string
    zip: string
  } | null
  phone: string | null
  website: string | null
  accepted_insurance: string[] | null
  is_active: boolean
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: 'starter' | 'professional' | 'enterprise'
  timezone: string
  created_at: string
}

export interface Service {
  id: string
  practice_id: string
  name: string
  price_min: number | null
  price_max: number | null
  duration_minutes: number | null
  description: string | null
}

export interface Availability {
  id: string
  practice_id: string
  day_of_week: number
  open_time: string
  close_time: string
  is_open: boolean
}

export interface Provider {
  id: string
  practice_id: string
  name: string
  title: string | null
  specialties: string[] | null
  bio: string | null
  accepting_new_patients: boolean
}

export interface Appointment {
  id: string
  practice_id: string
  confirmation_number: string
  patient_name: string
  patient_email: string | null
  patient_phone: string | null
  service: string
  appointment_date: string
  appointment_time: string
  notes: string | null
  booked_by: 'ai_agent' | 'human'
  created_at: string
}

export interface AiQuery {
  id: string
  practice_id: string
  tool_called: string
  agent_identifier: string | null
  query_payload: Record<string, unknown> | null
  response_payload: Record<string, unknown> | null
  created_at: string
}

export type PracticeType = Practice['practice_type']
export type PlanType = Practice['plan']
