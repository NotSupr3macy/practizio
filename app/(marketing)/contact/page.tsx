'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', business: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', business: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    fontFamily: '"Playfair Display", serif',
    fontSize: '15px',
    fontWeight: 300,
    color: 'var(--white)',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '2px',
    outline: 'none',
  } as const

  return (
    <section
      className="min-h-screen py-32 px-6 md:px-10"
      style={{ background: 'var(--navy)' }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <span
          className="font-mono text-[10px] uppercase block mb-6"
          style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}
        >
          GET IN TOUCH
        </span>

        <h1
          className="editorial-heading mb-6"
          style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            color: 'var(--white)',
            lineHeight: 1.1,
          }}
        >
          Contact{' '}
          <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.35)' }}>
            SpadeChat.
          </span>
        </h1>

        <p
          className="mb-12"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 300,
            fontSize: '16px',
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.7,
            maxWidth: 480,
          }}
        >
          Have a question, want to learn more, or ready to get your business AI-bookable?
          Drop us a message and we&apos;ll get back to you.
        </p>

        {status === 'sent' ? (
          <div
            className="py-16 text-center"
            style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '2px' }}
          >
            <h2
              className="editorial-heading mb-4"
              style={{ fontSize: '28px', color: 'var(--white)' }}
            >
              Message sent.
            </h2>
            <p
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 300,
                fontSize: '15px',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              We&apos;ll be in touch soon — thanks for reaching out.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Your name *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email address *"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
              />
            </div>

            <input
              type="text"
              placeholder="Business name (optional)"
              value={form.business}
              onChange={(e) => setForm({ ...form, business: e.target.value })}
              style={inputStyle}
            />

            <textarea
              placeholder="Tell us how we can help... *"
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' as const }}
            />

            {status === 'error' && (
              <p style={{ color: '#e55', fontSize: '14px', fontFamily: '"Playfair Display", serif' }}>
                Something went wrong. Please try again or email us directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="font-mono text-[10px] uppercase self-start transition-all duration-300"
              style={{
                letterSpacing: '0.25em',
                padding: '14px 40px',
                borderRadius: '2px',
                background: 'var(--white)',
                color: 'var(--navy)',
                fontWeight: 700,
                opacity: status === 'sending' ? 0.6 : 1,
                cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
            >
              {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
