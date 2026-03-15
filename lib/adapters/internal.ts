// ---------------------------------------------------------------------------
// Internal Booking Adapter — uses SpadeChat's own database
// ---------------------------------------------------------------------------

import { SupabaseClient } from '@supabase/supabase-js'
import { generateConfirmationNumber, formatTime } from '@/lib/utils'
import type { BookingAdapter, AvailableSlot, BookingConfirmation, CancellationResult, AdapterService } from './types'
import type { BusinessRules, ServicePricing } from '@/types/database'

export class InternalAdapter implements BookingAdapter {
  constructor(
    private supabase: SupabaseClient,
    private practiceId: string,
    private rules: BusinessRules | null
  ) {}

  async validateCredentials(): Promise<boolean> {
    // Internal adapter always valid — it uses our own DB
    return true
  }

  async getAvailableSlots(params: {
    startDate: string
    endDate: string
    serviceType?: string
    provider?: string
  }): Promise<AvailableSlot[]> {
    const slots: AvailableSlot[] = []
    const start = new Date(params.startDate + 'T00:00:00')
    const end = new Date(params.endDate + 'T00:00:00')

    // Enforce business rules
    const now = new Date()
    const minAdvanceMs = (this.rules?.min_advance_hours ?? 0) * 60 * 60 * 1000
    const maxAdvanceDays = this.rules?.max_advance_days ?? 60
    const bufferMinutes = this.rules?.buffer_minutes ?? 0
    const maxDate = new Date(now.getTime() + maxAdvanceDays * 24 * 60 * 60 * 1000)

    // Get service duration if specified
    let serviceDuration = 30 // default 30 min slots
    if (params.serviceType) {
      const { data: svc } = await this.supabase
        .from('services')
        .select('duration_minutes')
        .eq('practice_id', this.practiceId)
        .ilike('name', params.serviceType)
        .limit(1)
        .single()
      if (svc?.duration_minutes) serviceDuration = svc.duration_minutes
    }

    for (let d = new Date(start); d <= end && d <= maxDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]
      const dayOfWeek = d.getUTCDay()

      const { data: availData } = await this.supabase
        .from('availability')
        .select('open_time, close_time, is_open')
        .eq('practice_id', this.practiceId)
        .eq('day_of_week', dayOfWeek)

      const schedule = availData?.find((a: { is_open: boolean }) => a.is_open)
      if (!schedule) continue

      // Get existing appointments
      const { data: existingAppts } = await this.supabase
        .from('appointments')
        .select('appointment_time, duration_minutes')
        .eq('practice_id', this.practiceId)
        .eq('appointment_date', dateStr)
        .neq('status', 'cancelled')

      const bookedSlots = (existingAppts ?? []).map((a: { appointment_time: string; duration_minutes: number | null }) => ({
        time: a.appointment_time.substring(0, 5),
        duration: a.duration_minutes ?? 30,
      }))

      const [openH, openM] = schedule.open_time.split(':').map(Number)
      const [closeH, closeM] = schedule.close_time.split(':').map(Number)
      const openMinutes = openH * 60 + openM
      const closeMinutes = closeH * 60 + closeM

      for (let m = openMinutes; m + serviceDuration <= closeMinutes; m += 30) {
        const hh = String(Math.floor(m / 60)).padStart(2, '0')
        const mm = String(m % 60).padStart(2, '0')
        const slotTime = `${hh}:${mm}`

        // Check if slot overlaps with any booked appointment (including buffer)
        const slotStart = m
        const slotEnd = m + serviceDuration
        const isBooked = bookedSlots.some((b: { time: string; duration: number }) => {
          const [bh, bm] = b.time.split(':').map(Number)
          const bookedStart = bh * 60 + bm - bufferMinutes
          const bookedEnd = bh * 60 + bm + b.duration + bufferMinutes
          return slotStart < bookedEnd && slotEnd > bookedStart
        })

        if (isBooked) continue

        // Check min advance time
        const slotDatetime = new Date(`${dateStr}T${slotTime}:00`)
        if (slotDatetime.getTime() - now.getTime() < minAdvanceMs) continue

        slots.push({
          slot_id: `${dateStr}_${slotTime}`,
          datetime: `${dateStr}T${slotTime}:00`,
          provider: null,
          duration_minutes: serviceDuration,
          service_type: params.serviceType ?? null,
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
    // Parse slot_id: "2024-01-15_14:30"
    const parts = params.slotId.split('_')
    const date = parts[0]
    const time = parts[1]

    if (!date || !time) {
      throw new Error('Invalid slot_id format. Expected YYYY-MM-DD_HH:MM')
    }

    // Re-validate availability (race condition protection)
    const { data: existingAppts } = await this.supabase
      .from('appointments')
      .select('id')
      .eq('practice_id', this.practiceId)
      .eq('appointment_date', date)
      .eq('appointment_time', time)
      .neq('status', 'cancelled')

    if (existingAppts && existingAppts.length > 0) {
      throw new Error('slot_unavailable: This slot was booked by someone else. Please check availability again for updated options.')
    }

    // Get service duration and pricing
    let durationMinutes = 30
    let pricing: ServicePricing | null = null
    const { data: svc } = await this.supabase
      .from('services')
      .select('duration_minutes, pricing')
      .eq('practice_id', this.practiceId)
      .ilike('name', params.serviceType)
      .limit(1)
      .single()
    if (svc?.duration_minutes) durationMinutes = svc.duration_minutes
    if (svc?.pricing) pricing = svc.pricing as ServicePricing

    // Get practice payment config
    const { data: practice } = await this.supabase
      .from('practices')
      .select('payment_url, default_hold_minutes')
      .eq('id', this.practiceId)
      .single()

    // Determine payment context
    const needsPayment = pricing?.paymentTiming === 'at_booking' || pricing?.paymentTiming === 'deposit_then_remainder'
    const paymentAmount = needsPayment
      ? pricing?.paymentTiming === 'deposit_then_remainder'
        ? pricing?.depositAmount ?? null
        : pricing?.price ?? null
      : null
    const paymentType = needsPayment
      ? pricing?.paymentTiming === 'deposit_then_remainder' ? 'deposit' as const : 'full' as const
      : null
    const paymentUrl = needsPayment ? (practice?.payment_url ?? null) : null
    const holdMinutes = practice?.default_hold_minutes ?? 15
    const paymentDeadline = needsPayment
      ? new Date(Date.now() + holdMinutes * 60 * 1000).toISOString()
      : null
    const bookingStatus = needsPayment ? 'pending_payment' as const : 'confirmed' as const

    const confirmationNumber = generateConfirmationNumber()

    const { error: insertError } = await this.supabase
      .from('appointments')
      .insert({
        practice_id: this.practiceId,
        confirmation_number: confirmationNumber,
        customer_name: params.customer.name,
        customer_email: params.customer.email ?? null,
        customer_phone: params.customer.phone,
        service: params.serviceType,
        appointment_date: date,
        appointment_time: time,
        duration_minutes: durationMinutes,
        notes: params.notes ?? null,
        status: 'confirmed',
        booked_by: 'ai_agent',
        payment_required: needsPayment,
        payment_amount: paymentAmount,
        payment_type: paymentType,
        payment_url: paymentUrl,
        payment_deadline: paymentDeadline,
        booking_status: bookingStatus,
        payment_status: needsPayment ? 'pending' : null,
      })

    if (insertError) {
      throw new Error('Failed to book the appointment. Please try again.')
    }

    // Build message
    let message = `Appointment booked successfully. Confirmation number: ${confirmationNumber}.`
    if (!needsPayment && pricing?.price && pricing.paymentTiming === 'at_service') {
      message += ` Payment of $${pricing.price} is due at the time of service.`
    } else if (needsPayment && paymentAmount) {
      const paymentLabel = paymentType === 'deposit' ? `A $${paymentAmount} deposit` : `Payment of $${paymentAmount}`
      message += ` ${paymentLabel} is required within ${holdMinutes} minutes to confirm.`
      if (paymentUrl) {
        message += ` Complete payment here: ${paymentUrl}`
      } else {
        message += ` Please contact the business to arrange payment.`
      }
    }

    return {
      confirmation_id: confirmationNumber,
      datetime: `${date}T${time}:00`,
      provider: null,
      service_type: params.serviceType,
      message,
      payment_required: needsPayment,
      payment_amount: paymentAmount,
      payment_type: paymentType,
      payment_url: paymentUrl,
      payment_deadline: paymentDeadline,
      booking_status: bookingStatus,
    }
  }

  async cancelAppointment(params: {
    confirmationId: string
    customerPhone: string
  }): Promise<CancellationResult> {
    const { data: appt } = await this.supabase
      .from('appointments')
      .select('id, customer_phone')
      .eq('practice_id', this.practiceId)
      .eq('confirmation_number', params.confirmationId)
      .single()

    if (!appt) {
      return { success: false, message: 'Appointment not found with that confirmation number.' }
    }

    // Verify customer phone
    const normalizedInput = params.customerPhone.replace(/\D/g, '')
    const normalizedStored = (appt.customer_phone ?? '').replace(/\D/g, '')
    if (normalizedInput !== normalizedStored) {
      return { success: false, message: 'Phone number does not match the appointment record.' }
    }

    const { error } = await this.supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appt.id)

    if (error) {
      return { success: false, message: 'Failed to cancel the appointment.' }
    }

    return { success: true, message: `Appointment ${params.confirmationId} has been cancelled.` }
  }

  async getServices(): Promise<AdapterService[]> {
    const { data } = await this.supabase
      .from('services')
      .select('id, name, description, duration_minutes, price_min, show_price')
      .eq('practice_id', this.practiceId)

    return (data ?? []).map((s: { id: string; name: string; description: string | null; duration_minutes: number | null; price_min: number | null; show_price: boolean }) => ({
      service_id: s.id,
      name: s.name,
      description: s.description,
      duration_minutes: s.duration_minutes ?? 30,
      price: s.show_price ? s.price_min : null,
    }))
  }
}
