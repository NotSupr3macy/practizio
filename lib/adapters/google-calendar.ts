// ---------------------------------------------------------------------------
// Google Calendar Adapter — creates real events via Google Calendar API
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

async function refreshAccessToken(
  refreshToken: string
): Promise<{ access_token: string; expires_in: number } | null> {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    })

    const data = await response.json()
    if (!data.access_token) {
      console.error('[GoogleCalendar] Token refresh failed:', data)
      return null
    }
    return { access_token: data.access_token, expires_in: data.expires_in }
  } catch (err) {
    console.error('[GoogleCalendar] Token refresh error:', err)
    return null
  }
}

export class GoogleCalendarAdapter implements BookingAdapter {
  constructor(
    private supabase: SupabaseClient,
    private practiceId: string,
    private rules: BusinessRules | null,
    private accessToken: string,
    private refreshToken: string | null,
    private calendarId: string,
    private tokenExpiresAt: string | null,
    private credentialId: string
  ) {}

  private async getValidAccessToken(): Promise<string> {
    // Check if token is expired or about to expire (within 5 minutes)
    if (this.tokenExpiresAt) {
      const expiresAt = new Date(this.tokenExpiresAt).getTime()
      const now = Date.now()
      if (now < expiresAt - 5 * 60 * 1000) {
        return this.accessToken // Still valid
      }
    }

    // Token expired — refresh it
    if (!this.refreshToken) {
      throw new Error('Google Calendar token expired and no refresh token available. Please reconnect Google Calendar in settings.')
    }

    const refreshed = await refreshAccessToken(this.refreshToken)
    if (!refreshed) {
      // Mark credential as invalid
      await this.supabase
        .from('credentials')
        .update({ is_valid: false })
        .eq('id', this.credentialId)

      throw new Error('Could not refresh Google Calendar token. Please reconnect Google Calendar in settings.')
    }

    // Update stored token
    this.accessToken = refreshed.access_token
    this.tokenExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString()

    await this.supabase
      .from('credentials')
      .update({
        access_token_encrypted: refreshed.access_token,
        token_expires_at: this.tokenExpiresAt,
        last_validated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', this.credentialId)

    return this.accessToken
  }

  async validateCredentials(): Promise<boolean> {
    try {
      const token = await this.getValidAccessToken()
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return response.ok
    } catch {
      return false
    }
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

    // Fetch practice availability hours
    const { data: avail } = await this.supabase
      .from('practice_availability')
      .select('*')
      .eq('practice_id', this.practiceId)

    if (!avail || avail.length === 0) return slots

    // Fetch practice timezone
    const { data: practice } = await this.supabase
      .from('practices')
      .select('timezone')
      .eq('id', this.practiceId)
      .single()
    const timezone = practice?.timezone || 'America/New_York'

    // Get service duration if specified
    let serviceDuration = 30
    if (params.serviceType) {
      const { data: service } = await this.supabase
        .from('services')
        .select('duration_minutes')
        .eq('practice_id', this.practiceId)
        .ilike('name', params.serviceType)
        .single()
      if (service?.duration_minutes) serviceDuration = service.duration_minutes
    }

    const bufferMinutes = this.rules?.buffer_minutes ?? 0

    // Fetch existing Google Calendar events to check for conflicts
    let busyTimes: { start: string; end: string }[] = []
    try {
      const token = await this.getValidAccessToken()
      const timeMin = new Date(params.startDate + 'T00:00:00').toISOString()
      const timeMax = new Date(params.endDate + 'T23:59:59').toISOString()

      const eventsResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events?` +
          new URLSearchParams({
            timeMin,
            timeMax,
            singleEvents: 'true',
            orderBy: 'startTime',
            maxResults: '250',
          }),
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        busyTimes = (eventsData.items || [])
          .filter((e: { status?: string }) => e.status !== 'cancelled')
          .map((e: { start?: { dateTime?: string }; end?: { dateTime?: string } }) => ({
            start: e.start?.dateTime || '',
            end: e.end?.dateTime || '',
          }))
          .filter((t: { start: string; end: string }) => t.start && t.end)
      }
    } catch (err) {
      console.error('[GoogleCalendar] Failed to fetch events for availability:', err)
      // Continue with slots based on practice hours only
    }

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay()
      const dayAvail = avail.find((a) => a.day_of_week === dayOfWeek)
      if (!dayAvail || !dayAvail.is_open) continue

      const [openH, openM] = dayAvail.open_time.split(':').map(Number)
      const [closeH, closeM] = dayAvail.close_time.split(':').map(Number)
      const openMinutes = openH * 60 + openM
      const closeMinutes = closeH * 60 + closeM
      const dateStr = d.toISOString().split('T')[0]

      for (let m = openMinutes; m + serviceDuration <= closeMinutes; m += serviceDuration + bufferMinutes) {
        const h = Math.floor(m / 60)
        const min = m % 60
        const timeStr = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
        const slotStart = `${dateStr}T${timeStr}:00`
        const slotEnd = new Date(new Date(slotStart).getTime() + serviceDuration * 60000).toISOString()

        // Check if this slot conflicts with any Google Calendar events
        const hasConflict = busyTimes.some((busy) => {
          const busyStart = new Date(busy.start).getTime()
          const busyEnd = new Date(busy.end).getTime()
          const sStart = new Date(slotStart).getTime()
          const sEnd = new Date(slotEnd).getTime()
          return sStart < busyEnd && sEnd > busyStart
        })

        if (!hasConflict) {
          slots.push({
            slot_id: `${dateStr}_${timeStr}`,
            datetime: slotStart,
            provider: null,
            duration_minutes: serviceDuration,
            service_type: null,
          })
        }
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

    // Get service details
    const { data: service } = await this.supabase
      .from('services')
      .select('*')
      .eq('practice_id', this.practiceId)
      .ilike('name', serviceType)
      .single()

    const durationMinutes = service?.duration_minutes || 30

    // Get practice info for event description
    const { data: practice } = await this.supabase
      .from('practices')
      .select('name, timezone')
      .eq('id', this.practiceId)
      .single()

    const timezone = practice?.timezone || 'America/New_York'
    const practiceName = practice?.name || 'Business'

    // Create Google Calendar event
    const token = await this.getValidAccessToken()

    const startDateTime = `${datePart}T${timePart}:00`
    // Calculate end time by adding duration to the time string directly (avoids timezone shifting)
    const [startH, startM] = timePart.split(':').map(Number)
    const totalMinutes = startH * 60 + startM + durationMinutes
    const endH = Math.floor(totalMinutes / 60) % 24
    const endM = totalMinutes % 60
    const endDateTime = `${datePart}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`

    const event = {
      summary: `${serviceType} — ${customer.name}`,
      description: [
        `Service: ${serviceType}`,
        `Customer: ${customer.name}`,
        `Phone: ${customer.phone}`,
        customer.email ? `Email: ${customer.email}` : null,
        notes ? `Notes: ${notes}` : null,
        '',
        `Booked via ${practiceName} on Practizio`,
      ]
        .filter(Boolean)
        .join('\n'),
      start: {
        dateTime: startDateTime,
        timeZone: timezone,
      },
      end: {
        dateTime: endDateTime,
        timeZone: timezone,
      },
      attendees: customer.email ? [{ email: customer.email }] : [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    }

    const createResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events?sendUpdates=all`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    )

    if (!createResponse.ok) {
      const errorData = await createResponse.json()
      console.error('[GoogleCalendar] Failed to create event:', errorData)
      throw new Error('Failed to create Google Calendar event. Please try again.')
    }

    const createdEvent = await createResponse.json()
    const confirmationId = generateConfirmationNumber()

    // Also record in our database for tracking
    await this.supabase.from('appointments').insert({
      practice_id: this.practiceId,
      patient_name: customer.name,
      patient_phone: customer.phone,
      patient_email: customer.email || null,
      service: serviceType,
      appointment_date: datePart,
      appointment_time: timePart + ':00',
      status: 'confirmed',
      notes: notes || null,
      confirmation_number: confirmationId,
      booked_by: 'ai_agent',
    })

    return {
      confirmation_id: confirmationId,
      datetime: startDateTime,
      provider: null,
      service_type: serviceType,
      message: `Your ${serviceType} appointment has been booked for ${datePart} at ${formatTime(timePart)}. A calendar invite has been sent${customer.email ? ` to ${customer.email}` : ''}.`,
      payment_required: false,
      payment_amount: null,
      payment_type: null,
      payment_url: null,
      payment_deadline: null,
      booking_status: 'confirmed',
    }
  }

  async cancelAppointment(params: {
    confirmationId: string
    customerPhone: string
  }): Promise<CancellationResult> {
    // Find the appointment in our database
    const { data: appointment } = await this.supabase
      .from('appointments')
      .select('*')
      .eq('practice_id', this.practiceId)
      .eq('confirmation_number', params.confirmationId)
      .eq('customer_phone', params.customerPhone)
      .single()

    if (!appointment) {
      return { success: false, message: 'Could not find that booking.' }
    }

    // Cancel on Google Calendar if we have the event ID
    if (appointment.external_id) {
      try {
        const token = await this.getValidAccessToken()
        await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events/${appointment.external_id}?sendUpdates=all`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      } catch (err) {
        console.error('[GoogleCalendar] Failed to cancel event:', err)
      }
    }

    // Update our database
    await this.supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointment.id)

    return {
      success: true,
      message: 'Your appointment has been cancelled and removed from the calendar.',
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
