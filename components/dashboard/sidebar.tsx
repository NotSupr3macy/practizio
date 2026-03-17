'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Practice } from '@/types/database'
import {
  LayoutDashboard, FileText, Briefcase, Calendar, BarChart3,
  CreditCard, Settings, LogOut, CalendarCheck, ShoppingCart,
} from 'lucide-react'

interface SidebarProps {
  practice: Practice
  userEmail: string
  needsAttention?: Record<string, boolean>
}

function getNavItems(interactionType: string) {
  const items = [
    { href: '/dashboard', label: 'OVERVIEW', icon: LayoutDashboard },
    { href: '/dashboard/listing', label: 'LISTING', icon: FileText },
  ]
  if (interactionType !== 'order') {
    items.push({ href: '/dashboard/appointments', label: 'APPOINTMENTS', icon: CalendarCheck })
    items.push({ href: '/dashboard/services', label: 'SERVICES', icon: Briefcase })
  }
  if (interactionType !== 'appointment') {
    items.push({ href: '/dashboard/orders', label: 'ORDERS', icon: ShoppingCart })
  }
  items.push(
    { href: '/dashboard/availability', label: 'AVAILABILITY', icon: Calendar },
    { href: '/dashboard/analytics', label: 'ANALYTICS', icon: BarChart3 },
    { href: '/dashboard/billing', label: 'BILLING', icon: CreditCard },
    { href: '/dashboard/settings', label: 'SETTINGS', icon: Settings },
  )
  return items
}

export function Sidebar({ practice, userEmail, needsAttention = {} }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside className="h-screen w-[260px] bg-[#080808] flex flex-col" style={{ borderRight: '1px solid rgba(255, 255, 255, 0.04)' }}>
      {/* Logo */}
      <div className="px-6 py-6" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="SpadeChat" className="w-7 h-7 object-contain" />
          <span className="font-display font-extrabold uppercase tracking-tightest text-base text-chrome">
            SPADECHAT
          </span>
        </Link>
        <p className="mt-2.5 mono-label-sm text-white/15 truncate">
          {practice.name?.toUpperCase() || 'UNNAMED BUSINESS'}
        </p>
        {practice.industry && (
          <p className="mono-label-sm text-white/10 truncate mt-0.5" style={{ fontSize: '8px' }}>
            {(practice.industry as string).toUpperCase()}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {getNavItems(practice.interaction_type || 'appointment').map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-6 py-2.5 font-mono text-[11px] font-medium uppercase transition-all duration-300 mx-2 rounded-lg',
                active
                  ? 'text-accent bg-accent/[0.06]'
                  : 'text-white/25 hover:text-white/50 hover:bg-white/[0.02]'
              )}
              style={{ letterSpacing: '0.15em' }}
            >
              <item.icon className={cn('w-4 h-4', active ? 'text-accent' : 'opacity-30')} />
              {item.label}
              {needsAttention[item.href] && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-auto shrink-0" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Status */}
      <div className="px-6 py-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${practice.is_active ? 'bg-accent animate-glow-pulse' : 'bg-neon-pink'}`} />
          <span className="mono-label-sm text-white/20">
            {practice.is_active ? 'AI BOOKING ACTIVE' : 'AI BOOKING INACTIVE'}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="mono-label-sm text-white/10" style={{ fontSize: '8px' }}>
            PLAN: {((practice.plan as string) || 'free').toUpperCase()}
          </span>
        </div>
      </div>

      {/* User */}
      <div className="px-6 py-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
        <p className="mono-label-sm text-white/15 truncate mb-3">
          {userEmail}
        </p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full py-2 font-mono text-[10px] font-medium uppercase text-white/15 hover:text-accent transition-all duration-300"
          style={{ letterSpacing: '0.3em' }}
        >
          <LogOut className="w-3.5 h-3.5" />
          SIGN OUT
        </button>
      </div>
    </aside>
  )
}
