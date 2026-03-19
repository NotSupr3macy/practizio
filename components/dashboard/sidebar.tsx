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
    <aside className="h-screen w-[260px] flex flex-col" style={{ background: 'var(--navy)', borderRight: '1px solid rgba(255, 255, 255, 0.06)' }}>
      {/* Logo */}
      <div className="px-6 py-6" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="SpadeChat" className="w-7 h-7 object-contain" />
          <span className="font-display uppercase" style={{ letterSpacing: '-0.02em', fontSize: '1rem', color: 'var(--white)' }}>
            SPADECHAT
          </span>
        </Link>
        <p className="font-mono mt-2.5 truncate" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.3)' }}>
          {practice.name?.toUpperCase() || 'UNNAMED BUSINESS'}
        </p>
        {practice.industry && (
          <p className="font-mono truncate mt-0.5" style={{ fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.15)' }}>
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
                'flex items-center gap-3 px-6 py-2.5 font-mono transition-all duration-300 relative',
                active
                  ? 'text-white'
                  : 'text-white/25 hover:text-white/50'
              )}
              style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.2em' }}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5" style={{ background: 'var(--primary-accent)' }} />
              )}
              <item.icon className={cn('w-4 h-4', active ? 'text-white' : 'opacity-30')} strokeWidth={1.5} />
              {item.label}
              {needsAttention[item.href] && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-auto shrink-0" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Status */}
      <div className="px-6 py-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${practice.is_active ? 'animate-glow-pulse' : ''}`} style={{ background: practice.is_active ? 'var(--primary-accent)' : '#e74c6f' }} />
          <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.3)' }}>
            {practice.is_active ? 'AI BOOKING ACTIVE' : 'AI BOOKING INACTIVE'}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono" style={{ fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.15)' }}>
            PLAN: {((practice.plan as string) || 'free').toUpperCase()}
          </span>
        </div>
      </div>

      {/* User */}
      <div className="px-6 py-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <p className="font-mono truncate mb-3" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.25)' }}>
          {userEmail}
        </p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full py-2 font-mono transition-all duration-300"
          style={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255, 255, 255, 0.25)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-accent)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.25)'}
        >
          <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
          SIGN OUT
        </button>
      </div>
    </aside>
  )
}
