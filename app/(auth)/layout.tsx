import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="glow-orb glow-orb-green w-[500px] h-[500px] top-[-15%] left-[10%] opacity-15" />
      <div className="glow-orb glow-orb-cyan w-[400px] h-[400px] bottom-[-15%] right-[5%] opacity-10" />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      <div className="w-full max-w-md mx-auto relative z-10">
        {/* Brand */}
        <div className="text-center mb-10">
          <img src="/logo.png" alt="SpadeChat" className="w-28 h-28 object-contain mx-auto mb-5" />
          <h1 className="font-display font-extrabold uppercase tracking-tightest text-3xl text-chrome-3d">
            SPADECHAT
          </h1>
          <p className="mono-label-sm text-white/20 mt-3">
            AI ACCESSIBLE BOOKING PLATFORM
          </p>
        </div>

        {/* Card container */}
        <div className="w-full p-10 card-chrome rounded-2xl">
          {children}
        </div>

        {/* Home link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="mono-label-sm text-white/20 hover:text-accent transition-colors duration-300"
          >
            HOME
          </Link>
        </div>
      </div>
    </div>
  )
}
