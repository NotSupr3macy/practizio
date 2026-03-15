'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils'
import { CalendarCheck, User, Clock, Phone, Mail } from 'lucide-react'

interface Appointment {
  id: string
  confirmation_number: string
  customer_name: string
  customer_email: string | null
  customer_phone: string | null
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
    return <div className="flex items-center justify-center min-h-[400px]"><div className="mono-label-sm opacity-40">LOADING APPOINTMENTS</div></div>
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="mono-label-sm opacity-40 block mb-3">APPOINTMENT MANAGEMENT</span>
        <h1 className="font-display font-black uppercase text-3xl tracking-tightest">APPOINTMENTS</h1>
        <p className="font-sans text-sm font-light opacity-50 mt-2">All appointments booked through AI agents</p>
      </div>

      {appointments.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="hairline-b">
                  <th className="text-left mono-label-sm opacity-40 py-3 px-4">CUSTOMER</th>
                  <th className="text-left mono-label-sm opacity-40 py-3 px-4">SERVICE</th>
                  <th className="text-left mono-label-sm opacity-40 py-3 px-4">DATE TIME</th>
                  <th className="text-left mono-label-sm opacity-40 py-3 px-4">STATUS</th>
                  <th className="text-left mono-label-sm opacity-40 py-3 px-4">PAYMENT STATUS</th>
                  <th className="text-left mono-label-sm opacity-40 py-3 px-4">SOURCE</th>
                  <th className="text-left mono-label-sm opacity-40 py-3 px-4">CONFIRMATION</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hairline-b hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-accent" />
                          <span className="font-mono text-sm">{appt.customer_name}</span>
                        </div>
                        {appt.customer_phone && (
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="w-2.5 h-2.5 opacity-30" />
                            <span className="font-mono text-[10px] opacity-40">{appt.customer_phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm">{appt.service}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-sm">{formatDate(appt.appointment_date)}</div>
                      <div className="font-mono text-[10px] opacity-40">{formatTime(appt.appointment_time)}</div>
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
                            <span className="font-mono text-[10px] opacity-40 ml-2">{formatCurrency(appt.payment_amount)}</span>
                          )}
                        </div>
                      ) : appt.booking_status === 'pending_payment' ? (
                        <div>
                          <Badge variant="warning">PENDING PAYMENT</Badge>
                          {appt.payment_deadline && (
                            <div className="font-mono text-[10px] opacity-40 mt-1">{getPaymentCountdown(appt.payment_deadline)}</div>
                          )}
                        </div>
                      ) : appt.booking_status === 'payment_expired' ? (
                        <Badge variant="destructive">EXPIRED</Badge>
                      ) : (
                        <span className="font-mono text-[10px] opacity-30">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="accent">
                        {appt.booked_by === 'ai_agent' ? 'AI AGENT' : appt.booked_by?.toUpperCase() || 'UNKNOWN'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] text-accent">{appt.confirmation_number}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="text-center py-16">
          <CalendarCheck className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="font-mono text-sm opacity-30">No appointments booked yet via AI agents.</p>
        </Card>
      )}
    </div>
  )
}
