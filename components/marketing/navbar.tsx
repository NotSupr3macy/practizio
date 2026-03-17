'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'DIRECTORY', href: '/directory' },
  { label: 'FOR BUSINESSES', href: '/#features' },
  { label: 'ABOUT', href: '/about' },
] as const

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={
        scrolled
          ? {
              background: 'rgba(247, 246, 242, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border-light)',
            }
          : {
              mixBlendMode: 'difference' as const,
            }
      }
    >
      <div className="w-full px-6 md:px-10 h-[72px] flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Practizio" className="w-12 h-12 object-contain" />
            <span
              className="font-display uppercase tracking-widest text-[20px]"
              style={{ color: scrolled ? 'var(--foreground)' : 'var(--white)' }}
            >
              PRACTIZIO
            </span>
          </Link>
        </div>

        {/* Center: Nav links (desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[10px] uppercase transition-all duration-400"
              style={{
                letterSpacing: '0.3em',
                color: scrolled ? 'var(--muted-text)' : 'rgba(255,255,255,0.4)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: CTA (desktop) */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/get-setup"
            className="font-mono text-[10px] uppercase transition-all duration-400"
            style={{
              letterSpacing: '0.3em',
              padding: '10px 24px',
              borderRadius: '2px',
              border: scrolled
                ? '1px solid var(--foreground)'
                : '1px solid rgba(255,255,255,0.5)',
              color: scrolled ? 'var(--foreground)' : 'var(--white)',
            }}
          >
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
            className={`block w-5 h-[1.5px] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`}
            style={{ background: scrolled ? 'var(--foreground)' : 'var(--white)' }}
          />
          <span
            className={`block w-5 h-[1.5px] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`}
            style={{ background: scrolled ? 'var(--foreground)' : 'var(--white)' }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}
        style={{
          background: 'rgba(247, 246, 242, 0.95)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ height: '1px', background: 'var(--border-light)' }} />
        <div className="px-6 py-8 flex flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[10px] uppercase transition-all duration-300"
              style={{ letterSpacing: '0.3em', color: 'var(--muted-text)' }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ height: '1px', background: 'var(--border-light)' }} />
          <Link
            href="/get-setup"
            className="font-mono text-[10px] uppercase text-center transition-all duration-300"
            style={{
              letterSpacing: '0.3em',
              padding: '12px 24px',
              border: '1px solid var(--foreground)',
              borderRadius: '2px',
              color: 'var(--foreground)',
            }}
            onClick={() => setMobileOpen(false)}
          >
            GET ACCESS
          </Link>
        </div>
      </div>
    </nav>
  )
}
