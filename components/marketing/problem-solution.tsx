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
    <section id="features" className="py-20 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="mono-label-sm text-accent/60 block mb-4">COMPATIBLE AI AGENTS</span>
          <h2 className="font-display font-extrabold uppercase text-3xl md:text-5xl tracking-tightest text-chrome-3d">
            EVERY AI FINDS YOU
          </h2>
          <p className="font-sans text-sm md:text-base font-light text-white/35 mt-4 max-w-lg mx-auto">
            Your business becomes instantly discoverable and bookable by all major AI assistants through a single AI booking link.
          </p>
        </div>

        {/* AI brand grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {aiBrands.map((brand) => (
            <div
              key={brand.name}
              className="card-metal rounded-2xl p-6 md:p-8 flex flex-col items-center text-center group card-interactive relative overflow-hidden"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: `inset 0 0 60px ${brand.color}12, 0 0 30px ${brand.color}08` }}
              />

              {/* Logo container */}
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center relative z-10 mb-5 overflow-hidden"
                style={{
                  background: '#0D0D0D',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.image}
                  alt={`${brand.name} logo`}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              {/* Name */}
              <h3 className="font-display font-extrabold uppercase text-lg md:text-xl tracking-tightest relative z-10 group-hover:text-chrome transition-all duration-300">
                {brand.name}
              </h3>
              <span className="mono-label-sm text-white/20 mt-1.5 relative z-10">{brand.company.toUpperCase()}</span>

              {/* Status indicator */}
              <div className="flex items-center gap-2 mt-4 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
                <span className="mono-label-sm text-accent/60">AI READY</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
