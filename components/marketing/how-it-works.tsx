const steps = [
  {
    number: '01',
    title: 'CONFIGURE',
    description: 'Enter your practice details, services, providers, and weekly availability schedule.',
    detail: 'SETUP_TIME: <10_MIN',
  },
  {
    number: '02',
    title: 'PUBLISH',
    description: 'We generate your unique MCP endpoint and list your practice in the AI directory.',
    detail: 'ENDPOINT: /API/MCP/{SLUG}',
  },
  {
    number: '03',
    title: 'DISCOVER',
    description: 'AI agents worldwide can now query your practice, check availability, and book appointments.',
    detail: 'PROTOCOL: MCP_V1.0',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="hairline-t">
      {/* Section header */}
      <div className="px-6 md:px-12 py-16 hairline-b">
        <span className="mono-label-sm opacity-40 block mb-4">PROCESS_OVERVIEW</span>
        <h2 className="font-display font-black uppercase text-4xl md:text-6xl tracking-tightest">
          HOW IT
          <br />
          WORKS
        </h2>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className={`relative p-8 md:p-12 min-h-[350px] flex flex-col justify-between group card-interactive ${
              i < steps.length - 1 ? 'hairline-r hairline-b md:border-b-0' : ''
            }`}
          >
            {/* Step number - large background element */}
            <span className="absolute top-6 right-8 font-display font-black text-[120px] leading-none opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
              {step.number}
            </span>

            <div>
              <span className="mono-label-sm opacity-40">{`STEP_${step.number}`}</span>
              <h3 className="font-display font-black uppercase text-3xl tracking-tightest mt-4">
                {step.title}
              </h3>
              <p className="font-sans text-sm font-light leading-relaxed opacity-50 mt-4 max-w-[300px]">
                {step.description}
              </p>
            </div>

            <div className="mt-8">
              <span className="mono-label-sm text-accent">{step.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
