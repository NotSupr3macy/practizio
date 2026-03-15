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
        <div className="w-16 h-16 rounded-full mx-auto glass-panel flex items-center justify-center">
          <span className="text-accent font-display font-extrabold text-2xl">+</span>
        </div>
        <h2 className="font-display font-extrabold uppercase text-2xl tracking-tightest text-chrome">CHECK YOUR EMAIL</h2>
        <p className="font-sans text-sm text-white/40">Confirmation link sent to <span className="text-accent">{email}</span></p>
        <button onClick={() => setCheckEmail(false)} className="mono-label-sm text-accent hover:text-accent-hover transition-colors duration-300">try again</button>
      </div>
    )
  }

  const inputStyle = { borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }

  return (
    <div>
      <h2 className="font-display font-extrabold uppercase text-xl tracking-tightest text-chrome mb-2">CREATE ACCOUNT</h2>
      <p className="font-sans text-sm text-white/25 mb-8">Any appointment-based business. Hair salons, dentists, yoga studios, mechanics, and more.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="business-name" className="mono-label text-white/30 mb-2 block">BUSINESS NAME</label>
          <input id="business-name" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required placeholder="e.g. Joe's Barbershop, Zen Yoga Studio" className="w-full bg-transparent pb-3 font-mono text-sm text-white placeholder:text-white/15 focus:outline-none transition-colors duration-300" style={inputStyle} />
        </div>

        <div>
          <label htmlFor="email" className="mono-label text-white/30 mb-2 block">EMAIL</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@business.com" className="w-full bg-transparent pb-3 font-mono text-sm text-white placeholder:text-white/15 focus:outline-none transition-colors duration-300" style={inputStyle} />
        </div>

        <div>
          <label htmlFor="password" className="mono-label text-white/30 mb-2 block">PASSWORD</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" minLength={6} placeholder="••••••••" className="w-full bg-transparent pb-3 font-mono text-sm text-white placeholder:text-white/15 focus:outline-none transition-colors duration-300" style={inputStyle} />
        </div>

        {error && (
          <div className="glass-panel rounded-lg px-4 py-3" style={{ borderColor: 'rgba(255, 51, 102, 0.2)' }}>
            <p className="text-destructive font-mono text-sm">{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full btn-solid disabled:opacity-30 disabled:cursor-not-allowed">
          {loading ? 'INITIALIZING...' : 'GET STARTED'}
        </button>
      </form>

      <p className="mt-8 text-center">
        <span className="mono-label-sm text-white/20">EXISTING ACCOUNT?</span>{' '}
        <Link href="/login" className="text-accent hover:text-accent-hover mono-label-sm transition-colors duration-300">SIGN IN</Link>
      </p>
    </div>
  )
}
