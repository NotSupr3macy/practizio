'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils'
import { CalendarCheck, User, Clock, Phone, Mail } from 'lucide-react'

interface Appointment {
  id: string
  confirmation_number: string
  patient_name: string
  patient_email: string | null
  patient_phone: string | null
  service: string
  provider_name: string | null
  appointment_date: string
  appointment_time: string
  status: string
  booked_by: string
  booking_source: string | null
  created_at: string
  payment_required: boolean
  payment_amount: number | null
  payment_type: string | null
  payment_url: string | null
  payment_deadline: string | null
  booking_status: string
  payment_status: string | null
}

function getPaymentCountdown(deadline: string): string {
  const now = new Date()
  const dl = new Date(deadline)
  const diff = dl.getTime() - now.getTime()
  if (diff <= 0) return 'EXPIRED'
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) return `${hours}h ${minutes}m left`
  return `${minutes}m left`
}

export default function AppointmentsPage() {
  const supabase = createClient()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: practice } = await supabase.from('practices').select('id').eq('user_id', user.id).single()
    if (!practice) return

    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('practice_id', practice.id)
      .order('appointment_date', { ascending: false })
      .order('appointment_time', { ascending: false })
      .limit(50)

    setAppointments((data as Appointment[]) || [])
    setLoading(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)]">LOADING APPOINTMENTS</div></div>
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] block mb-3">APPOINTMENT MANAGEMENT</span>
        <h1 className="font-['Playfair_Display'] font-light text-3xl text-[var(--foreground)]">APPOINTMENTS</h1>
        <p className="font-['Space_Mono'] text-sm text-[var(--muted-text)] mt-2">All appointments booked through AI agents</p>
      </div>

      {appointments.length > 0 ? (
        <>
          {/* Mobile Card View */}
          <div className="space-y-3 lg:hidden">
            {appointments.map((appt) => (
              <div key={appt.id} className="bg-white border border-[var(--border-light)] rounded-[2px] p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-[var(--primary-accent)]" />
                      <span className="font-['Space_Mono'] text-sm font-medium text-[var(--foreground)]">{appt.patient_name}</span>
                    </div>
                    {appt.patient_phone && (
                      <div className="flex items-center gap-1 mt-1">
                        <Phone className="w-2.5 h-2.5 text-[var(--muted-text)]" />
                        <span className="font-['Space_Mono'] text-[10px] text-[var(--muted-text)]">{appt.patient_phone}</span>
                      </div>
                    )}
                  </div>
                  <Badge variant={
                    (appt.booking_status || appt.status) === 'confirmed' ? 'success' :
                    (appt.booking_status || appt.status) === 'pending_payment' ? 'warning' :
                    (appt.booking_status || appt.status) === 'pending_approval' ? 'warning' :
                    (appt.booking_status || appt.status) === 'payment_expired' ? 'destructive' :
                    (appt.booking_status || appt.status) === 'cancelled' ? 'destructive' :
                    'default'
                  }>
                    {(appt.booking_status || appt.status || 'confirmed').toUpperCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] block mb-0.5">SERVICE</span>
                    <span className="font-['Space_Mono'] text-[var(--foreground)]">{appt.service}</span>
                  </div>
                  <div>
                    <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] block mb-0.5">DATE</span>
                    <span className="font-['Space_Mono'] text-[var(--foreground)]">{formatDate(appt.appointment_date)}</span>
                    <span className="font-['Space_Mono'] text-[var(--muted-text)] block">{formatTime(appt.appointment_time)}</span>
                  </div>
                  <div>
                    <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] block mb-0.5">SOURCE</span>
                    <Badge variant="accent">
                      {appt.booked_by === 'ai_agent' ? 'AI AGENT' : appt.booked_by?.toUpperCase() || 'UNKNOWN'}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] block mb-0.5">CONFIRMATION</span>
                    <span className="font-['Space_Mono'] text-[10px] text-[var(--primary-accent)]">{appt.confirmation_number}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white border border-[var(--border-light)] rounded-[2px]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-light)]">
                    <th className="text-left font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] py-3 px-4">CUSTOMER</th>
                    <th className="text-left font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] py-3 px-4">SERVICE</th>
                    <th className="text-left font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] py-3 px-4">DATE TIME</th>
                    <th className="text-left font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] py-3 px-4">STATUS</th>
                    <th className="text-left font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] py-3 px-4">PAYMENT STATUS</th>
                    <th className="text-left font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] py-3 px-4">SOURCE</th>
                    <th className="text-left font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] py-3 px-4">CONFIRMATION</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="border-b border-[var(--border-light)] hover:bg-[var(--cream)] transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 text-[var(--primary-accent)]" />
                            <span className="font-['Space_Mono'] text-sm text-[var(--foreground)]">{appt.patient_name}</span>
                          </div>
                          {appt.patient_phone && (
                            <div className="flex items-center gap-1 mt-1">
                              <Phone className="w-2.5 h-2.5 text-[var(--muted-text)]" />
                              <span className="font-['Space_Mono'] text-[10px] text-[var(--muted-text)]">{appt.patient_phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-['Space_Mono'] text-sm text-[var(--foreground)]">{appt.service}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-['Space_Mono'] text-sm text-[var(--foreground)]">{formatDate(appt.appointment_date)}</div>
                        <div className="font-['Space_Mono'] text-[10px] text-[var(--muted-text)]">{formatTime(appt.appointment_time)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={
                          (appt.booking_status || appt.status) === 'confirmed' ? 'success' :
                          (appt.booking_status || appt.status) === 'pending_payment' ? 'warning' :
                          (appt.booking_status || appt.status) === 'pending_approval' ? 'warning' :
                          (appt.booking_status || appt.status) === 'payment_expired' ? 'destructive' :
                          (appt.booking_status || appt.status) === 'cancelled' ? 'destructive' :
                          'default'
                        }>
                          {(appt.booking_status || appt.status || 'confirmed').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {appt.booking_status === 'confirmed' && !appt.payment_required ? (
                          <Badge variant="default">NO PAYMENT REQ</Badge>
                        ) : appt.booking_status === 'confirmed' && appt.payment_status === 'completed' ? (
                          <div>
                            <Badge variant="success">PAID</Badge>
                            {appt.payment_amount && (
                              <span className="font-['Space_Mono'] text-[10px] text-[var(--muted-text)] ml-2">{formatCurrency(appt.payment_amount)}</span>
                            )}
                          </div>
                        ) : appt.booking_status === 'pending_payment' ? (
                          <div>
                            <Badge variant="warning">PENDING PAYMENT</Badge>
                            {appt.payment_deadline && (
                              <div className="font-['Space_Mono'] text-[10px] text-[var(--muted-text)] mt-1">{getPaymentCountdown(appt.payment_deadline)}</div>
                            )}
                          </div>
                        ) : appt.booking_status === 'payment_expired' ? (
                          <Badge variant="destructive">EXPIRED</Badge>
                        ) : (
                          <span className="font-['Space_Mono'] text-[10px] text-[var(--muted-text)]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="accent">
                          {appt.booked_by === 'ai_agent' ? 'AI AGENT' : appt.booked_by?.toUpperCase() || 'UNKNOWN'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-['Space_Mono'] text-[10px] text-[var(--primary-accent)]">{appt.confirmation_number}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white border border-[var(--border-light)] rounded-[2px] text-center py-16">
          <CalendarCheck className="w-10 h-10 text-[var(--muted-text)] mx-auto mb-3" />
          <p className="font-['Space_Mono'] text-sm text-[var(--muted-text)]">No appointments booked yet via AI agents.</p>
        </div>
      )}
    </div>
  )
}
