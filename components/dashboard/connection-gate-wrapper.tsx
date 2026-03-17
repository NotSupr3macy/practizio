'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookingConnectionGate } from '@/components/dashboard/booking-connection-gate'
import { ConnectionSkipBanner } from '@/components/dashboard/connection-skip-banner'
import { Sidebar } from '@/components/dashboard/sidebar'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PracticeData = any

interface ConnectionGateWrapperProps {
  practice: PracticeData
  userEmail: string
  children: React.ReactNode
}

type ViewState = 'loading' | 'gate' | 'dashboard'

export function ConnectionGateWrapper({ practice, userEmail, children }: ConnectionGateWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [viewState, setViewState] = useState<ViewState>('loading')

  // Check if just connected via Google OAuth or if user previously skipped
  useEffect(() => {
    const justConnected = searchParams.get('booking_connected') === 'true'
    const wasSkipped = sessionStorage.getItem('booking_connection_skipped') === 'true'

    if (justConnected) {
      // Show success then transition — the gate component will handle this
      // But since booking_system_connected should now be true from the OAuth callback,
      // the server layout should render normal dashboard on next refresh.
      // For now, show the gate in success mode.
      setViewState('gate')
    } else if (wasSkipped) {
      setViewState('dashboard')
    } else {
      setViewState('gate')
    }
  }, [searchParams])

  function handleSkip() {
    setViewState('dashboard')
  }

  function handleConnected() {
    router.refresh()
  }

  function handleShowGate() {
    setViewState('gate')
  }

  // Loading state (brief, prevents hydration mismatch)
  if (viewState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
        <div className="w-6 h-6 rounded-full animate-spin" style={{ border: '2px solid var(--border-light)', borderTopColor: 'var(--primary-accent)' }} />
      </div>
    )
  }

  // Gate view
  if (viewState === 'gate') {
    return (
      <BookingConnectionGate
        practice={practice}
        onSkip={handleSkip}
        onConnected={handleConnected}
      />
    )
  }

  // Dashboard view with skip banner
  return (
    <DashboardShell
      logoHref="/dashboard"
      sidebar={<Sidebar practice={practice} userEmail={userEmail} />}
    >
      <ConnectionSkipBanner onConnectNow={handleShowGate} />
      {children}
    </DashboardShell>
  )
}
