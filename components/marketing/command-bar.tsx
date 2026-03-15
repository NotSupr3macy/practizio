import Link from 'next/link'

export function CommandBar() {
  return (
    <section className="py-20 px-6 md:px-10 relative overflow-hidden">
      <div className="glow-orb glow-orb-green w-[500px] h-[500px] top-[-20%] left-[30%] opacity-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* CTA Card */}
        <div className="card-chrome rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
          {/* Top metallic accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #2869A9, #00F0FF, transparent)' }} />

          <span className="mono-label-sm text-white/20 block mb-6">LAUNCH YOUR AI PRESENCE</span>

          <h2 className="font-display font-extrabold uppercase text-3xl md:text-5xl tracking-tightest text-chrome-3d mb-4">
            START FREE TODAY
          </h2>

          <p className="font-sans text-base font-light text-white/30 max-w-md mx-auto mb-10">
            We'll set up your AI booking page for free — no technical skills needed. Just tell us about your business.
          </p>

          {/* Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/get-setup" className="btn-solid">
              GET SET UP FREE — WE'LL DO IT FOR YOU
            </Link>
            <Link href="/signup" className="btn-pill">
              SET IT UP YOURSELF
            </Link>
          </div>

          {/* Bottom labels */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <span className="mono-label-sm text-white/15">FREE TIER</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span className="mono-label-sm text-white/15">ANY BUSINESS</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span className="mono-label-sm text-white/15">NO CARD REQ</span>
          </div>
        </div>
      </div>
    </section>
  )
}
