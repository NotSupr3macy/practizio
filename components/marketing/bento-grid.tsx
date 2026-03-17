const cards = [
  {
    tag: '01',
    title: 'AI BOOKING LINK',
    sub: 'Every business gets a live AI connection accessible by any AI assistant in real-time',
  },
  {
    tag: '02',
    title: 'AI DISCOVERY',
    sub: 'Automatically listed in the AI business directory, found by Claude, ChatGPT, Gemini',
  },
  {
    tag: '03',
    title: 'INSTANT ACTION',
    sub: 'AI agents book appointments, place orders, and interact with your business without human intervention',
  },
] as const

export function BentoGrid() {
  return (
    <section
      className="w-full py-24 px-6 md:px-10"
      style={{ background: 'var(--cream)', borderTop: '1px solid var(--border-light)' }}
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
            Three layers of{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--taupe)' }}>
              AI access.
            </span>
          </h2>
        </div>

        {/* Horizontal divider-based layout — no boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {cards.map((card, idx) => (
            <div
              key={card.tag}
              className="py-10 md:px-8 first:md:pl-0 last:md:pr-0"
              style={{
                borderLeft: idx > 0 ? '1px solid var(--border-light)' : 'none',
              }}
            >
              {/* Tag number */}
              <span
                className="font-mono text-[10px] uppercase block mb-6"
                style={{ letterSpacing: '0.3em', color: 'var(--muted-text)' }}
              >
                {card.tag}
              </span>

              {/* Title */}
              <h3
                className="font-mono text-sm uppercase font-bold mb-4"
                style={{ letterSpacing: '0.2em', color: 'var(--foreground)' }}
              >
                {card.title}
              </h3>

              {/* Divider */}
              <div className="mb-4" style={{ height: 1, background: 'var(--border-light)', width: 40 }} />

              {/* Description */}
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 300,
                  color: 'var(--muted-text)',
                  maxWidth: 280,
                }}
              >
                {card.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
