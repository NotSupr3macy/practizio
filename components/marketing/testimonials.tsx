'use client'

import { useState } from 'react'

const testimonials = [
  {
    quote:
      'AI agents now handle 40% of our appointment bookings. Setup took under 10 minutes.',
    name: 'MARIA SANTOS',
    role: 'HAIR SALON OWNER',
  },
  {
    quote:
      'Our yoga studio is fully discoverable by AI assistants. New student signups tripled in the first month.',
    name: 'ALEX KUMAR',
    role: 'YOGA STUDIO FOUNDER',
  },
  {
    quote:
      'We get catering orders through AI assistants now. Customers describe what they want and the agent handles the rest. Revenue is up 25%.',
    name: 'PRIYA NAIR',
    role: 'RESTAURANT OWNER',
  },
]

export function Testimonials() {
  const [active, setActive] = useState(0)
  const t = testimonials[active]

  return (
    <section
      className="py-24 px-6 md:px-10 relative overflow-hidden"
      style={{ background: 'var(--charcoal)' }}
    >
      {/* Decorative quote mark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{
          fontFamily: 'Anton, sans-serif',
          fontSize: 'clamp(20rem, 40vw, 30rem)',
          lineHeight: 1,
          color: 'var(--navy)',
          opacity: 0.3,
        }}
      >
        &ldquo;
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Label */}
        <span
          className="font-mono text-[10px] uppercase block mb-10"
          style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)' }}
        >
          CLIENT FEEDBACK
        </span>

        {/* Quote */}
        <p
          className="font-display uppercase text-3xl md:text-5xl leading-tight"
          style={{ color: 'var(--white)' }}
        >
          {t.quote}
        </p>

        {/* Attribution */}
        <div className="mt-10">
          <span
            className="font-mono text-sm uppercase font-bold block"
            style={{ letterSpacing: '0.2em', color: 'var(--white)' }}
          >
            {t.name}
          </span>
          <span
            className="font-mono text-sm uppercase block mt-1"
            style={{ letterSpacing: '0.2em', fontWeight: 400, color: 'var(--taupe)' }}
          >
            {t.role}
          </span>
        </div>

        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-3 mt-10">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className="transition-all duration-300"
              style={{
                width: idx === active ? 24 : 8,
                height: 8,
                borderRadius: '9999px',
                background: idx === active ? 'var(--primary-accent)' : 'rgba(255,255,255,0.15)',
              }}
              aria-label={`Show testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
