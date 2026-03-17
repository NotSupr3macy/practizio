'use client'

import { useState, useEffect } from 'react'
import { X, CalendarCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConnectionSkipBannerProps {
  onConnectNow: () => void
}

export function ConnectionSkipBanner({ onConnectNow }: ConnectionSkipBannerProps) {
  const [dismissed, setDismissed] = useState(true) // start hidden to avoid flash

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem('booking_banner_dismissed') === 'true'
    setDismissed(wasDismissed)
  }, [])

  function handleDismiss() {
    sessionStorage.setItem('booking_banner_dismissed', 'true')
    setDismissed(true)
  }

  function handleConnect() {
    sessionStorage.removeItem('booking_connection_skipped')
    sessionStorage.removeItem('booking_banner_dismissed')
    onConnectNow()
  }

  if (dismissed) return null

  return (
    <div className="flex items-center gap-3 mx-4 mt-4 lg:mx-0 lg:mt-0 lg:mb-6 px-4 py-3" style={{ background: 'var(--beige)', border: '1px solid var(--border-light)', borderRadius: '2px' }}>
      <CalendarCheck className="w-4 h-4 shrink-0" style={{ color: 'var(--charcoal)' }} />
      <p className="font-mono flex-1" style={{ fontSize: '12px', color: 'var(--charcoal)' }}>
        Connect your booking system to start receiving AI appointments
      </p>
      <Button variant="solid" size="sm" onClick={handleConnect} className="btn-primary shrink-0">
        CONNECT NOW
      </Button>
      <button
        onClick={handleDismiss}
        className="shrink-0 transition-opacity hover:opacity-70"
        style={{ color: 'var(--charcoal)' }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
