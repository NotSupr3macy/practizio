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
      className="section-light bg-editorial-grid py-24 px-6 md:px-10"
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

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const isActive = idx === activeStep
            return (
              <div
                key={step.number}
                className="cursor-pointer transition-all duration-500"
                style={{ opacity: isActive ? 1 : 0.4 }}
                onClick={() => setActiveStep(idx)}
              >
                {/* Scanline progress bar on active */}
                <div
                  className="mb-6"
                  style={{ height: 2, background: 'var(--border-light)', position: 'relative', overflow: 'hidden' }}
                >
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--primary-accent)',
                        animation: 'slide 2s infinite',
                      }}
                    />
                  )}
                </div>

                {/* Card */}
                <div
                  className="p-8 md:p-10 min-h-[280px] flex flex-col justify-between"
                  style={{
                    background: 'var(--white)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '2px',
                  }}
                >
                  {/* Step number */}
                  <div>
                    <span
                      className="font-mono text-[10px] uppercase block mb-2"
                      style={{ letterSpacing: '0.3em', color: 'var(--muted-text)' }}
                    >
                      {step.number}
                    </span>
                    <h3
                      className="font-mono text-sm uppercase font-bold"
                      style={{ letterSpacing: '0.2em', color: 'var(--foreground)' }}
                    >
                      {step.title}
                    </h3>
                  </div>

                  <p
                    className="text-sm leading-relaxed mt-4"
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 300,
                      color: 'var(--muted-text)',
                      maxWidth: 280,
                    }}
                  >
                    {step.description}
                  </p>

                  {/* Detail badge */}
                  <div className="mt-6">
                    <span
                      className="font-mono text-[8px] uppercase inline-block px-3 py-1.5"
                      style={{
                        letterSpacing: '0.3em',
                        color: 'var(--primary-accent)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '2px',
                      }}
                    >
                      {step.detail}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
