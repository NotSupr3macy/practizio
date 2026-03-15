'use client'

import { useState } from 'react'
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

export default function GetSetupForm() {
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
          referral_source: 'get_setup_page',
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

  const inputStyle = { borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }

  if (success) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center px-6">
        <div className="card-chrome p-10 md:p-14 max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full mx-auto glass-panel flex items-center justify-center mb-6">
            <span className="text-accent font-display font-extrabold text-2xl">✓</span>
          </div>
          <h2 className="font-display font-extrabold uppercase text-2xl tracking-tightest text-chrome-3d mb-4">
            YOU&apos;RE ALL SET
          </h2>
          <p className="font-sans text-sm text-white/50 leading-relaxed">
            Thanks! We&apos;ll have your AI booking set up within 24 hours. Check your email for a confirmation.
          </p>
          <Link href="/" className="inline-block mt-8 btn-solid">
            BACK TO HOME
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-[72px] min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="mb-10">
          <span className="mono-label-sm opacity-40 block mb-4">CONCIERGE SETUP</span>
          <h1 className="font-display font-black uppercase text-3xl md:text-5xl tracking-tightest text-chrome-3d">
            WE&apos;LL SET IT UP FOR YOU
          </h1>
          <p className="font-sans text-sm font-light opacity-50 mt-4 max-w-md">
            No tech skills needed. Tell us about your business and we&apos;ll configure your AI booking system — completely free.
          </p>
        </div>

        {/* Form */}
        <div className="card-chrome p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="business-name" className="mono-label-sm text-white/30 mb-2 block">
                BUSINESS NAME *
              </label>
              <input
                id="business-name"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                placeholder="e.g. Joe's Barbershop"
                className="w-full bg-transparent pb-3 font-mono text-sm text-white placeholder:text-white/15 focus:outline-none transition-colors duration-300"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="owner-name" className="mono-label-sm text-white/30 mb-2 block">
                YOUR NAME *
              </label>
              <input
                id="owner-name"
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
                placeholder="e.g. Joe Smith"
                className="w-full bg-transparent pb-3 font-mono text-sm text-white placeholder:text-white/15 focus:outline-none transition-colors duration-300"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="email" className="mono-label-sm text-white/30 mb-2 block">
                EMAIL *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@business.com"
                className="w-full bg-transparent pb-3 font-mono text-sm text-white placeholder:text-white/15 focus:outline-none transition-colors duration-300"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="phone" className="mono-label-sm text-white/30 mb-2 block">
                PHONE
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full bg-transparent pb-3 font-mono text-sm text-white placeholder:text-white/15 focus:outline-none transition-colors duration-300"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="booking-system" className="mono-label-sm text-white/30 mb-2 block">
                WHAT BOOKING SYSTEM DO YOU USE?
              </label>
              <select
                id="booking-system"
                value={bookingSystem}
                onChange={(e) => setBookingSystem(e.target.value)}
                className="w-full bg-transparent pb-3 font-mono text-sm text-white focus:outline-none transition-colors duration-300 appearance-none cursor-pointer"
                style={inputStyle}
              >
                {BOOKING_SYSTEMS.map((system) => (
                  <option key={system} value={system} className="bg-black text-white">
                    {system}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="glass-panel rounded-lg px-4 py-3" style={{ borderColor: 'rgba(255, 51, 102, 0.2)' }}>
                <p className="text-destructive font-mono text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-solid disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? 'SUBMITTING...' : 'GET SET UP FREE'}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="mt-8 text-center">
          <span className="mono-label-sm text-white/20">WANT TO SET IT UP YOURSELF?</span>{' '}
          <Link href="/signup" className="text-accent hover:text-accent-hover mono-label-sm transition-colors duration-300">
            SIGN UP HERE
          </Link>
        </p>
      </div>
    </div>
  )
}
