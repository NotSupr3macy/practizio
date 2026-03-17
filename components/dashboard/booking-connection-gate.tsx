'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookingIntegrations } from '@/components/dashboard/booking-integrations'
import {
  CheckCircle,
  ExternalLink,
  Calendar,
  CalendarCheck,
  Loader2,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Send,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Practice {
  id: string
  name: string
  slug: string
  industry: string
  address: { city?: string; state?: string } | null
  booking_system_type: string | null
  booking_system_connected: boolean
  booking_url: string | null
  interaction_type: string
}

interface BookingConnectionGateProps {
  practice: Practice
  onSkip: () => void
  onConnected: () => void
}

type Phase = 'select' | 'url-input' | 'full-picker' | 'no-system' | 'request' | 'success'

interface QuickPlatform {
  id: string
  name: string
  emoji: string
  description: string
  type: 'oauth' | 'url'
  oauthUrl?: string
  urlPlaceholder: string
  urlPattern: RegExp
  urlError: string
  instructions: string[]
}

const QUICK_PLATFORMS: QuickPlatform[] = [
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    emoji: '🔵',
    description: 'Connect directly via Google',
    type: 'oauth',
    oauthUrl: '/api/integrations/google?from=connection-gate',
    urlPlaceholder: '',
    urlPattern: /./,
    urlError: '',
    instructions: [],
  },
  {
    id: 'calendly',
    name: 'Calendly',
    emoji: '📅',
    description: 'Paste your scheduling link',
    type: 'url',
    urlPlaceholder: 'https://calendly.com/your-name',
    urlPattern: /^https?:\/\/(www\.)?calendly\.com\/.+/i,
    urlError: 'Should look like: calendly.com/your-name',
    instructions: [
      'Log in to Calendly at calendly.com',
      'Click your profile icon → "Share Your Link"',
      'Copy your scheduling link',
      'Paste it below',
    ],
  },
  {
    id: 'acuity',
    name: 'Acuity Scheduling',
    emoji: '🗓',
    description: 'Paste your booking link',
    type: 'url',
    urlPlaceholder: 'https://acuityscheduling.com/schedule.php?owner=...',
    urlPattern: /^https?:\/\/(www\.)?(acuityscheduling\.com|squarespacescheduling\.com)\/.+/i,
    urlError: 'Should include acuityscheduling.com or squarespacescheduling.com',
    instructions: [
      'Log in to Acuity Scheduling',
      'Go to "Share Your Calendar"',
      'Copy the "Direct Scheduling Link"',
      'Paste it below',
    ],
  },
]

