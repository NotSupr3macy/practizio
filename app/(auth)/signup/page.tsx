'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const PRACTICE_TYPES = [
  { value: 'dental', label: 'Dental' },
  { value: 'medical', label: 'Medical' },
  { value: 'legal', label: 'Legal' },
  { value: 'financial', label: 'Financial' },
  { value: 'other', label: 'Other' },
] as const

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [practiceType, setPracticeType] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          practice_type: practiceType,
        },
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // If session exists, email confirmation is disabled — go straight to onboarding
    if (data.session) {
      router.push('/onboarding')
    } else {
      // Email confirmation is enabled — show message
      setCheckEmail(true)
      setLoading(false)
    }
  }

  if (checkEmail) {
    return (
      <div className="text-center space-y-6">
        <div className="font-display text-6xl opacity-20 select-none">+</div>
        <h2 className="font-display font-black uppercase text-2xl tracking-tightest text-foreground">
          CHECK_YOUR_EMAIL
        </h2>
        <p className="font-sans text-sm opacity-60">
          Confirmation link sent to{' '}
          <span className="text-accent">{email}</span>
        </p>
        <button
          onClick={() => setCheckEmail(false)}
          className="mono-label-sm text-accent hover:text-accent-hover transition-colors duration-300"
        >
          try again
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-display font-black uppercase text-2xl tracking-tightest text-foreground mb-8">
        CREATE_ACCOUNT
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="mono-label opacity-60 mb-2 block"
          >
            EMAIL
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@practice.com"
            className="w-full bg-transparent hairline-b border-0 pb-3 font-mono text-sm text-white placeholder:opacity-30 focus:outline-none transition-colors duration-300"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mono-label opacity-60 mb-2 block"
          >
            PASSWORD
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={6}
            placeholder="••••••••"
            className="w-full bg-transparent hairline-b border-0 pb-3 font-mono text-sm text-white placeholder:opacity-30 focus:outline-none transition-colors duration-300"
          />
        </div>

        <div>
          <label
            htmlFor="practice-type"
            className="mono-label opacity-60 mb-2 block"
          >
            PRACTICE_TYPE
          </label>
          <select
            id="practice-type"
            value={practiceType}
            onChange={(e) => setPracticeType(e.target.value)}
            required
            className="w-full bg-transparent hairline-b border-0 pb-3 font-mono text-sm text-white appearance-none focus:outline-none transition-colors duration-300"
          >
            <option value="" disabled className="bg-background text-white/30">
              Select your practice type
            </option>
            {PRACTICE_TYPES.map((type) => (
              <option key={type.value} value={type.value} className="bg-background text-white">
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="hairline px-4 py-3">
            <p className="text-destructive font-mono text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-solid disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? 'INITIALIZING...' : 'INITIALIZE'}
        </button>
      </form>

      <p className="mt-8 text-center">
        <span className="mono-label-sm opacity-40">EXISTING_ACCOUNT?</span>
        {' '}
        <Link
          href="/login"
          className="text-accent hover:text-accent-hover mono-label-sm transition-colors duration-300"
        >
          SIGN_IN
        </Link>
      </p>
    </div>
  )
}
