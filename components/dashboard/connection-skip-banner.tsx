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
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 flex items-center gap-3 mx-4 mt-4 lg:mx-0 lg:mt-0 lg:mb-6">
      <CalendarCheck className="w-4 h-4 text-amber-400 shrink-0" />
      <p className="font-mono text-xs text-amber-200/80 flex-1">
        Connect your booking system to start receiving AI appointments
      </p>
      <Button variant="solid" size="sm" onClick={handleConnect} className="shrink-0">
        CONNECT NOW
      </Button>
      <button
        onClick={handleDismiss}
        className="text-amber-200/40 hover:text-amber-200/80 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
