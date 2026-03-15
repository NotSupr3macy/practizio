'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Directory', href: '/directory' },
] as const

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel-strong">
      <div className="w-full px-6 md:px-10 h-[72px] flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="SpadeChat" className="w-12 h-12 object-contain" />
            <span className="font-display font-extrabold uppercase tracking-tightest text-lg text-chrome">
              SPADECHAT
            </span>
          </Link>
          <span className="hidden sm:inline-block mono-label-sm text-white/20">
            BETA V.01
          </span>
        </div>

        {/* Center: Nav links (desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-wide-mono text-white/40 hover:text-accent transition-all duration-400"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Sign In + CTA (desktop) */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/login"
            className="font-mono text-[11px] uppercase tracking-wide-mono text-white/40 hover:text-white transition-all duration-400"
          >
            Sign In
          </Link>
          <Link href="/get-setup" className="btn-pill">
            GET SET UP FREE
          </Link>
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <span className={`block w-5 h-[1.5px] bg-accent transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-accent transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-400 ${mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="divider-chrome" />
        <div className="px-6 py-8 flex flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="font-mono text-[11px] uppercase tracking-wide-mono text-white/40 hover:text-accent transition-all duration-300" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="divider-chrome my-2" />
          <Link href="/login" className="font-mono text-[11px] uppercase tracking-wide-mono text-white/40 hover:text-white transition-all duration-300" onClick={() => setMobileOpen(false)}>Sign In</Link>
          <Link href="/get-setup" className="btn-pill text-center" onClick={() => setMobileOpen(false)}>GET SET UP FREE</Link>
        </div>
      </div>
    </nav>
  )
}
