import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { ConnectionGateWrapper } from '@/components/dashboard/connection-gate-wrapper'

export const metadata = {
  title: 'Dashboard',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: practice } = await supabase
    .from('practices')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!practice) {
    redirect('/onboarding')
  }

  // Gate: if booking system not connected, show connection flow
  if (!practice.booking_system_connected) {
    return (
      <ConnectionGateWrapper
        practice={practice}
        userEmail={user.email || ''}
      >
        {children}
      </ConnectionGateWrapper>
    )
  }

  // Check which sections need setup for sidebar pings
  const [
    { count: servicesCount },
    { count: availabilityCount },
  ] = await Promise.all([
    supabase.from('services').select('*', { count: 'exact', head: true }).eq('practice_id', practice.id),
    supabase.from('availability').select('*', { count: 'exact', head: true }).eq('practice_id', practice.id).eq('is_open', true),
  ])

  const needsAttention: Record<string, boolean> = {}
  if ((servicesCount ?? 0) === 0) needsAttention['/dashboard/services'] = true
  if ((availabilityCount ?? 0) === 0) needsAttention['/dashboard/availability'] = true
  if (!practice.booking_system_connected) needsAttention['/dashboard/settings'] = true

  return (
    <DashboardShell
      logoHref="/dashboard"
      sidebar={<Sidebar practice={practice} userEmail={user.email || ''} needsAttention={needsAttention} />}
    >
      {children}
    </DashboardShell>
  )
}
