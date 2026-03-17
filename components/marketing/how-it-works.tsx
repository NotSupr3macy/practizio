'use client'

const steps = [
  {
    number: '01',
    title: 'Configure',
    description: 'Enter your business details, services, availability, and product catalog.',
    detail: 'SETUP TIME: <10 MIN',
  },
  {
    number: '02',
    title: 'Publish',
    description: 'We create your AI booking link and list your business in the AI directory.',
    detail: 'LIVE IN MINUTES',
  },
  {
    number: '03',
    title: 'Discover',
    description: 'AI assistants worldwide can now find your business, book appointments, place orders, and more.',
    detail: 'GLOBAL AI REACH',
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-32 px-6 md:px-10"
      style={{ background: 'var(--cream)', borderTop: '1px solid var(--border-light)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <span
          className="font-mono text-[10px] uppercase block mb-6"
          style={{ letterSpacing: '0.3em', color: 'var(--taupe)' }}
        >
          HOW IT WORKS
        </span>

        {/* Large headline spanning full width */}
        <h2
          className="editorial-heading mb-24"
          style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: 'var(--foreground)', lineHeight: 1.05 }}
        >
          Three steps. <br />
          <span style={{ fontStyle: 'italic', color: 'var(--taupe)' }}>
            Ten minutes.
          </span>
        </h2>

        {/* Steps as stacked rows */}
        {steps.map((step, idx) => (
          <div
            key={step.number}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-0 items-baseline"
            style={{
              borderTop: '1px solid var(--border-light)',
              paddingTop: '2.5rem',
              paddingBottom: '2.5rem',
            }}
          >
            {/* Large step number */}
            <div className="md:col-span-2">
              <span
                className="font-display"
                style={{
                  fontSize: 'clamp(48px, 6vw, 80px)',
                  lineHeight: 1,
                  color: 'var(--border-light)',
                }}
              >
                {step.number}
              </span>
            </div>

            {/* Step title — large mixed case */}
            <div className="md:col-span-4">
              <h3
                className="font-display uppercase"
                style={{
                  fontSize: 'clamp(24px, 3vw, 36px)',
                  lineHeight: 1.1,
                  color: 'var(--foreground)',
                }}
              >
                {step.title}
              </h3>
            </div>

            {/* Description + detail */}
            <div className="md:col-span-5 md:col-start-7">
              <p
                className="leading-relaxed mb-4"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 300,
                  fontSize: '16px',
                  color: 'var(--muted-text)',
                  lineHeight: 1.7,
                }}
              >
                {step.description}
              </p>
              <span
                className="font-mono text-[9px] uppercase"
                style={{
                  letterSpacing: '0.25em',
                  color: 'var(--primary-accent)',
                }}
              >
                {step.detail}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
