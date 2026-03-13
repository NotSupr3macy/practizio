'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

    router.push('/dashboard')
  }

  return (
    <div>
      <h2 className="font-display font-black uppercase text-2xl tracking-tightest text-foreground mb-8">
        SIGN_IN
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
            style={{ borderBottom: undefined }}
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
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full bg-transparent hairline-b border-0 pb-3 font-mono text-sm text-white placeholder:opacity-30 focus:outline-none transition-colors duration-300"
          />
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
          {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
        </button>
      </form>

      <p className="mt-8 text-center">
        <span className="mono-label-sm opacity-40">NO_ACCOUNT?</span>
        {' '}
        <Link
          href="/signup"
          className="text-accent hover:text-accent-hover mono-label-sm transition-colors duration-300"
        >
          CREATE_ONE
        </Link>
      </p>
    </div>
  )
}
