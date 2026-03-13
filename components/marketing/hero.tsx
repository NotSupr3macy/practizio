export function Hero() {
  const heroTextStyle = {
    fontSize: 'clamp(5rem, 18vw, 24vw)',
    lineHeight: 0.85,
    letterSpacing: '-0.06em',
  }

  return (
    <section className="pt-[72px]">
      {/* The Grid */}
      <div
        className="grid grid-cols-2 grid-rows-2"
        style={{ height: 'calc(100vh - 72px)' }}
      >
        {/* Cell 1 — Top Left: "AI" */}
        <div className="flex items-end justify-start p-4 md:p-6 overflow-hidden">
          <span
            className="font-display font-black uppercase text-white"
            style={heroTextStyle}
          >
            AI
          </span>
        </div>

        {/* Cell 2 — Top Right: "FIRST" */}
        <div className="flex items-start justify-start p-4 md:p-6 overflow-hidden hairline-l">
          <span
            className="font-display font-black uppercase text-white"
            style={heroTextStyle}
          >
            FIRST
          </span>
        </div>

        {/* Cell 3 — Bottom Left: "PRAC" */}
        <div className="flex items-end justify-end p-4 md:p-6 overflow-hidden hairline-t">
          <span
            className="font-display font-black uppercase text-white"
            style={heroTextStyle}
          >
            PRAC
          </span>
        </div>

        {/* Cell 4 — Bottom Right: "TICE" */}
        <div className="flex items-start justify-end p-4 md:p-6 overflow-hidden hairline-l hairline-t">
          <span
            className="font-display font-black uppercase text-white"
            style={heroTextStyle}
          >
            TICE
          </span>
        </div>
      </div>

      {/* Tagline bar */}
      <div className="py-4 text-center hairline-t">
        <span className="mono-label opacity-60">
          DISCOVERABLE_BY_EVERY_AI_AGENT
        </span>
      </div>
    </section>
  )
}
