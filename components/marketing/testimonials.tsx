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
  return (
    <section className="py-24 px-6 md:px-10 relative overflow-hidden">
      <div className="glow-orb glow-orb-pink w-[400px] h-[400px] top-[5%] right-[5%] opacity-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16">
          <span className="mono-label-sm text-white/20 mb-4 block">CLIENT FEEDBACK</span>
          <h2 className="font-display font-extrabold uppercase text-5xl md:text-7xl tracking-tightest text-chrome-3d">
            WHAT THEY
            <br />
            SAY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="card-metal rounded-2xl p-8 md:p-10 flex flex-col card-interactive relative overflow-hidden"
            >
              {/* Quote mark */}
              <span className="font-display text-7xl text-white/[0.04] leading-none select-none">
                &ldquo;
              </span>

              <p className="font-sans text-base font-light leading-relaxed text-white/50 mt-2 flex-1">
                {t.quote}
              </p>

              <div className="mt-8 pt-6 relative">
                <div className="divider-chrome absolute top-0 left-0 right-0" />
                <span className="font-mono text-sm font-medium uppercase tracking-wide block text-chrome">
                  {t.name}
                </span>
                <span className="mono-label-sm text-white/20 mt-1 block">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
