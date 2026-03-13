'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Directory', href: '/directory' },
] as const

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md hairline-b">
      <div className="w-full px-6 h-[72px] flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="font-display font-black uppercase tracking-tightest text-lg text-foreground">
              PRACTIZIO
            </span>
          </Link>
          <span className="w-1.5 h-1.5 rounded-full bg-white mx-3 shrink-0" />
          <span className="mono-label-sm opacity-40 whitespace-nowrap">
            BETA_V.01
          </span>
        </div>

        {/* Center: Nav links (desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-wide-mono opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Sign In + CTA (desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/login"
            className="font-mono text-[11px] uppercase tracking-wide-mono opacity-60 hover:opacity-100 transition-opacity duration-300"
          >
            Sign In
          </Link>
          <Link href="/signup" className="btn-pill">
            GET ACCESS
          </Link>
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <span
            className={`block w-5 h-[1px] bg-white transition-all duration-300 ${
              mobileOpen ? 'rotate-45 translate-y-[3.5px]' : ''
            }`}
          />
          <span
            className={`block w-5 h-[1px] bg-white transition-all duration-300 ${
              mobileOpen ? '-rotate-45 -translate-y-[3.5px]' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-black/95 backdrop-blur-md ${
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-8 flex flex-col gap-6 hairline-t">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-wide-mono opacity-60 hover:opacity-100 transition-opacity duration-300"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="hairline-t pt-6 flex flex-col gap-6">
            <Link
              href="/login"
              className="font-mono text-[11px] uppercase tracking-wide-mono opacity-60 hover:opacity-100 transition-opacity duration-300"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="btn-pill text-center"
              onClick={() => setMobileOpen(false)}
            >
              GET ACCESS
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
