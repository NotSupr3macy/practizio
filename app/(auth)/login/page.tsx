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
      <h2 className="font-serif uppercase" style={{ fontWeight: 300, fontSize: '1.5rem', color: 'var(--foreground)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
        SIGN IN
      </h2>

      {isExisting && (
        <div style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: '2px', padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
          <p className="font-mono" style={{ fontSize: '13px', color: 'var(--primary-accent)' }}>
            An account with that email already exists. Sign in below.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        <div>
          <label htmlFor="email" className="font-mono block" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-text)', marginBottom: '0.5rem' }}>EMAIL</label>
          <input
            id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            required autoComplete="email" placeholder="you@business.com"
            className="w-full font-mono bg-transparent pb-3 focus:outline-none transition-colors duration-300"
            style={{ borderBottom: '1px solid var(--border-light)', fontSize: '13px', color: 'var(--foreground)' }}
          />
        </div>

        <div>
          <label htmlFor="password" className="font-mono block" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-text)', marginBottom: '0.5rem' }}>PASSWORD</label>
          <input
            id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            required autoComplete="current-password" placeholder="••••••••"
            className="w-full font-mono bg-transparent pb-3 focus:outline-none transition-colors duration-300"
            style={{ borderBottom: '1px solid var(--border-light)', fontSize: '13px', color: 'var(--foreground)' }}
          />
        </div>

        {error && (
          <div style={{ background: 'var(--white)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '2px', padding: '0.75rem 1rem' }}>
            <p className="font-mono" style={{ fontSize: '13px', color: '#dc2626' }}>{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed">
          {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
        </button>
      </form>

      <p className="mt-8 text-center">
        <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-text)' }}>NO ACCOUNT?</span>{' '}
        <Link href="/signup" className="font-mono hover:opacity-70 transition-opacity duration-300" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--primary-accent)' }}>CREATE ONE</Link>
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
