import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LayoutDashboard, Building2, Users, Wrench, LogOut } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export const metadata = {
  title: 'Admin — SpadeChat',
}

const navItems = [
  { href: '/admin', label: 'OVERVIEW', icon: LayoutDashboard },
  { href: '/admin/businesses', label: 'BUSINESSES', icon: Building2 },
  { href: '/admin/leads', label: 'LEADS', icon: Users },
  { href: '/admin/setup', label: 'SETUP', icon: Wrench },
]

function isAdmin(email: string | undefined): boolean {
  if (!email) return false
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
  return adminEmails.includes(email.toLowerCase())
}

function AdminSidebar({ email }: { email: string }) {
  return (
    <aside
      className="h-screen w-[260px] bg-[#080808] flex flex-col"
      style={{ borderRight: '1px solid rgba(255, 255, 255, 0.04)' }}
    >
      {/* Logo */}
      <div
        className="px-6 py-6"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
      >
        <Link href="/admin" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="SpadeChat Admin" className="w-7 h-7 object-contain" />
          <span className="font-display font-extrabold uppercase tracking-tightest text-base text-chrome">
            SPADECHAT ADMIN
          </span>
        </Link>
        <p className="mt-2.5 mono-label-sm text-white/15 truncate">
          {email}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-6 py-2.5 font-mono text-[11px] font-medium uppercase transition-all duration-300 mx-2 rounded-lg text-white/25 hover:text-white/50 hover:bg-white/[0.02]"
            style={{ letterSpacing: '0.15em' }}
          >
            <item.icon className="w-4 h-4 opacity-30" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-6 py-4"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-pink animate-glow-pulse" />
          <span className="mono-label-sm text-white/20">ADMIN MODE</span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 w-full py-2 font-mono text-[10px] font-medium uppercase text-white/15 hover:text-accent transition-all duration-300"
          style={{ letterSpacing: '0.3em' }}
        >
          <LogOut className="w-3.5 h-3.5" />
          BACK TO SITE
        </Link>
      </div>
    </aside>
  )
}

export default async function AdminLayout({
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

  if (!isAdmin(user.email)) {
    redirect('/dashboard')
  }

  return (
    <DashboardShell
      logoHref="/admin"
      title="SPADECHAT ADMIN"
      sidebar={<AdminSidebar email={user.email || ''} />}
    >
      {children}
    </DashboardShell>
  )
}
