import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LayoutDashboard, Building2, Users, Wrench, Settings, LogOut } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export const metadata = {
  title: 'Admin — SpadeChat',
}

const navItems = [
  { href: '/admin', label: 'OVERVIEW', icon: LayoutDashboard },
  { href: '/admin/businesses', label: 'BUSINESSES', icon: Building2 },
  { href: '/admin/leads', label: 'LEADS', icon: Users },
  { href: '/admin/setup', label: 'SETUP', icon: Wrench },
  { href: '/admin/settings', label: 'SETTINGS', icon: Settings },
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
      className="h-screen w-[260px] flex flex-col"
      style={{ backgroundColor: 'var(--navy)', borderRight: '1px solid var(--border-light)' }}
    >
      {/* Logo */}
      <div
        className="px-6 py-6"
        style={{ borderBottom: '1px solid var(--border-light)' }}
      >
        <Link href="/admin" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="SpadeChat Admin" className="w-7 h-7 object-contain" />
          <span style={{ fontFamily: "'Anton', sans-serif", fontWeight: 400, letterSpacing: '0.05em', fontSize: '16px', color: 'white' }}>
            SPADECHAT ADMIN
          </span>
        </Link>
        <p className="mt-2.5 truncate" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>
          {email}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-6 py-2.5 mx-2 transition-all duration-300"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.4)',
              borderLeft: '2px solid transparent',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
          >
            <item.icon className="w-4 h-4 opacity-40" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-6 py-4"
        style={{ borderTop: '1px solid var(--border-light)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--primary-accent)' }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>ADMIN MODE</span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 w-full py-2 transition-all duration-300"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.3)',
          }}
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
