const testimonials = [
  {
    quote:
      'The MCP integration changed everything. Our practice went from invisible to AI agents to fully booked in weeks.',
    name: 'DR. SARAH CHEN',
    role: 'DENTAL_PRACTICE_OWNER',
  },
  {
    quote:
      'Finally, a platform that understands where healthcare is heading. AI agents now handle 40% of our bookings.',
    name: 'JAMES RODRIGUEZ',
    role: 'MEDICAL_DIRECTOR',
  },
  {
    quote:
      'We saw a 3x increase in new patient inquiries within the first month of listing on Practizio.',
    name: 'EMILY WATSON',
    role: 'PRACTICE_MANAGER',
  },
]

export function Testimonials() {
  return (
    <section className="hairline-t py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <span className="mono-label-sm opacity-40 mb-4 block">CLIENT_FEEDBACK</span>
          <h2 className="font-display font-black uppercase text-5xl tracking-tightest">
            WHAT THEY SAY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <div
              key={t.name}
              className={`p-8 md:p-12 ${
                index < testimonials.length - 1 ? 'hairline-r' : ''
              }`}
            >
              <span className="font-display text-6xl opacity-10 leading-none block">
                &ldquo;
              </span>

              <p className="font-sans text-base font-light leading-relaxed opacity-70 mt-4">
                {t.quote}
              </p>

              <div className="mt-8">
                <span className="font-mono text-sm font-medium uppercase tracking-wide block">
                  {t.name}
                </span>
                <span className="mono-label-sm opacity-40 mt-1 block">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
