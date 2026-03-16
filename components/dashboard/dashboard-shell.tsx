'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

interface DashboardShellProps {
  children: React.ReactNode
  sidebar: React.ReactNode
  logoHref: string
  title?: string
}

export function DashboardShell({ children, sidebar, logoHref, title }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Prevent body scroll when sidebar overlay is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-[#080808] flex items-center justify-between px-4 z-50 lg:hidden"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
      >
        <Link href={logoHref} className="flex items-center gap-2">
          <img src="/logo.png" alt="SpadeChat" className="w-6 h-6 object-contain" />
          <span className="font-display font-extrabold uppercase tracking-tightest text-sm text-chrome">
            {title || 'SPADECHAT'}
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed left-0 top-0 h-screen z-50
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {sidebar}
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-0 pt-14 p-4 sm:p-6 lg:pt-0 lg:ml-[260px] lg:p-8 xl:p-12">
        {children}
      </main>
    </div>
  )
}
