// ---------------------------------------------------------------------------
// Booking System Adapter Interface
// ---------------------------------------------------------------------------

export interface AvailableSlot {
  slot_id: string
  datetime: string // ISO 8601
  provider: string | null
  duration_minutes: number
  service_type: string | null
}

export interface BookingConfirmation {
  confirmation_id: string
  datetime: string
  provider: string | null
  service_type: string
  message: string
  // Payment context
  payment_required: boolean
  payment_amount: number | null
  payment_type: 'deposit' | 'full' | null
  payment_url: string | null
  payment_deadline: string | null
  booking_status: 'confirmed' | 'pending_payment' | 'pending_approval'
}

export interface CancellationResult {
  success: boolean
  message: string
}

export interface AdapterService {
  service_id: string
  name: string
  description: string | null
  duration_minutes: number
  price: number | null
}

export interface PaymentLinkResult {
  paymentUrl: string
  expiresAt: string | null
}

export interface BookingAdapter {
  validateCredentials(): Promise<boolean>

  getAvailableSlots(params: {
    startDate: string
    endDate: string
    serviceType?: string
    provider?: string
  }): Promise<AvailableSlot[]>

  createAppointment(params: {
    customer: { name: string; phone: string; email?: string }
    slotId: string
    serviceType: string
    notes?: string
  }): Promise<BookingConfirmation>

  cancelAppointment(params: {
    confirmationId: string
    customerPhone: string
  }): Promise<CancellationResult>

  getServices(): Promise<AdapterService[]>

  // Optional: for adapters whose booking systems can generate payment links
  getPaymentLink?(params: {
    confirmationId: string
    amount: number
    currency: string
  }): Promise<PaymentLinkResult>
}
