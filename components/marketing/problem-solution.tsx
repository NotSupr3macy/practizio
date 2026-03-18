'use client'

const aiBrands = [
  {
    name: 'ChatGPT',
    company: 'OpenAI',
    image: '/ai-logos/chatgpt.webp',
  },
  {
    name: 'Claude',
    company: 'Anthropic',
    image: '/ai-logos/claude.png',
  },
  {
    name: 'Gemini',
    company: 'Google',
    image: '/ai-logos/gemini.png',
  },
  {
    name: 'Perplexity',
    company: 'Perplexity AI',
    image: '/ai-logos/perplexity.png',
  },
]

export function ProblemSolution() {
  return (
    <section
      id="features"
      className="section-light py-24 px-6 md:px-10"
      style={{ borderTop: '1px solid var(--border-light)' }}
    >
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span
            className="font-mono text-[10px] uppercase block mb-4"
            style={{ letterSpacing: '0.3em', color: 'var(--taupe)' }}
          >
            COMPATIBLE AI AGENTS
          </span>
          <h2
            className="editorial-heading text-3xl md:text-5xl"
            style={{ color: 'var(--foreground)' }}
          >
            Every AI{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--taupe)' }}>
              finds you.
            </span>
          </h2>
          <p
            className="mt-4 max-w-lg mx-auto"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 300,
              fontSize: '18px',
              color: 'var(--muted-text)',
              lineHeight: 1.6,
            }}
          >
            Your business becomes instantly discoverable and bookable by all major AI assistants through a single AI booking link.
          </p>
        </div>

        {/* AI brand row — no boxes, just logos and text with dividers */}
        <div className="grid grid-cols-2 md:grid-cols-4">
          {aiBrands.map((brand, idx) => (
            <div
              key={brand.name}
              className="flex flex-col items-center text-center py-8 md:py-10"
              style={{
                borderLeft: idx > 0 ? '1px solid var(--border-light)' : 'none',
              }}
            >
              {/* Logo */}
              <div className="w-14 h-14 md:w-16 md:h-16 mb-5 overflow-hidden rounded-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.image}
                  alt={`${brand.name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3
                className="font-mono text-sm uppercase font-bold"
                style={{ letterSpacing: '0.2em', color: 'var(--foreground)' }}
              >
                {brand.name}
              </h3>
              <span
                className="font-mono text-[8px] uppercase mt-1.5"
                style={{ letterSpacing: '0.3em', color: 'var(--muted-text)' }}
              >
                {brand.company.toUpperCase()}
              </span>

              <div className="flex items-center gap-2 mt-4">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
                  style={{ background: 'var(--primary-accent)' }}
                />
                <span
                  className="font-mono text-[10px] uppercase"
                  style={{ letterSpacing: '0.3em', color: 'var(--primary-accent)' }}
                >
                  AI READY
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