export function BookingConnectionGate({ practice, onSkip, onConnected }: BookingConnectionGateProps) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('select')
  const [selectedPlatform, setSelectedPlatform] = useState<QuickPlatform | null>(null)
  const [urlValue, setUrlValue] = useState('')
  const [urlError, setUrlError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [requestSystem, setRequestSystem] = useState('')
  const [requestSent, setRequestSent] = useState(false)
  const [requestSending, setRequestSending] = useState(false)
  const [skipping, setSkipping] = useState(false)

  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/directory/${practice.slug}`

  function handlePlatformClick(platform: QuickPlatform) {
    if (platform.type === 'oauth') {
      window.location.href = platform.oauthUrl!
      return
    }
    setSelectedPlatform(platform)
    setPhase('url-input')
    setUrlValue('')
    setUrlError(null)
  }

  async function handleSaveUrl() {
    if (!selectedPlatform || !urlValue.trim()) return

    if (!selectedPlatform.urlPattern.test(urlValue.trim())) {
      setUrlError(selectedPlatform.urlError)
      return
    }

    setSaving(true)
    setUrlError(null)

    try {
      const res = await fetch('/api/practices/booking-integration', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform.id,
          booking_url: urlValue.trim(),
        }),
      })

      if (!res.ok) throw new Error('Failed to save')
      setPhase('success')
    } catch {
      setUrlError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleSubmitRequest() {
    if (!requestSystem.trim()) return
    setRequestSending(true)
    try {
      await fetch('/api/integration-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_system_name: requestSystem.trim() }),
      })
      setRequestSent(true)
    } catch {
      // silent fail
    } finally {
      setRequestSending(false)
    }
  }

  async function handleSkip() {
    setSkipping(true)
    try {
      sessionStorage.setItem('booking_connection_skipped', 'true')
      await fetch('/api/practices/skip-connection', { method: 'POST' })
    } catch {
      // silent
    }
    onSkip()
  }

  function handleGoToDashboard() {
    onConnected()
    router.refresh()
  }

  // ─── Success Screen ──────────────────────────────────
  if (phase === 'success') {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center space-y-8">
          {/* Animated checkmark */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-[2px] bg-[var(--primary-accent)]/20 flex items-center justify-center animate-scale-in">
              <CheckCircle className="w-10 h-10 text-[var(--primary-accent)]" />
            </div>
          </div>

          <div>
            <h1 className="font-serif text-3xl md:text-4xl tracking-tightest" style={{ fontWeight: 300 }}>
              You&apos;re All Set!
            </h1>
            <p className="font-sans text-sm font-light text-[var(--muted-text)] mt-3 max-w-md mx-auto">
              Your business is now fully AI-bookable. When someone uses an AI assistant to search for
              a {practice.industry || 'business'} in{' '}
              {practice.address?.city || 'your area'}, they&apos;ll find you and can book directly.
            </p>
          </div>

          {/* Mock AI chat */}
          <div className="bg-white border border-[var(--border-light)] rounded-[2px] p-6 text-left space-y-4">
            <span className="mono-label-sm text-[var(--muted-text)] opacity-60">WHAT IT LOOKS LIKE</span>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-[2px] bg-[var(--cream)] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs">👤</span>
                </div>
                <div className="bg-[var(--cream)] rounded-[2px] px-4 py-3">
                  <p className="font-mono text-sm text-[var(--foreground)] opacity-70">
                    Find a {practice.industry || 'business'} near{' '}
                    {practice.address?.city || 'me'} and book an appointment
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-[2px] bg-[var(--primary-accent)]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--primary-accent)]" />
                </div>
                <div className="bg-[var(--primary-accent)]/10 rounded-[2px] px-4 py-3">
                  <p className="font-mono text-sm text-[var(--foreground)] opacity-70">
                    I found <span className="text-[var(--primary-accent)] font-medium">{practice.name}</span>! They
                    have availability this week. Want me to book it for you?
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button variant="solid" size="lg" onClick={handleGoToDashboard} className="w-full">
            GO TO YOUR DASHBOARD
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <p className="font-mono text-[10px] text-[var(--muted-text)] opacity-40 uppercase" style={{ letterSpacing: '0.15em' }}>
            Try it — ask ChatGPT or Claude to find a {practice.industry || 'business'} in{' '}
            {practice.address?.city || 'your area'}
          </p>
        </div>
      </div>
    )
  }

  // ─── Main Gate Screen ────────────────────────────────
  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <span className="font-mono font-extrabold text-xl tracking-[-0.03em] text-[var(--foreground)]">
            SPADECHAT
          </span>
        </div>

        {/* Profile live banner */}
        <div className="bg-white border border-[var(--border-light)] rounded-[2px] p-6 md:p-8 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--primary-accent), var(--sage), transparent)',
            }}
          />
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 rounded-[2px] bg-[var(--primary-accent)]/20 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-[var(--primary-accent)]" />
            </div>
            <div>
              <h1 className="font-serif text-xl md:text-2xl tracking-tightest" style={{ fontWeight: 300 }}>
                Your Profile Is Live!
              </h1>
              <p className="font-sans text-sm font-light text-[var(--muted-text)] mt-1">
                Your business is already showing up in AI searches.
              </p>
            </div>
          </div>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase text-[var(--primary-accent)] hover:text-[var(--foreground)] transition-colors mt-2"
            style={{ letterSpacing: '0.15em' }}
          >
            PREVIEW YOUR PROFILE PAGE
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Phase: Select platform */}
        {phase === 'select' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-serif text-lg tracking-tightest" style={{ fontWeight: 300 }}>
                Connect Your Booking System
              </h2>
              <p className="font-sans text-sm font-light text-[var(--muted-text)] mt-2">
                So AI assistants can book appointments for your customers.
              </p>
            </div>

            {/* Three main buttons */}
            <div className="grid gap-3">
              {QUICK_PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handlePlatformClick(platform)}
                  className="w-full text-left border border-[var(--border-light)] rounded-[2px] p-4 sm:p-5 hover:bg-white transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{platform.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary-accent)] transition-colors">
                        {platform.name}
                      </p>
                      <p className="font-sans text-xs text-[var(--muted-text)] opacity-60 mt-0.5">
                        {platform.description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--muted-text)] opacity-40 group-hover:text-[var(--primary-accent)] transition-colors shrink-0" />
                  </div>
                </button>
              ))}
            </div>

            <p className="text-center font-mono text-[10px] text-[var(--muted-text)] opacity-40" style={{ letterSpacing: '0.1em' }}>
              WE ONLY READ AVAILABILITY AND CREATE BOOKINGS. YOU CAN DISCONNECT ANYTIME.
            </p>

            {/* Expandable sections */}
            <div className="space-y-2">
              <button
                onClick={() => setPhase('full-picker')}
                className="w-full text-left font-mono text-xs text-[var(--muted-text)] hover:text-[var(--primary-accent)] transition-colors flex items-center gap-2 py-2"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                I use a different booking system
              </button>

              <button
                onClick={() => setPhase('no-system')}
                className="w-full text-left font-mono text-xs text-[var(--muted-text)] hover:text-[var(--primary-accent)] transition-colors flex items-center gap-2 py-2"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                I don&apos;t have a booking system
              </button>
            </div>

            {/* Skip */}
            <div className="text-center pt-4">
              <button
                onClick={handleSkip}
                disabled={skipping}
                className="font-mono text-[10px] text-[var(--muted-text)] opacity-30 hover:opacity-60 transition-colors uppercase"
                style={{ letterSpacing: '0.15em' }}
              >
                {skipping ? 'Loading...' : 'Skip for now and explore your dashboard →'}
              </button>
            </div>
          </div>
        )}

        {/* Phase: URL Input for Calendly/Acuity */}
        {phase === 'url-input' && selectedPlatform && (
          <div className="space-y-6">
            <button
              onClick={() => { setPhase('select'); setSelectedPlatform(null) }}
              className="font-mono text-[10px] text-[var(--muted-text)] opacity-60 hover:opacity-100 transition-colors uppercase"
              style={{ letterSpacing: '0.15em' }}
            >
              ← BACK
            </button>

            <div>
              <h2 className="font-serif text-lg tracking-tightest flex items-center gap-3" style={{ fontWeight: 300 }}>
                <span className="text-2xl">{selectedPlatform.emoji}</span>
                Connect {selectedPlatform.name}
              </h2>
            </div>

            {/* Instructions */}
            <div className="bg-white border border-[var(--border-light)] rounded-[2px] p-5 space-y-3">
              <span className="mono-label-sm text-[var(--muted-text)] opacity-60">HOW TO FIND YOUR LINK</span>
              <ol className="space-y-2">
                {selectedPlatform.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3 font-mono text-xs text-[var(--muted-text)]">
                    <span className="text-[var(--primary-accent)] font-bold shrink-0">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-3">
              <Input
                label="YOUR BOOKING LINK"
                placeholder={selectedPlatform.urlPlaceholder}
                value={urlValue}
                onChange={(e) => {
                  setUrlValue(e.target.value)
                  setUrlError(null)
                }}
                error={urlError || undefined}
              />

              <Button
                variant="solid"
                size="lg"
                className="w-full"
                onClick={handleSaveUrl}
                disabled={!urlValue.trim() || saving}
                loading={saving}
              >
                {saving ? 'CONNECTING...' : 'CONNECT'}
              </Button>
            </div>
          </div>
        )}

        {/* Phase: Full platform picker */}
        {phase === 'full-picker' && (
          <div className="space-y-6">
            <button
              onClick={() => setPhase('select')}
              className="font-mono text-[10px] text-[var(--muted-text)] opacity-60 hover:opacity-100 transition-colors uppercase"
              style={{ letterSpacing: '0.15em' }}
            >
              ← BACK
            </button>

            <BookingIntegrations
              currentPlatform={practice.booking_system_type}
              currentBookingUrl={practice.booking_url}
              practiceId={practice.id}
              onConnected={() => setPhase('success')}
            />
          </div>
        )}

        {/* Phase: No booking system */}
        {phase === 'no-system' && (
          <div className="space-y-6">
            <button
              onClick={() => setPhase('select')}
              className="font-mono text-[10px] text-[var(--muted-text)] opacity-60 hover:opacity-100 transition-colors uppercase"
              style={{ letterSpacing: '0.15em' }}
            >
              ← BACK
            </button>

            <div className="bg-white border border-[var(--border-light)] rounded-[2px] p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-[var(--primary-accent)]" />
                <h2 className="font-serif text-lg tracking-tightest" style={{ fontWeight: 300 }}>
                  No Problem!
                </h2>
              </div>
              <p className="font-sans text-sm text-[var(--muted-text)] leading-relaxed">
                We recommend <span className="text-[var(--foreground)] font-medium">Calendly</span> — it&apos;s
                free and takes about 5 minutes to set up. Once you have it, come back here and
                connect it.
              </p>
              <a
                href="https://calendly.com/signup"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="solid" size="lg" className="w-full mt-2">
                  SET UP CALENDLY (FREE)
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <button
                onClick={() => setPhase('select')}
                className="w-full text-center font-mono text-xs text-[var(--primary-accent)] hover:text-[var(--foreground)] transition-colors mt-4"
              >
                Already set it up? Connect it now →
              </button>
            </div>

            {/* Request different system */}
            <div className="border border-[var(--border-light)] rounded-[2px] p-5 space-y-3">
              <span className="mono-label-sm text-[var(--muted-text)] opacity-60">USE SOMETHING ELSE?</span>
              {requestSent ? (
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[var(--primary-accent)] mt-0.5 shrink-0" />
                  <p className="font-mono text-xs text-[var(--muted-text)]">
                    Thanks! We&apos;re adding new systems regularly. We&apos;ll email you when yours
                    is supported. In the meantime, you can set up a free Calendly account to start
                    receiving AI bookings right away.
                  </p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="What booking system do you use?"
                    value={requestSystem}
                    onChange={(e) => setRequestSystem(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleSubmitRequest}
                    disabled={!requestSystem.trim() || requestSending}
                    loading={requestSending}
                    className="shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>

            {/* Skip */}
            <div className="text-center pt-2">
              <button
                onClick={handleSkip}
                disabled={skipping}
                className="font-mono text-[10px] text-[var(--muted-text)] opacity-30 hover:opacity-60 transition-colors uppercase"
                style={{ letterSpacing: '0.15em' }}
              >
                {skipping ? 'Loading...' : 'Skip for now and explore your dashboard →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
