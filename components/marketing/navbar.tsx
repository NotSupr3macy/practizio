'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const NAV_LEFT = [
  { label: 'DIRECTORY', href: '/directory' },
  { label: 'FOR BUSINESSES', href: '/#features' },
] as const

const NAV_RIGHT = [
  { label: 'ABOUT', href: '/about' },
] as const

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(247, 246, 242, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-light)' : '1px solid transparent',
      }}
    >
      <div className="w-full px-6 md:px-10 h-[72px] flex items-center justify-between">
        {/* Left: Nav links (desktop) */}
        <div className="hidden md:flex items-center gap-8 flex-1">
          {NAV_LEFT.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[10px] uppercase transition-all duration-300 hover:text-[var(--foreground)]"
              style={{
                letterSpacing: '0.3em',
                color: 'var(--muted-text)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Center: Brand */}
        <div className="flex items-center justify-center">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="flex items-center gap-1"
              style={{ color: 'var(--primary-accent)' }}
            >
              {/* Minimal logo mark */}
              <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
                <line x1="0" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="2" />
                <line x1="16" y1="4" x2="28" y2="4" stroke="currentColor" strokeWidth="2" />
                <line x1="16" y1="12" x2="28" y2="12" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span
              className="font-mono uppercase tracking-[0.35em] text-[14px] font-bold"
              style={{ color: 'var(--foreground)' }}
            >
              SPADECHAT
            </span>
          </Link>
        </div>

        {/* Right: Nav links + CTA (desktop) */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-end">
          {NAV_RIGHT.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[10px] uppercase transition-all duration-300 hover:text-[var(--foreground)]"
              style={{
                letterSpacing: '0.3em',
                color: 'var(--muted-text)',
              }}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="font-mono text-[10px] uppercase transition-all duration-300"
              style={{
                letterSpacing: '0.25em',
                padding: '10px 24px',
                borderRadius: '2px',
                background: 'var(--primary-accent)',
                color: 'var(--white)',
              }}
            >
              DASHBOARD
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="font-mono text-[10px] uppercase transition-all duration-300 hover:text-[var(--foreground)]"
                style={{
                  letterSpacing: '0.3em',
                  color: 'var(--muted-text)',
                }}
              >
                SIGN IN
              </Link>
              <Link
                href="/get-setup"
                className="font-mono text-[10px] uppercase transition-all duration-300"
                style={{
                  letterSpacing: '0.25em',
                  padding: '10px 24px',
                  borderRadius: '2px',
                  background: 'var(--primary-accent)',
                  color: 'var(--white)',
                }}
              >
                GET ACCESS
              </Link>
            </>
          )}
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
            style={{ background: 'var(--foreground)' }}
          />
          <span
            className={`block w-5 h-[1.5px] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`}
            style={{ background: 'var(--foreground)' }}
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
          {[...NAV_LEFT, ...NAV_RIGHT].map((link) => (
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
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="font-mono text-[10px] uppercase text-center transition-all duration-300"
              style={{
                letterSpacing: '0.25em',
                padding: '12px 24px',
                borderRadius: '2px',
                background: 'var(--primary-accent)',
                color: 'var(--white)',
              }}
              onClick={() => setMobileOpen(false)}
            >
              DASHBOARD
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="font-mono text-[10px] uppercase transition-all duration-300"
                style={{ letterSpacing: '0.3em', color: 'var(--muted-text)' }}
                onClick={() => setMobileOpen(false)}
              >
                SIGN IN
              </Link>
              <Link
                href="/get-setup"
                className="font-mono text-[10px] uppercase text-center transition-all duration-300"
                style={{
                  letterSpacing: '0.25em',
                  padding: '12px 24px',
                  borderRadius: '2px',
                  background: 'var(--primary-accent)',
                  color: 'var(--white)',
                }}
                onClick={() => setMobileOpen(false)}
              >
                GET ACCESS
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
