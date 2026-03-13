const cards = [
  {
    tag: 'SYSTEM_01',
    title: 'MCP ENDPOINT',
    sub: 'Every practice gets a live API endpoint accessible by any AI agent in real-time',
    shape: 'circle' as const,
  },
  {
    tag: 'SYSTEM_02',
    title: 'AI DISCOVERY',
    sub: 'Automatically listed in the AI practice directory, found by Claude, ChatGPT, Gemini',
    shape: 'diamond' as const,
  },
  {
    tag: 'SYSTEM_03',
    title: 'INSTANT BOOKING',
    sub: 'AI agents check availability and book appointments without human intervention',
    shape: 'square' as const,
  },
] as const

function Shape({ type }: { type: 'circle' | 'diamond' | 'square' }) {
  const base = 'w-32 h-32 border border-white/20 transition-all duration-300'

  switch (type) {
    case 'circle':
      return <div className={`${base} rounded-full`} />
    case 'diamond':
      return <div className={`${base} rotate-45`} />
    case 'square':
      return <div className={base} />
  }
}

export function BentoGrid() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {cards.map((card, index) => {
          const isLast = index === cards.length - 1

          return (
            <div
              key={card.tag}
              className="group relative min-h-[400px] flex flex-col justify-between p-8 hover:bg-white/[0.02] transition-all duration-300"
            >
              {/* Mobile bottom divider (hidden on desktop) */}
              {!isLast && (
                <span
                  className="absolute bottom-0 left-0 w-full md:hidden"
                  style={{ borderBottom: '0.5px solid rgba(255, 255, 255, 0.15)' }}
                  aria-hidden="true"
                />
              )}

              {/* Desktop right divider (hidden on mobile) */}
              {!isLast && (
                <span
                  className="absolute top-0 right-0 h-full hidden md:block"
                  style={{ borderRight: '0.5px solid rgba(255, 255, 255, 0.15)' }}
                  aria-hidden="true"
                />
              )}

              {/* Top-left: Tag */}
              <div>
                <span className="mono-label-sm opacity-40">{card.tag}</span>
              </div>

              {/* Center: Geometric shape */}
              <div className="flex items-center justify-center flex-1">
                <div className="opacity-20 group-hover:opacity-100 transition-all duration-300">
                  <Shape type={card.shape} />
                </div>
              </div>

              {/* Bottom-left: Title and subtext */}
              <div>
                <h3 className="font-display font-black uppercase text-2xl tracking-tightest text-foreground">
                  {card.title}
                </h3>
                <p className="font-sans text-sm font-light opacity-40 mt-2">
                  {card.sub}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
