'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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

    const supabase = createClient()
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
      <h2 className="font-serif uppercase" style={{ fontWeight: 300, fontSize: '1.5rem', color: 'var(--foreground)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
        SET YOUR PASSWORD
      </h2>
      <p style={{ color: 'var(--muted-text)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Choose a password to access your dashboard
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div style={{ background: 'var(--white)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '2px', padding: '0.75rem 1rem' }}>
            <p className="font-mono" style={{ fontSize: '13px', color: '#dc2626' }}>{error}</p>
          </div>
        )}

        <div>
          <label className="font-mono block" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-text)', marginBottom: '0.5rem' }}>
            NEW PASSWORD
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full font-mono bg-transparent focus:outline-none transition-colors"
            style={{ borderBottom: '1px solid var(--border-light)', fontSize: '13px', color: 'var(--foreground)', padding: '0.75rem 0' }}
            placeholder="Min. 6 characters"
          />
        </div>

        <div>
          <label className="font-mono block" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-text)', marginBottom: '0.5rem' }}>
            CONFIRM PASSWORD
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full font-mono bg-transparent focus:outline-none transition-colors"
            style={{ borderBottom: '1px solid var(--border-light)', fontSize: '13px', color: 'var(--foreground)', padding: '0.75rem 0' }}
            placeholder="Re-enter password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50"
        >
          {loading ? 'SETTING PASSWORD...' : 'SET PASSWORD & CONTINUE'}
        </button>
      </form>
    </div>
  )
}
