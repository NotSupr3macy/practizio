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

  return (
    <DashboardShell
      logoHref="/dashboard"
      sidebar={<Sidebar practice={practice} userEmail={user.email || ''} />}
    >
      {children}
    </DashboardShell>
  )
}
