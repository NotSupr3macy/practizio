// ---------------------------------------------------------------------------
// Industry-agnostic multi-tenant booking platform types
// ---------------------------------------------------------------------------

export interface Practice {
  id: string
  user_id: string
  slug: string
  name: string
  industry: string // Free text, e.g. "Hair Salon", "Dental Office", "Yoga Studio"
  tags: string[] // Category tags for discoverability
  address: {
    street: string
    city: string
    state: string
    zip: string
  } | null
  phone: string | null
  website: string | null
  additional_info: Record<string, string> // Flexible key-value pairs
  booking_system_type: 'internal' | 'calendly' | 'acuity' | 'square' | 'other' | null
  booking_system_connected: boolean
  interaction_type: 'appointment' | 'order' | 'hybrid'
  is_active: boolean
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: 'free' | 'starter' | 'growth'
  timezone: string
  created_at: string
  // Business rules (stored as JSON)
  business_rules: BusinessRules | null
  // Payment fields
  payment_url: string | null
  default_hold_minutes: number
  stripe_connect_account_id: string | null
}

export interface BusinessRules {
  min_advance_hours: number // Minimum hours in advance to book
  max_advance_days: number // Maximum days in advance to book
  buffer_minutes: number // Buffer time between appointments
  additional_rules: string // Free-text rules
}

export interface ServicePricing {
  price: number | null
  currency: string
  priceType: 'fixed' | 'starting_at' | 'varies' | 'free'
  depositRequired: boolean
  depositAmount: number | null
  paymentTiming: 'at_booking' | 'at_service' | 'deposit_then_remainder' | 'free'
}

export interface Service {
  id: string
  practice_id: string
  name: string
  price_min: number | null
  price_max: number | null
  duration_minutes: number | null
  description: string | null
  show_price: boolean
  pricing: ServicePricing
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
  accepting_new_clients: boolean
}

export interface Appointment {
  id: string
  practice_id: string
  confirmation_number: string
  customer_name: string
  customer_email: string | null
  customer_phone: string | null
  service: string
  provider_name: string | null
  appointment_date: string
  appointment_time: string
  duration_minutes: number | null
  notes: string | null
  status: 'confirmed' | 'cancelled'
  booked_by: string // e.g. "ai_agent", "ai_claude", "ai_chatgpt", "human"
  booking_source: string | null // Which AI platform
  created_at: string
  // Payment fields
  payment_required: boolean
  payment_amount: number | null
  payment_type: 'deposit' | 'full' | null
  payment_url: string | null
  payment_deadline: string | null
  booking_status: 'confirmed' | 'pending_payment' | 'pending_approval' | 'payment_expired' | 'cancelled'
  payment_status: 'pending' | 'completed' | 'expired' | 'refunded' | null
}

export interface CatalogItem {
  id: string
  practice_id: string
  category: string | null
  name: string
  description: string | null
  price: number // cents
  image_url: string | null
  is_available: boolean
  options: Array<{ name: string; choices: string[] }>
  created_at: string
}

export interface Order {
  id: string
  practice_id: string
  order_number: string
  customer_name: string
  customer_email: string | null
  customer_phone: string | null
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  subtotal: number
  tax: number
  total: number
  notes: string | null
  ordered_by: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  catalog_item_id: string | null
  name: string
  quantity: number
  unit_price: number
  options: Record<string, string>
  notes: string | null
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

export interface Credential {
  id: string
  practice_id: string
  booking_system: string
  credential_type: 'oauth' | 'api_key'
  // encrypted values - never returned to client
  access_token_encrypted: string | null
  refresh_token_encrypted: string | null
  api_key_encrypted: string | null
  token_expires_at: string | null
  is_valid: boolean
  last_validated_at: string | null
  created_at: string
}

export interface HealthCheck {
  id: string
  practice_id: string
  check_type: 'credential' | 'availability' | 'full'
  status: 'healthy' | 'degraded' | 'down'
  response_time_ms: number | null
  error_message: string | null
  created_at: string
}

export interface IntegrationRequest {
  id: string
  business_email: string
  booking_system_name: string
  industry: string | null
  created_at: string
}

export interface ServiceTemplate {
  id: string
  industry_keyword: string
  services: Array<{
    name: string
    duration_minutes: number
    description: string
  }>
}

export interface Lead {
  id: string
  business_name: string
  owner_name: string
  email: string
  phone: string | null
  booking_system: string
  status: 'new' | 'contacted' | 'setup_in_progress' | 'setup_complete' | 'not_interested'
  referral_source: string | null
  referred_by_slug: string | null
  notes: string | null
  created_at: string
}

export interface SearchAppearance {
  id: string
  practice_id: string
  query_text: string | null
  agent_identifier: string | null
  created_at: string
}

export type PlanType = Practice['plan']
