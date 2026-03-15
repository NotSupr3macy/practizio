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
  return (
    <section id="how-it-works" className="py-24 px-6 md:px-10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="glow-orb glow-orb-green w-[400px] h-[400px] top-[5%] right-[-10%] opacity-20 animate-glow-pulse" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="mb-16">
          <span className="mono-label-sm text-accent/40 block mb-4">PROCESS OVERVIEW</span>
          <h2 className="font-display font-extrabold uppercase text-5xl md:text-7xl tracking-tightest text-chrome-3d">
            HOW IT
            <br />
            WORKS
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group relative card-metal rounded-2xl p-8 md:p-10 min-h-[320px] flex flex-col justify-between card-interactive overflow-hidden"
            >
              {/* Giant ghost number */}
              <span className="absolute -top-4 -right-2 font-display font-extrabold text-[160px] leading-none text-white/[0.02] group-hover:text-white/[0.05] transition-all duration-700 select-none">
                {step.number}
              </span>

              {/* Step indicator */}
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full glass-panel flex items-center justify-center">
                  <span className="font-mono text-[10px] font-bold text-accent">{step.number}</span>
                </div>
                <span className="mono-label-sm text-white/20">{`STEP ${step.number}`}</span>
              </div>

              {/* Content */}
              <div className="relative z-10 mt-8">
                <h3 className="font-display font-extrabold uppercase text-2xl tracking-tightest group-hover:text-chrome transition-all duration-500">
                  {step.title}
                </h3>
                <p className="font-sans text-sm font-light leading-relaxed text-white/30 mt-4 max-w-[280px]">
                  {step.description}
                </p>
              </div>

              {/* Detail badge */}
              <div className="relative z-10 mt-6">
                <span className="glass-panel inline-block px-3 py-1.5 rounded-full mono-label-sm text-accent/70">
                  {step.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
