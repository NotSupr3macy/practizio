'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Practice } from '@/types/database'
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Calendar,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
} from 'lucide-react'

interface SidebarProps {
  practice: Practice
  userEmail: string
}

const navItems = [
  { href: '/dashboard', label: 'OVERVIEW', icon: LayoutDashboard },
  { href: '/dashboard/listing', label: 'LISTING', icon: FileText },
  { href: '/dashboard/services', label: 'SERVICES', icon: Briefcase },
  { href: '/dashboard/availability', label: 'AVAILABILITY', icon: Calendar },
  { href: '/dashboard/analytics', label: 'ANALYTICS', icon: BarChart3 },
  { href: '/dashboard/billing', label: 'BILLING', icon: CreditCard },
  { href: '/dashboard/settings', label: 'SETTINGS', icon: Settings },
]

export function Sidebar({ practice, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-background hairline-r flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6 hairline-b">
        <Link href="/dashboard" className="block">
          <span className="font-display font-black uppercase tracking-tightest text-lg text-white">
            PRACTIZIO
          </span>
        </Link>
        <p className="mt-2 mono-label-sm opacity-40 truncate">
          {practice.name?.toUpperCase().replace(/ /g, '_') || 'UNNAMED_PRACTICE'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-6 py-3 font-mono text-[11px] font-medium uppercase transition-all duration-300',
                active
                  ? 'text-white bg-white/[0.05] border-l-[2px] border-accent'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.02] border-l-[2px] border-transparent'
              )}
              style={{ letterSpacing: '0.2em' }}
            >
              <item.icon className={cn('w-4 h-4', active ? 'text-accent' : 'opacity-40')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Status indicator */}
      <div className="px-6 py-3 hairline-t">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="mono-label-sm opacity-40">MCP_ENDPOINT_ACTIVE</span>
        </div>
      </div>

      {/* User section */}
      <div className="px-6 py-4 hairline-t">
        <p className="mono-label-sm opacity-30 truncate mb-3">
          {userEmail.toUpperCase().replace(/@/g, '_AT_').replace(/\./g, '_')}
        </p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full py-2 font-mono text-[10px] font-medium uppercase text-white/30 hover:text-white transition-all duration-300"
          style={{ letterSpacing: '0.3em' }}
        >
          <LogOut className="w-3.5 h-3.5" />
          SIGN_OUT
        </button>
      </div>
    </aside>
  )
}
