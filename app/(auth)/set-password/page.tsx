'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function SetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div>
      <h2 className="font-display font-extrabold uppercase tracking-tightest text-2xl text-chrome mb-2">
        SET YOUR PASSWORD
      </h2>
      <p className="text-white/30 text-sm mb-8">
        Choose a password to access your dashboard
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label className="mono-label-sm text-white/30 mb-2 block">
            NEW PASSWORD
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-white/[0.03] border-b border-white/10 px-0 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent transition-colors"
            placeholder="Min. 6 characters"
          />
        </div>

        <div>
          <label className="mono-label-sm text-white/30 mb-2 block">
            CONFIRM PASSWORD
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full bg-white/[0.03] border-b border-white/10 px-0 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent transition-colors"
            placeholder="Re-enter password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-solid py-4 font-mono text-sm font-semibold uppercase tracking-widest disabled:opacity-50"
        >
          {loading ? 'SETTING PASSWORD...' : 'SET PASSWORD & CONTINUE'}
        </button>
      </form>
    </div>
  )
}
