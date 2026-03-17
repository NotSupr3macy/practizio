const cards = [
  {
    tag: 'SYSTEM 01',
    title: 'AI BOOKING LINK',
    sub: 'Every business gets a live AI connection accessible by any AI assistant in real-time',
  },
  {
    tag: 'SYSTEM 02',
    title: 'AI DISCOVERY',
    sub: 'Automatically listed in the AI business directory, found by Claude, ChatGPT, Gemini',
  },
  {
    tag: 'SYSTEM 03',
    title: 'INSTANT ACTION',
    sub: 'AI agents book appointments, place orders, and interact with your business without human intervention',
  },
] as const

export function BentoGrid() {
  return (
    <section
      className="w-full py-20 px-6 md:px-10"
      style={{ background: 'var(--navy)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.tag}
              className="group relative p-8 md:p-10 min-h-[380px] flex flex-col justify-between transition-all duration-500"
              style={{
                background: 'var(--charcoal)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '2px',
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-8 right-8"
                style={{ height: 1, background: 'rgba(255,255,255,0.06)' }}
              />

              {/* Tag */}
              <div>
                <span
                  className="font-mono text-[10px] uppercase"
                  style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.2)' }}
                >
                  {card.tag}
                </span>
              </div>

              {/* Center: Icon area */}
              <div className="flex items-center justify-center flex-1 py-8">
                <div
                  className="w-16 h-16 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                />
              </div>

              {/* Bottom: Title and description */}
              <div>
                <h3
                  className="font-display uppercase text-xl"
                  style={{ color: 'var(--white)' }}
                >
                  {card.title}
                </h3>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{
                    fontFamily: '"Space Mono", monospace',
                    color: 'rgba(255,255,255,0.3)',
                  }}
                >
                  {card.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
