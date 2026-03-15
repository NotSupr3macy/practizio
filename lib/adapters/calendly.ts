// ---------------------------------------------------------------------------
// Calendly Booking Adapter (Stub — requires OAuth credentials)
// ---------------------------------------------------------------------------

import type { BookingAdapter, AvailableSlot, BookingConfirmation, CancellationResult, AdapterService } from './types'

export class CalendlyAdapter implements BookingAdapter {
  constructor(
    private accessToken: string,
    private refreshToken: string | null
  ) {}

  async validateCredentials(): Promise<boolean> {
    try {
      const res = await fetch('https://api.calendly.com/users/me', {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      })
      return res.ok
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
    // Calendly API: List event type available times
    // This is a stub — real implementation would call Calendly's availability endpoints
    console.log('[CalendlyAdapter] getAvailableSlots called with:', params)
    return []
  }

  async createAppointment(params: {
    customer: { name: string; phone: string; email?: string }
    slotId: string
    serviceType: string
    notes?: string
  }): Promise<BookingConfirmation> {
    console.log('[CalendlyAdapter] createAppointment called with:', params)
    throw new Error('Calendly adapter: createAppointment not yet implemented. Use scheduling links API.')
  }

  async cancelAppointment(params: {
    confirmationId: string
    customerPhone: string
  }): Promise<CancellationResult> {
    console.log('[CalendlyAdapter] cancelAppointment called with:', params)
    return { success: false, message: 'Calendly adapter: cancelAppointment not yet implemented.' }
  }

  async getServices(): Promise<AdapterService[]> {
    try {
      const userRes = await fetch('https://api.calendly.com/users/me', {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      })
      if (!userRes.ok) return []
      const userData = await userRes.json()
      const userUri = userData.resource?.uri

      if (!userUri) return []

      const res = await fetch(
        `https://api.calendly.com/event_types?user=${encodeURIComponent(userUri)}&active=true`,
        { headers: { Authorization: `Bearer ${this.accessToken}` } }
      )
      if (!res.ok) return []
      const data = await res.json()

      return (data.collection ?? []).map((et: { uri: string; name: string; description_plain: string | null; duration: number }) => ({
        service_id: et.uri,
        name: et.name,
        description: et.description_plain ?? null,
        duration_minutes: et.duration,
        price: null,
      }))
    } catch {
      return []
    }
  }
}
