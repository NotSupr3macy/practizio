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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md mx-auto">
        {/* Brand */}
        <div className="text-center mb-10">
          <h1 className="font-display font-black uppercase tracking-tightest text-foreground text-4xl">
            PRACTIZIO
          </h1>
          <p className="mono-label-sm opacity-40 mt-3">
            AI_ACCESSIBLE_PRACTICE_MANAGEMENT
          </p>
        </div>

        {/* Card container */}
        <div className="hairline w-full p-10">
          {children}
        </div>

        {/* Home link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="mono-label-sm opacity-30 hover:opacity-60 transition-opacity duration-300"
          >
            HOME
          </Link>
        </div>
      </div>
    </div>
  )
}
