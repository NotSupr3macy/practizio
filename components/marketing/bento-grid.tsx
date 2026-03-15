const cards = [
  {
    tag: 'SYSTEM 01',
    title: 'AI BOOKING LINK',
    sub: 'Every business gets a live AI connection accessible by any AI assistant in real-time',
    gradient: 'from-[#2869A9]/20 to-transparent',
    orbColor: 'rgba(40, 105, 169, 0.3)',
  },
  {
    tag: 'SYSTEM 02',
    title: 'AI DISCOVERY',
    sub: 'Automatically listed in the AI business directory, found by Claude, ChatGPT, Gemini',
    gradient: 'from-[#00F0FF]/20 to-transparent',
    orbColor: 'rgba(0, 240, 255, 0.3)',
  },
  {
    tag: 'SYSTEM 03',
    title: 'INSTANT ACTION',
    sub: 'AI agents book appointments, place orders, and interact with your business without human intervention',
    gradient: 'from-[#FF2D87]/20 to-transparent',
    orbColor: 'rgba(255, 45, 135, 0.3)',
  },
] as const

export function BentoGrid() {
  return (
    <section className="w-full py-20 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.tag}
              className="group relative card-metal rounded-2xl p-8 md:p-10 min-h-[380px] flex flex-col justify-between card-interactive overflow-hidden"
            >
              {/* Blob glow on hover */}
              <div
                className="absolute -bottom-20 -right-20 w-[200px] h-[200px] rounded-full blur-[80px] opacity-0 group-hover:opacity-60 transition-opacity duration-700"
                style={{ background: card.orbColor }}
              />

              {/* Metallic accent line at top */}
              <div className="absolute top-0 left-8 right-8 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${card.orbColor}, transparent)` }} />

              {/* Tag */}
              <div className="relative z-10">
                <span className="mono-label-sm text-white/20">{card.tag}</span>
              </div>

              {/* Center: Floating metallic sphere */}
              <div className="flex items-center justify-center flex-1 relative z-10 py-8">
                <div
                  className="w-20 h-20 rounded-full opacity-30 group-hover:opacity-70 transition-all duration-700 animate-float group-hover:scale-110"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.6), rgba(255,255,255,0.1) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.6))`,
                    boxShadow: `0 0 40px ${card.orbColor}`,
                  }}
                />
              </div>

              {/* Bottom: Title and description */}
              <div className="relative z-10">
                <h3 className="font-display font-extrabold uppercase text-xl tracking-tightest text-white group-hover:text-chrome transition-all duration-500">
                  {card.title}
                </h3>
                <p className="font-sans text-sm font-light text-white/30 mt-3 leading-relaxed">
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
