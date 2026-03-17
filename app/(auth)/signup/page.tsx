'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { business_name: businessName },
          emailRedirectTo: `${window.location.origin}/callback`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      if (data.user && !data.session && data.user.identities?.length === 0) {
        router.push('/login?existing=true')
        return
      }

      if (data.session) {
        router.push('/onboarding')
      } else {
        setCheckEmail(true)
        setLoading(false)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (checkEmail) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto flex items-center justify-center" style={{ border: '1px solid var(--border-light)', borderRadius: '2px' }}>
          <span className="font-serif" style={{ fontWeight: 300, fontSize: '1.5rem', color: 'var(--primary-accent)' }}>+</span>
        </div>
        <h2 className="font-serif uppercase" style={{ fontWeight: 300, fontSize: '1.5rem', color: 'var(--foreground)', letterSpacing: '0.05em' }}>CHECK YOUR EMAIL</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted-text)' }}>Confirmation link sent to <span style={{ color: 'var(--primary-accent)' }}>{email}</span></p>
        <button onClick={() => setCheckEmail(false)} className="font-mono hover:opacity-70 transition-opacity duration-300" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--primary-accent)' }}>try again</button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-serif uppercase" style={{ fontWeight: 300, fontSize: '1.25rem', color: 'var(--foreground)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>CREATE ACCOUNT</h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--muted-text)', marginBottom: '2rem' }}>Any appointment-based business. Hair salons, dentists, yoga studios, mechanics, and more.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="business-name" className="font-mono block" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-text)', marginBottom: '0.5rem' }}>BUSINESS NAME</label>
          <input id="business-name" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required placeholder="e.g. Joe's Barbershop, Zen Yoga Studio" className="w-full font-mono bg-transparent pb-3 focus:outline-none transition-colors duration-300" style={{ borderBottom: '1px solid var(--border-light)', fontSize: '13px', color: 'var(--foreground)' }} />
        </div>

        <div>
          <label htmlFor="email" className="font-mono block" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-text)', marginBottom: '0.5rem' }}>EMAIL</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@business.com" className="w-full font-mono bg-transparent pb-3 focus:outline-none transition-colors duration-300" style={{ borderBottom: '1px solid var(--border-light)', fontSize: '13px', color: 'var(--foreground)' }} />
        </div>

        <div>
          <label htmlFor="password" className="font-mono block" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-text)', marginBottom: '0.5rem' }}>PASSWORD</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" minLength={6} placeholder="••••••••" className="w-full font-mono bg-transparent pb-3 focus:outline-none transition-colors duration-300" style={{ borderBottom: '1px solid var(--border-light)', fontSize: '13px', color: 'var(--foreground)' }} />
        </div>

        {error && (
          <div style={{ background: 'var(--white)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '2px', padding: '0.75rem 1rem' }}>
            <p className="font-mono" style={{ fontSize: '13px', color: '#dc2626' }}>{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed">
          {loading ? 'INITIALIZING...' : 'GET STARTED'}
        </button>
      </form>

      <p className="mt-8 text-center">
        <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-text)' }}>EXISTING ACCOUNT?</span>{' '}
        <Link href="/login" className="font-mono hover:opacity-70 transition-opacity duration-300" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--primary-accent)' }}>SIGN IN</Link>
      </p>
    </div>
  )
}
