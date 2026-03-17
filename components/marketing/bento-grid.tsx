const cards = [
  {
    tag: 'SYSTEM 01',
    title: 'AI BOOKING\nLINK',
    sub: 'Every business gets a live AI connection accessible by any AI assistant in real-time. One link powers every AI platform on Earth.',
  },
  {
    tag: 'SYSTEM 02',
    title: 'AI\nDISCOVERY',
    sub: 'Automatically listed in the AI business directory, found by Claude, ChatGPT, Gemini, and every agent that follows.',
  },
  {
    tag: 'SYSTEM 03',
    title: 'INSTANT\nACTION',
    sub: 'AI agents book appointments, place orders, and interact with your business without human intervention.',
  },
] as const

export function BentoGrid() {
  return (
    <section
      className="w-full"
      style={{ background: 'var(--navy)' }}
    >
      <div className="max-w-6xl mx-auto">
        {cards.map((card, idx) => (
          <div
            key={card.tag}
            className="grid grid-cols-1 md:grid-cols-2 gap-0"
            style={{
              borderBottom: idx < cards.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}
          >
            {/* Left: Visual area */}
            <div
              className={`relative px-6 md:px-10 py-16 md:py-24 flex items-center ${idx % 2 === 1 ? 'md:order-2' : ''}`}
              style={{
                borderRight: idx % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                borderLeft: idx % 2 === 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              {/* Decorative offset rectangle + accent block */}
              <div className="relative w-full aspect-[4/3] max-w-[400px] mx-auto">
                {/* Background offset shape */}
                <div
                  className="absolute -top-3 -left-3 w-2/5 h-2/5"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                />
                {/* Main visual block */}
                <div
                  className="absolute inset-0 flex items-center justify-center overflow-hidden"
                  style={{
                    background: 'var(--charcoal)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {/* Large number watermark */}
                  <span
                    className="font-display uppercase select-none"
                    style={{
                      fontSize: 'clamp(120px, 15vw, 200px)',
                      lineHeight: 1,
                      color: 'rgba(255,255,255,0.03)',
                    }}
                  >
                    {card.tag.slice(-2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Text content */}
            <div
              className={`px-6 md:px-10 py-16 md:py-24 flex flex-col justify-center ${idx % 2 === 1 ? 'md:order-1' : ''}`}
            >
              {/* Tag label */}
              <span
                className="font-mono text-[10px] uppercase block mb-6"
                style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}
              >
                {card.tag}
              </span>

              {/* Bold headline */}
              <h3
                className="font-display uppercase"
                style={{
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  lineHeight: 0.95,
                  color: 'var(--white)',
                  whiteSpace: 'pre-line',
                }}
              >
                {card.title}
              </h3>

              {/* Description */}
              <p
                className="mt-6 leading-relaxed"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 300,
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.35)',
                  maxWidth: 420,
                  lineHeight: 1.7,
                }}
              >
                {card.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
