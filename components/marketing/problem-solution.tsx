'use client'

const aiBrands = [
  {
    name: 'ChatGPT',
    company: 'OpenAI',
    color: '#10A37F',
    image: '/ai-logos/chatgpt.webp',
  },
  {
    name: 'Claude',
    company: 'Anthropic',
    color: '#D4956A',
    image: '/ai-logos/claude.png',
  },
  {
    name: 'Gemini',
    company: 'Google',
    color: '#4285F4',
    image: '/ai-logos/gemini.png',
  },
  {
    name: 'Perplexity',
    company: 'Perplexity AI',
    color: '#20B8CD',
    image: '/ai-logos/perplexity.png',
  },
]

export function ProblemSolution() {
  return (
    <section
      id="features"
      className="section-light bg-editorial-grid py-20 px-6 md:px-10"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-14">
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
              fontSize: '16px',
              color: 'var(--muted-text)',
              lineHeight: 1.6,
            }}
          >
            Your business becomes instantly discoverable and bookable by all major AI assistants through a single AI booking link.
          </p>
        </div>

        {/* AI brand grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {aiBrands.map((brand) => (
            <div
              key={brand.name}
              className="group flex flex-col items-center text-center p-6 md:p-8 transition-all duration-500"
              style={{
                background: 'var(--white)',
                border: '1px solid var(--border-light)',
                borderRadius: '2px',
              }}
            >
              {/* Logo container */}
              <div
                className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-5 overflow-hidden"
                style={{
                  background: 'var(--cream)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '2px',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.image}
                  alt={`${brand.name} logo`}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: '2px' }}
                />
              </div>

              {/* Name */}
              <h3
                className="font-mono text-sm uppercase font-bold"
                style={{
                  letterSpacing: '0.2em',
                  color: 'var(--foreground)',
                }}
              >
                {brand.name}
              </h3>
              <span
                className="font-mono text-[8px] uppercase mt-1.5"
                style={{ letterSpacing: '0.3em', color: 'var(--muted-text)' }}
              >
                {brand.company.toUpperCase()}
              </span>

              {/* Status indicator */}
              <div className="flex items-center gap-2 mt-4">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
                  style={{ background: 'var(--primary-accent)' }}
                />
                <span
                  className="font-mono text-[8px] uppercase"
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
