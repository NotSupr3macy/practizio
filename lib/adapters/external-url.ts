// ---------------------------------------------------------------------------
// External URL Adapter — for businesses using external booking systems
// (Google Calendar, Cal.com, Booksy, etc.) where we have their booking URL
// ---------------------------------------------------------------------------

import { SupabaseClient } from '@supabase/supabase-js'
import { generateConfirmationNumber, formatTime } from '@/lib/utils'
import type {
  BookingAdapter,
  AvailableSlot,
  BookingConfirmation,
  CancellationResult,
  AdapterService,
} from './types'
import type { BusinessRules } from '@/types/database'

export class ExternalUrlAdapter implements BookingAdapter {
  constructor(
    private supabase: SupabaseClient,
    private practiceId: string,
    private rules: BusinessRules | null,
    private bookingUrl: string,
    private bookingSystemLabel: string
  ) {}

  async validateCredentials(): Promise<boolean> {
    return true
  }

  async getAvailableSlots(params: {
    startDate: string
    endDate: string
    serviceType?: string
    provider?: string
  }): Promise<AvailableSlot[]> {
    // We can't query external systems for real-time availability,
    // so we return the practice's configured hours as available slots
    // and let the external booking page handle actual availability.
    const slots: AvailableSlot[] = []
    const start = new Date(params.startDate + 'T00:00:00')
    const end = new Date(params.endDate + 'T00:00:00')

    // Fetch practice availability
    const { data: avail } = await this.supabase
      .from('practice_availability')
      .select('*')
      .eq('practice_id', this.practiceId)

    if (!avail || avail.length === 0) return slots

    const slotDuration = 30 // default slot duration
    const bufferMinutes = this.rules?.buffer_minutes ?? 0

    for (
      let d = new Date(start);
      d <= end;
      d.setDate(d.getDate() + 1)
    ) {
      const dayOfWeek = d.getDay()
      const dayAvail = avail.find((a) => a.day_of_week === dayOfWeek)
      if (!dayAvail || !dayAvail.is_open) continue

      const [openH, openM] = dayAvail.open_time.split(':').map(Number)
      const [closeH, closeM] = dayAvail.close_time.split(':').map(Number)

      const openMinutes = openH * 60 + openM
      const closeMinutes = closeH * 60 + closeM

      for (let m = openMinutes; m + slotDuration <= closeMinutes; m += slotDuration + bufferMinutes) {
        const h = Math.floor(m / 60)
        const min = m % 60
        const dateStr = d.toISOString().split('T')[0]
        const timeStr = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`

        slots.push({
          slot_id: `${dateStr}_${timeStr}`,
          datetime: `${dateStr}T${timeStr}:00`,
          provider: null,
          duration_minutes: slotDuration,
          service_type: null,
        })
      }
    }

    return slots
  }

  async createAppointment(params: {
    customer: { name: string; phone: string; email?: string }
    slotId: string
    serviceType: string
    notes?: string
  }): Promise<BookingConfirmation> {
    const { customer, slotId, serviceType, notes } = params

    // Parse slot_id → date + time
    const [datePart, timePart] = slotId.split('_')
    const datetime = `${datePart}T${timePart}:00`

    // Look up service for pricing info
    const { data: service } = await this.supabase
      .from('services')
      .select('*')
      .eq('practice_id', this.practiceId)
      .ilike('name', serviceType)
      .single()

    const confirmationId = generateConfirmationNumber()

    // Record the booking intent in our database for tracking
    const { error } = await this.supabase.from('appointments').insert({
      practice_id: this.practiceId,
      customer_name: customer.name,
      customer_phone: customer.phone,
      customer_email: customer.email || null,
      service_type: serviceType,
      service_id: service?.id || null,
      appointment_date: datePart,
      appointment_time: timePart + ':00',
      status: 'confirmed',
      notes: notes || null,
      confirmation_number: confirmationId,
    })

    if (error) {
      console.error('[ExternalUrlAdapter] Failed to record booking intent:', error)
      // Still return the booking URL even if we can't record it
    }

    return {
      confirmation_id: confirmationId,
      datetime,
      provider: null,
      service_type: serviceType,
      message: `To complete your booking for ${serviceType} on ${datePart} at ${formatTime(timePart)}, please visit the booking page: ${this.bookingUrl}`,
      payment_required: false,
      payment_amount: null,
      payment_type: null,
      payment_url: null,
      payment_deadline: null,
      booking_status: 'pending_approval',
    }
  }

  async cancelAppointment(params: {
    confirmationId: string
    customerPhone: string
  }): Promise<CancellationResult> {
    // Mark our tracking record as cancelled
    const { error } = await this.supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('practice_id', this.practiceId)
      .eq('confirmation_number', params.confirmationId)
      .eq('customer_phone', params.customerPhone)

    return {
      success: !error,
      message: error
        ? 'Could not find that booking. Please contact the business directly.'
        : `Booking request cancelled. If you already completed booking on ${this.bookingSystemLabel}, please cancel directly through their platform.`,
    }
  }

  async getServices(): Promise<AdapterService[]> {
    const { data } = await this.supabase
      .from('services')
      .select('*')
      .eq('practice_id', this.practiceId)

    return (data || []).map((s) => ({
      service_id: s.id,
      name: s.name,
      description: s.description,
      duration_minutes: s.duration_minutes,
      price: s.price_min,
    }))
  }
}
