'use client'

import { useState } from 'react'

const steps = [
  {
    number: '01',
    title: 'CONFIGURE',
    description: 'Enter your business details, services, availability, and product catalog.',
    detail: 'SETUP TIME: <10 MIN',
  },
  {
    number: '02',
    title: 'PUBLISH',
    description: 'We create your AI booking link and list your business in the AI directory.',
    detail: 'LIVE IN MINUTES',
  },
  {
    number: '03',
    title: 'DISCOVER',
    description: 'AI assistants worldwide can now find your business, book appointments, place orders, and more.',
    detail: 'GLOBAL AI REACH',
  },
]

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section
      id="how-it-works"
      className="section-light py-24 px-6 md:px-10"
      style={{ borderTop: '1px solid var(--border-light)' }}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Two-column header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <span
              className="font-mono text-[10px] uppercase block mb-4"
              style={{ letterSpacing: '0.3em', color: 'var(--taupe)' }}
            >
              HOW IT WORKS
            </span>
          </div>
          <div>
            <h2
              className="editorial-heading text-4xl md:text-6xl"
              style={{ color: 'var(--foreground)' }}
            >
              Set up in{' '}
              <span style={{ fontStyle: 'italic', color: 'var(--taupe)' }}>
                minutes.
              </span>
            </h2>
          </div>
        </div>

        {/* Steps — divider-separated, no cards */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {steps.map((step, idx) => {
            const isActive = idx === activeStep
            return (
              <div
                key={step.number}
                className="cursor-pointer transition-all duration-500 py-8 md:px-8 first:md:pl-0 last:md:pr-0"
                style={{
                  opacity: isActive ? 1 : 0.35,
                  borderLeft: idx > 0 ? '1px solid var(--border-light)' : 'none',
                }}
                onClick={() => setActiveStep(idx)}
              >
                {/* Progress line */}
                <div
                  className="mb-8"
                  style={{ height: 2, background: isActive ? 'var(--primary-accent)' : 'var(--border-light)', transition: 'background 500ms' }}
                />

                {/* Step number */}
                <span
                  className="font-mono text-[10px] uppercase block mb-2"
                  style={{ letterSpacing: '0.3em', color: 'var(--muted-text)' }}
                >
                  {step.number}
                </span>
                <h3
                  className="font-mono text-sm uppercase font-bold mb-4"
                  style={{ letterSpacing: '0.2em', color: 'var(--foreground)' }}
                >
                  {step.title}
                </h3>

                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 300,
                    color: 'var(--muted-text)',
                    maxWidth: 280,
                  }}
                >
                  {step.description}
                </p>

                {/* Detail label */}
                <span
                  className="font-mono text-[8px] uppercase"
                  style={{
                    letterSpacing: '0.3em',
                    color: 'var(--primary-accent)',
                  }}
                >
                  {step.detail}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
