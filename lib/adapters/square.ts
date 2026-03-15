// ---------------------------------------------------------------------------
// Square Appointments Adapter (Stub)
// ---------------------------------------------------------------------------

import type { BookingAdapter, AvailableSlot, BookingConfirmation, CancellationResult, AdapterService } from './types'

export class SquareAdapter implements BookingAdapter {
  constructor(private accessToken: string) {}

  async validateCredentials(): Promise<boolean> {
    try {
      const res = await fetch('https://connect.squareup.com/v2/merchants/me', {
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
    console.log('[SquareAdapter] getAvailableSlots called with:', params)
    return []
  }

  async createAppointment(params: {
    customer: { name: string; phone: string; email?: string }
    slotId: string
    serviceType: string
    notes?: string
  }): Promise<BookingConfirmation> {
    console.log('[SquareAdapter] createAppointment called with:', params)
    throw new Error('Square adapter: createAppointment not yet implemented.')
  }

  async cancelAppointment(params: {
    confirmationId: string
    customerPhone: string
  }): Promise<CancellationResult> {
    console.log('[SquareAdapter] cancelAppointment called with:', params)
    return { success: false, message: 'Square adapter: cancelAppointment not yet implemented.' }
  }

  async getServices(): Promise<AdapterService[]> {
    console.log('[SquareAdapter] getServices called')
    return []
  }
}
