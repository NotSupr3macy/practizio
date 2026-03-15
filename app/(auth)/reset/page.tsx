'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Processing your link...')

  useEffect(() => {
    const hash = window.location.hash.substring(1) // remove #
    if (!hash || !hash.includes('type=recovery')) {
      setStatus('Invalid or expired link. Please request a new one.')
      return
    }

    // Parse the hash params manually
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (!accessToken || !refreshToken) {
      setStatus('Invalid link. Missing tokens.')
      return
    }

    const supabase = createClient()

    // Manually set the session using the tokens from the hash
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    }).then(({ data, error }) => {
      if (error) {
        console.error('Set session error:', error)
        setStatus('Link expired. Please request a new password reset.')
        return
      }
      if (data.session) {
        // Session set successfully, redirect to set password
        window.location.href = '/set-password'
      } else {
        setStatus('Link expired. Please request a new password reset.')
      }
    })
  }, [router])

  return (
    <div className="text-center">
      <h2 className="font-display font-extrabold uppercase tracking-tightest text-2xl text-chrome mb-4">
        SETTING UP
      </h2>
      <p className="text-white/40 text-sm">{status}</p>
    </div>
  )
}
