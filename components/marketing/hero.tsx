import Link from 'next/link'

export function Hero() {
  return (
    <section className="pt-[72px] relative overflow-hidden min-h-screen flex flex-col">
      {/* Dramatic background */}
      <div className="absolute inset-0 z-0">
        {/* Large morphing blob */}
        <div className="absolute top-[15%] left-[5%] w-[600px] h-[600px] morph-shape opacity-[0.06] animate-float" style={{ background: 'radial-gradient(circle, rgba(40,105,169,0.4), transparent 60%)' }} />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] blob-shape opacity-[0.04]" style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.5), transparent 60%)' }} />
        <div className="absolute top-[40%] right-[15%] w-[400px] h-[400px] blob-shape-2 opacity-[0.03] animate-float-delayed" style={{ background: 'radial-gradient(circle, rgba(255,45,135,0.4), transparent 60%)' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 px-6 py-20">
        {/* Pre-title */}
        <div className="glass-panel px-5 py-2 rounded-full mb-10 animate-fade-in">
          <span className="mono-label-sm text-accent/70">THE FUTURE OF BUSINESS DISCOVERY</span>
        </div>

        {/* Giant chrome title */}
        <h1 className="text-center animate-slide-up">
          <span className="block font-display font-extrabold uppercase text-chrome-3d" style={{ fontSize: 'clamp(3rem, 12vw, 10rem)', lineHeight: 0.9, letterSpacing: '-0.04em' }}>
            AI FIRST
          </span>
          <span className="block font-display font-extrabold uppercase text-chrome mt-2" style={{ fontSize: 'clamp(3rem, 12vw, 10rem)', lineHeight: 0.9, letterSpacing: '-0.04em' }}>
            BUSINESS
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-center font-sans text-base md:text-lg font-light text-white/40 mt-8 max-w-xl leading-relaxed animate-fade-in">
          Make your business discoverable and actionable by every AI assistant. Appointments, orders, products — all bookable through AI.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 animate-fade-in">
          <Link href="/get-setup" className="btn-solid">
            GET SET UP FREE
          </Link>
          <Link href="/signup" className="btn-pill">
            SET IT UP YOURSELF
          </Link>
        </div>

        {/* Floating metallic orbs decoration */}
        <div className="hidden md:block absolute left-[8%] top-[30%] w-16 h-16 rounded-full animate-float" style={{ background: 'linear-gradient(135deg, #222, #666, #aaa, #666, #222)', boxShadow: '0 0 40px rgba(255,255,255,0.05)' }} />
        <div className="hidden md:block absolute right-[10%] bottom-[25%] w-10 h-10 rounded-full animate-float-delayed" style={{ background: 'linear-gradient(135deg, #333, #777, #bbb, #777, #333)', boxShadow: '0 0 30px rgba(40,105,169,0.05)' }} />
        <div className="hidden md:block absolute right-[30%] top-[20%] w-6 h-6 rounded-full animate-float" style={{ background: 'linear-gradient(135deg, #444, #888, #ccc, #888, #444)' }} />
      </div>

      {/* Acid green marquee strip */}
      <div className="relative z-10 bg-accent py-3 overflow-hidden">
        <div className="marquee-track">
          <div className="marquee-content">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="flex items-center gap-8 mx-8">
                <span className="font-display font-extrabold uppercase text-black text-sm md:text-base" style={{ letterSpacing: '-0.02em' }}>APPOINTMENTS</span>
                <span className="font-display font-extrabold uppercase text-black/40 text-sm md:text-base" style={{ letterSpacing: '-0.02em' }}>ORDERS</span>
                <span className="font-display font-extrabold uppercase text-black text-sm md:text-base" style={{ letterSpacing: '-0.02em' }}>AI POWERED</span>
                <span className="font-display font-extrabold uppercase text-black/40 text-sm md:text-base" style={{ letterSpacing: '-0.02em' }}>AI AGENT READY</span>
              </span>
            ))}
          </div>
          <div className="marquee-content" aria-hidden>
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="flex items-center gap-8 mx-8">
                <span className="font-display font-extrabold uppercase text-black text-sm md:text-base" style={{ letterSpacing: '-0.02em' }}>APPOINTMENTS</span>
                <span className="font-display font-extrabold uppercase text-black/40 text-sm md:text-base" style={{ letterSpacing: '-0.02em' }}>ORDERS</span>
                <span className="font-display font-extrabold uppercase text-black text-sm md:text-base" style={{ letterSpacing: '-0.02em' }}>AI POWERED</span>
                <span className="font-display font-extrabold uppercase text-black/40 text-sm md:text-base" style={{ letterSpacing: '-0.02em' }}>AI AGENT READY</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
