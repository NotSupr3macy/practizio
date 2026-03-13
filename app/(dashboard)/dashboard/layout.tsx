import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'

export const metadata = {
  title: 'Dashboard',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar practice={practice} userEmail={user.email || ''} />
      <main className="flex-1 ml-[260px] p-8 md:p-12">{children}</main>
    </div>
  )
}
