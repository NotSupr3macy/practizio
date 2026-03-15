// ---------------------------------------------------------------------------
// Acuity Scheduling Adapter (Stub)
// ---------------------------------------------------------------------------

import type { BookingAdapter, AvailableSlot, BookingConfirmation, CancellationResult, AdapterService } from './types'

export class AcuityAdapter implements BookingAdapter {
  constructor(
    private apiKey: string,
    private userId: string
  ) {}

  private get authHeader() {
    return 'Basic ' + Buffer.from(`${this.userId}:${this.apiKey}`).toString('base64')
  }

  async validateCredentials(): Promise<boolean> {
    try {
      const res = await fetch('https://acuityscheduling.com/api/v1/me', {
        headers: { Authorization: this.authHeader },
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
    console.log('[AcuityAdapter] getAvailableSlots called with:', params)
    return []
  }

  async createAppointment(params: {
    customer: { name: string; phone: string; email?: string }
    slotId: string
    serviceType: string
    notes?: string
  }): Promise<BookingConfirmation> {
    console.log('[AcuityAdapter] createAppointment called with:', params)
    throw new Error('Acuity adapter: createAppointment not yet implemented.')
  }

  async cancelAppointment(params: {
    confirmationId: string
    customerPhone: string
  }): Promise<CancellationResult> {
    console.log('[AcuityAdapter] cancelAppointment called with:', params)
    return { success: false, message: 'Acuity adapter: cancelAppointment not yet implemented.' }
  }

  async getServices(): Promise<AdapterService[]> {
    try {
      const res = await fetch('https://acuityscheduling.com/api/v1/appointment-types', {
        headers: { Authorization: this.authHeader },
      })
      if (!res.ok) return []
      const data = await res.json()
      return (data ?? []).map((at: { id: number; name: string; description: string; duration: number; price: string }) => ({
        service_id: String(at.id),
        name: at.name,
        description: at.description ?? null,
        duration_minutes: at.duration,
        price: at.price ? parseFloat(at.price) * 100 : null,
      }))
    } catch {
      return []
    }
  }
}
