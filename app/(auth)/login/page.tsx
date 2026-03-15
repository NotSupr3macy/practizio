'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isExisting = searchParams.get('existing') === 'true'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Check for recovery token in URL hash (from Supabase implicit flow)
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('type=recovery')) {
      // Let Supabase client process the hash tokens first, then redirect
      const supabase = createClient()
      // Give Supabase a moment to process the hash and set the session
      const checkSession = async () => {
        // Supabase auto-detects hash on init, just wait a tick
        await new Promise(resolve => setTimeout(resolve, 500))
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          window.location.href = '/set-password'
        }
      }
      checkSession()
      return
    }
    // No recovery token — sign out any existing session so user goes through login form
    const supabase = createClient()
    supabase.auth.signOut()
  }, [router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    // Server-side redirect handles admin vs dashboard vs onboarding
    window.location.href = '/api/auth/redirect'
  }

  return (
    <div>
      <h2 className="font-display font-extrabold uppercase text-2xl tracking-tightest text-chrome mb-2">
        SIGN IN
      </h2>

      {isExisting && (
        <div className="glass-panel rounded-lg px-4 py-3 mb-6">
          <p className="font-mono text-sm text-accent">
            An account with that email already exists. Sign in below.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        <div>
          <label htmlFor="email" className="mono-label text-white/30 mb-2 block">EMAIL</label>
          <input
            id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            required autoComplete="email" placeholder="you@business.com"
            className="w-full bg-transparent pb-3 font-mono text-sm text-white placeholder:text-white/15 focus:outline-none transition-colors duration-300"
            style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
          />
        </div>

        <div>
          <label htmlFor="password" className="mono-label text-white/30 mb-2 block">PASSWORD</label>
          <input
            id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            required autoComplete="current-password" placeholder="••••••••"
            className="w-full bg-transparent pb-3 font-mono text-sm text-white placeholder:text-white/15 focus:outline-none transition-colors duration-300"
            style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
          />
        </div>

        {error && (
          <div className="glass-panel rounded-lg px-4 py-3" style={{ borderColor: 'rgba(255, 51, 102, 0.2)' }}>
            <p className="text-destructive font-mono text-sm">{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full btn-solid disabled:opacity-30 disabled:cursor-not-allowed">
          {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
        </button>
      </form>

      <p className="mt-8 text-center">
        <span className="mono-label-sm text-white/20">NO ACCOUNT?</span>{' '}
        <Link href="/signup" className="text-accent hover:text-accent-hover mono-label-sm transition-colors duration-300">CREATE ONE</Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
