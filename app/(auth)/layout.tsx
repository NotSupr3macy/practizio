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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden" style={{ background: 'var(--cream)' }}>
      {/* Editorial grid overlay */}
      <div className="bg-editorial-grid absolute inset-0" />

      <div className="w-full max-w-md mx-auto relative z-10">
        {/* Brand */}
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Practizio" className="w-28 h-28 object-contain mx-auto mb-5" />
          <h1 className="font-display" style={{ color: 'var(--navy)', fontSize: '1.875rem', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
            PRACTIZIO
          </h1>
          <p className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-text)', marginTop: '0.75rem' }}>
            AI ACCESSIBLE BOOKING PLATFORM
          </p>
        </div>

        {/* Card container */}
        <div className="w-full p-10" style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: '2px' }}>
          {children}
        </div>

        {/* Home link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-text)' }}
            className="font-mono hover:opacity-70 transition-opacity duration-300"
          >
            HOME
          </Link>
        </div>
      </div>
    </div>
  )
}
