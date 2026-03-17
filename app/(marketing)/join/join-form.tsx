'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const BOOKING_SYSTEMS = [
  "I don't use one yet",
  'Google Calendar',
  'Calendly',
  'Acuity Scheduling',
  'Square Appointments',
  'Jane App',
  'Mindbody',
  'Vagaro',
  'Other',
]

export default function JoinForm() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  const [businessName, setBusinessName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [bookingSystem, setBookingSystem] = useState(BOOKING_SYSTEMS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: businessName,
          owner_name: ownerName,
          email,
          phone: phone || null,
          booking_system: bookingSystem,
          referral_source: 'join_page',
          referred_by_slug: ref || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { borderBottom: '1px solid var(--border-light)' }
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/join${businessName ? `?ref=${encodeURIComponent(businessName.toLowerCase().replace(/\s+/g, '-'))}` : ''}`
    : ''

  if (success) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center px-6 bg-[var(--cream)]">
        <div className="bg-white border border-[var(--border-light)] rounded-[2px] p-10 md:p-14 max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-[2px] mx-auto border border-[var(--border-light)] flex items-center justify-center mb-6">
            <span className="text-[var(--primary-accent)] text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>&#10003;</span>
          </div>
          <h2 className="text-2xl tracking-tight text-[var(--foreground)] mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
            You&apos;re In
          </h2>
          <p className="font-mono text-sm text-[var(--muted-text)] leading-relaxed mb-8">
            Thanks! We&apos;ll have your AI booking set up within 24 hours. Check your email for a confirmation.
          </p>

          {/* Referral share */}
          <div className="bg-[var(--cream)] border border-[var(--border-light)] rounded-[2px] p-6 text-left">
            <span className="mono-label-sm text-[var(--primary-accent)] block mb-3">KNOW OTHER BUSINESS OWNERS?</span>
            <p className="font-mono text-sm text-[var(--muted-text)] mb-4">
              Share this link and help them get AI-bookable too:
            </p>
            <div
              className="font-mono text-xs text-[var(--foreground)] bg-white p-3 rounded-[2px] break-all select-all cursor-pointer border border-[var(--border-light)]"
            >
              {shareUrl}
            </div>
          </div>

          <Link href="/" className="inline-block mt-8 btn-primary">
            BACK TO HOME
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-[72px] min-h-screen flex items-center justify-center px-6 py-16 bg-[var(--cream)] bg-editorial-grid">
      <div className="max-w-lg w-full relative z-10">
        {/* Header */}
        <div className="mb-10">
          <span className="mono-label-sm text-[var(--muted-text)] block mb-4">JOIN SPADECHAT</span>
          <h1 className="text-3xl md:text-5xl tracking-tight text-[var(--foreground)]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
            Get your business <em className="text-[var(--taupe)]">AI-bookable</em>
          </h1>
          <p className="font-mono text-xs text-[var(--muted-text)] mt-4 max-w-md uppercase" style={{ letterSpacing: '0.2em' }}>
            Let AI assistants find and book your services. We&apos;ll set everything up for you — free.
          </p>
          {ref && (
            <p className="font-mono text-xs text-[var(--primary-accent)] mt-2 uppercase" style={{ letterSpacing: '0.1em' }}>
              REFERRED BY: {ref}
            </p>
          )}
        </div>

        {/* Form */}
        <div className="bg-white border border-[var(--border-light)] rounded-[2px] p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="business-name" className="mono-label-sm text-[var(--muted-text)] mb-2 block">
                BUSINESS NAME *
              </label>
              <input
                id="business-name"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                placeholder="e.g. Joe's Barbershop"
                className="w-full bg-transparent pb-3 font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--muted-text)] focus:outline-none transition-colors duration-300"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="owner-name" className="mono-label-sm text-[var(--muted-text)] mb-2 block">
                YOUR NAME *
              </label>
              <input
                id="owner-name"
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
                placeholder="e.g. Joe Smith"
                className="w-full bg-transparent pb-3 font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--muted-text)] focus:outline-none transition-colors duration-300"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="email" className="mono-label-sm text-[var(--muted-text)] mb-2 block">
                EMAIL *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@business.com"
                className="w-full bg-transparent pb-3 font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--muted-text)] focus:outline-none transition-colors duration-300"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="phone" className="mono-label-sm text-[var(--muted-text)] mb-2 block">
                PHONE
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full bg-transparent pb-3 font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--muted-text)] focus:outline-none transition-colors duration-300"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="booking-system" className="mono-label-sm text-[var(--muted-text)] mb-2 block">
                WHAT BOOKING SYSTEM DO YOU USE?
              </label>
              <select
                id="booking-system"
                value={bookingSystem}
                onChange={(e) => setBookingSystem(e.target.value)}
                className="w-full bg-transparent pb-3 font-mono text-sm text-[var(--foreground)] focus:outline-none transition-colors duration-300 appearance-none cursor-pointer"
                style={inputStyle}
              >
                {BOOKING_SYSTEMS.map((system) => (
                  <option key={system} value={system} className="bg-white text-[var(--foreground)]">
                    {system}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="border border-[#c0392b]/20 rounded-[2px] px-4 py-3 bg-white">
                <p className="text-[#c0392b] font-mono text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? 'SUBMITTING...' : 'JOIN SPADECHAT'}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="mt-8 text-center">
          <span className="mono-label-sm text-[var(--muted-text)]">WANT TO SET IT UP YOURSELF?</span>{' '}
          <Link href="/signup" className="text-[var(--primary-accent)] hover:text-[var(--foreground)] mono-label-sm transition-colors duration-300">
            SIGN UP HERE
          </Link>
        </p>
      </div>
    </div>
  )
}
