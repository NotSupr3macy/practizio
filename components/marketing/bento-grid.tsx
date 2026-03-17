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
      className="w-full py-24 px-6 md:px-10 bg-editorial-grid"
      style={{ background: 'var(--cream)' }}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="mb-16">
          <span
            className="font-mono text-[10px] uppercase block mb-4"
            style={{ letterSpacing: '0.3em', color: 'var(--taupe)' }}
          >
            CORE SYSTEMS
          </span>
          <h2
            className="editorial-heading text-4xl md:text-6xl"
            style={{ color: 'var(--foreground)' }}
          >
            How it{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--taupe)' }}>
              works.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {cards.map((card, idx) => (
            <div
              key={card.tag}
              className="group relative p-8 md:p-10 min-h-[380px] flex flex-col justify-between transition-all duration-500"
              style={{
                background: 'var(--white)',
                borderTop: '2px solid var(--primary-accent)',
                borderBottom: '1px solid var(--border-light)',
                borderLeft: idx === 0 ? '1px solid var(--border-light)' : 'none',
                borderRight: '1px solid var(--border-light)',
              }}
            >
              {/* Tag */}
              <div>
                <span
                  className="font-mono text-[10px] uppercase"
                  style={{ letterSpacing: '0.3em', color: 'var(--muted-text)' }}
                >
                  {card.tag}
                </span>
              </div>

              {/* Center: Icon area */}
              <div className="flex items-center justify-center flex-1 py-8">
                <div
                  className="w-16 h-16 rounded-full"
                  style={{
                    background: 'rgba(61, 112, 104, 0.06)',
                    border: '1px solid var(--border-light)',
                  }}
                />
              </div>

              {/* Bottom: Title and description */}
              <div>
                <h3
                  className="font-mono text-sm uppercase font-bold"
                  style={{ letterSpacing: '0.2em', color: 'var(--foreground)' }}
                >
                  {card.title}
                </h3>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 300,
                    color: 'var(--muted-text)',
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
