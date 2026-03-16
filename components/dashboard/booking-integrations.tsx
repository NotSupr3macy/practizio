'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Link as LinkIcon, Search, ChevronDown, ChevronUp } from 'lucide-react'

// ─── Platform definitions ────────────────────────────────────────────────────

interface Platform {
  id: string
  name: string
  emoji: string
  description: string
  urlPlaceholder: string
  urlLabel: string
  isDefault?: boolean
  noUrl?: boolean
}

interface PlatformCategory {
  label: string
  platforms: Platform[]
}

const PLATFORM_CATEGORIES: PlatformCategory[] = [
  {
    label: 'CALENDAR & SCHEDULING',
    platforms: [
      { id: 'calendly', name: 'Calendly', emoji: '📅', description: 'Scheduling automation', urlPlaceholder: 'https://calendly.com/your-name', urlLabel: 'Scheduling Link' },
      { id: 'acuity', name: 'Acuity / Squarespace Scheduling', emoji: '🗓', description: 'Appointment scheduling', urlPlaceholder: 'https://acuityscheduling.com/schedule.php?owner=...', urlLabel: 'Booking Link' },
      { id: 'cal_com', name: 'Cal.com', emoji: '📆', description: 'Open source scheduling', urlPlaceholder: 'https://cal.com/your-name', urlLabel: 'Booking Link' },
      { id: 'google_calendar', name: 'Google Calendar', emoji: '🔵', description: 'Google Calendar booking or embed', urlPlaceholder: 'https://calendar.google.com/calendar/appointments/...', urlLabel: 'Calendar Link' },
      { id: 'microsoft_bookings', name: 'Microsoft Bookings', emoji: '🪟', description: 'Microsoft 365 booking pages', urlPlaceholder: 'https://outlook.office365.com/owa/calendar/...', urlLabel: 'Booking Page URL' },
      { id: 'setmore', name: 'Setmore', emoji: '📋', description: 'Free appointment scheduling', urlPlaceholder: 'https://yourname.setmore.com', urlLabel: 'Booking Page URL' },
      { id: 'simplybook', name: 'SimplyBook.me', emoji: '📌', description: 'Online booking system', urlPlaceholder: 'https://yourname.simplybook.me', urlLabel: 'Booking URL' },
    ],
  },
  {
    label: 'SALON & BEAUTY',
    platforms: [
      { id: 'vagaro', name: 'Vagaro', emoji: '💇', description: 'Salon & spa booking', urlPlaceholder: 'https://www.vagaro.com/your-salon', urlLabel: 'Booking Link' },
      { id: 'fresha', name: 'Fresha', emoji: '🌿', description: 'Beauty & wellness platform', urlPlaceholder: 'https://www.fresha.com/a/...', urlLabel: 'Booking Link' },
      { id: 'booksy', name: 'Booksy', emoji: '✂️', description: 'Beauty services booking', urlPlaceholder: 'https://booksy.com/en-us/...', urlLabel: 'Booking Link' },
      { id: 'glossgenius', name: 'GlossGenius', emoji: '💅', description: 'Beauty pro booking platform', urlPlaceholder: 'https://book.glossgenius.com/...', urlLabel: 'Booking Link' },
      { id: 'boulevard', name: 'Boulevard', emoji: '💄', description: 'Salon & spa management', urlPlaceholder: 'https://booking.boulevard.app/...', urlLabel: 'Booking Link' },
    ],
  },
  {
    label: 'HEALTH & FITNESS',
    platforms: [
      { id: 'mindbody', name: 'Mindbody', emoji: '🧘', description: 'Wellness & fitness booking', urlPlaceholder: 'https://www.mindbodyonline.com/explore/locations/...', urlLabel: 'Booking Link' },
      { id: 'jane_app', name: 'Jane App', emoji: '🏥', description: 'Healthcare practice management', urlPlaceholder: 'https://yourname.janeapp.com', urlLabel: 'Booking Link' },
      { id: 'zenoti', name: 'Zenoti', emoji: '🧬', description: 'Spa & salon software', urlPlaceholder: 'https://yourname.zenoti.com/webstoreNew/services', urlLabel: 'Booking Link' },
      { id: 'wellnessliving', name: 'WellnessLiving', emoji: '🏃', description: 'Business management platform', urlPlaceholder: 'https://widget.wellnessliving.com/...', urlLabel: 'Booking Link' },
    ],
  },
  {
    label: 'RESTAURANT & FOOD',
    platforms: [
      { id: 'opentable', name: 'OpenTable', emoji: '🍽️', description: 'Restaurant reservations', urlPlaceholder: 'https://www.opentable.com/r/...', urlLabel: 'Restaurant Link' },
      { id: 'resy', name: 'Resy', emoji: '🥂', description: 'Restaurant booking platform', urlPlaceholder: 'https://resy.com/cities/.../venues/...', urlLabel: 'Booking Link' },
      { id: 'toast', name: 'Toast', emoji: '🍕', description: 'Restaurant point of sale & ordering', urlPlaceholder: 'https://www.toasttab.com/your-restaurant/...', urlLabel: 'Ordering Link' },
      { id: 'square_online', name: 'Square Online', emoji: '🛒', description: 'Online ordering & store', urlPlaceholder: 'https://squareup.com/store/...', urlLabel: 'Ordering Link' },
    ],
  },
  {
    label: 'GENERAL BUSINESS',
    platforms: [
      { id: 'square_appointments', name: 'Square Appointments', emoji: '🟦', description: 'Appointment booking with Square', urlPlaceholder: 'https://squareup.com/appointments/book/...', urlLabel: 'Booking Link' },
      { id: 'jobber', name: 'Jobber', emoji: '🔧', description: 'Home service business software', urlPlaceholder: 'https://clienthub.getjobber.com/client_hubs/...', urlLabel: 'Booking Link' },
      { id: 'servicetitan', name: 'ServiceTitan', emoji: '⚙️', description: 'Field service management', urlPlaceholder: 'https://booking.servicetitan.com/...', urlLabel: 'Booking Link' },
      { id: 'housecall_pro', name: 'HouseCall Pro', emoji: '🏠', description: 'Home service software', urlPlaceholder: 'https://app.housecallpro.com/book/...', urlLabel: 'Booking Link' },
    ],
  },
  {
    label: 'CUSTOM',
    platforms: [
      { id: 'custom', name: 'Custom URL', emoji: '🔗', description: 'Any external booking or scheduling page', urlPlaceholder: 'https://your-booking-page.com', urlLabel: 'Booking URL' },
    ],
  },
]

const ALL_PLATFORMS: Platform[] = PLATFORM_CATEGORIES.flatMap((c) => c.platforms)

// ─── Props ────────────────────────────────────────────────────────────────────

interface BookingIntegrationsProps {
  currentPlatform?: string | null
  currentBookingUrl?: string | null
  practiceId: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BookingIntegrations({ currentPlatform, currentBookingUrl, practiceId }: BookingIntegrationsProps) {
  const activePlatformId = currentPlatform || 'spadechat'
  const [selectedId, setSelectedId] = useState<string>(activePlatformId)
  const [urlValue, setUrlValue] = useState<string>(currentBookingUrl || '')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedPlatformId, setSavedPlatformId] = useState<string>(activePlatformId)
  const [savedUrl, setSavedUrl] = useState<string>(currentBookingUrl || '')
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const selectedPlatform = useMemo(() => ALL_PLATFORMS.find((p) => p.id === selectedId), [selectedId])

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return PLATFORM_CATEGORIES
    const q = search.toLowerCase()
    return PLATFORM_CATEGORIES.map((cat) => ({
      ...cat,
      platforms: cat.platforms.filter(
        (p) => p.name.toLowerCase().includes(q) || cat.label.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.platforms.length > 0)
  }, [search])

  function toggleCategory(label: string) {
    setExpandedCategories((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  function isCategoryExpanded(label: string) {
    // Default: SpadeChat always expanded; others collapsed unless toggled or searching
    if (search.trim()) return true
    if (label === 'SPADECHAT') return true
    return expandedCategories[label] ?? false
  }

  function handleSelectPlatform(platform: Platform) {
    setSelectedId(platform.id)
    setError(null)
    setSuccessMsg(null)
    // Pre-fill URL if it was previously saved for this platform
    if (platform.id === savedPlatformId) {
      setUrlValue(savedUrl)
    } else {
      setUrlValue('')
    }
  }

  async function handleConnect() {
    if (!selectedPlatform) return
    if (!selectedPlatform.noUrl && !urlValue.trim()) {
      setError('Please enter a booking URL.')
      return
    }

    setSaving(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const res = await fetch('/api/practices/booking-integration', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform.id,
          booking_url: selectedPlatform.noUrl ? '' : urlValue.trim(),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to save. Please try again.')
      } else {
        setSavedPlatformId(selectedPlatform.id)
        setSavedUrl(selectedPlatform.noUrl ? '' : urlValue.trim())
        setSuccessMsg(`${selectedPlatform.name} connected successfully.`)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const isConnected = (id: string) => id === savedPlatformId

  return (
    <div className="hairline rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 hairline-b flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="mono-label-sm opacity-40 block mb-1">BOOKING SYSTEM</span>
          <h3 className="font-display font-black uppercase text-lg tracking-tightest">CONNECT YOUR BOOKING SYSTEM</h3>
        </div>
        {savedPlatformId && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-glow-pulse" />
            <span className="mono-label-sm text-accent/70">
              {ALL_PLATFORMS.find((p) => p.id === savedPlatformId)?.name?.toUpperCase() || 'CONNECTED'}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Left panel: platform picker */}
        <div className="md:w-64 lg:w-72 hairline-r shrink-0 flex flex-col">
          {/* Search */}
          <div className="px-4 py-3 hairline-b flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-white/20 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search platforms..."
              className="flex-1 bg-transparent font-mono text-xs text-white placeholder:text-white/20 focus:outline-none"
            />
          </div>

          {/* Platform list */}
          <div className="overflow-y-auto max-h-[420px]">
            {filteredCategories.map((cat) => {
              const expanded = isCategoryExpanded(cat.label)
              return (
                <div key={cat.label}>
                  {/* Category header */}
                  <button
                    onClick={() => toggleCategory(cat.label)}
                    className="w-full flex items-center justify-between px-4 py-2 hairline-b hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="font-mono text-[9px] opacity-30 uppercase tracking-[0.15em]">{cat.label}</span>
                    {expanded
                      ? <ChevronUp className="w-3 h-3 opacity-20" />
                      : <ChevronDown className="w-3 h-3 opacity-20" />}
                  </button>

                  {/* Platforms in category */}
                  {expanded && cat.platforms.map((platform) => {
                    const connected = isConnected(platform.id)
                    const selected = selectedId === platform.id
                    return (
                      <button
                        key={platform.id}
                        onClick={() => handleSelectPlatform(platform)}
                        className={[
                          'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hairline-b',
                          selected
                            ? 'bg-accent/10'
                            : 'hover:bg-white/[0.02]',
                        ].join(' ')}
                      >
                        <span className="text-base shrink-0">{platform.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className={['font-mono text-xs truncate', selected ? 'text-white' : 'text-white/60'].join(' ')}>
                            {platform.name}
                          </p>
                          {platform.isDefault && (
                            <span className="font-mono text-[9px] text-accent/60 uppercase tracking-[0.1em]">Default</span>
                          )}
                        </div>
                        {connected && (
                          <CheckCircle className="w-3 h-3 text-accent shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )
            })}

            {filteredCategories.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="font-mono text-xs text-white/20">No platforms found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right panel: configuration */}
        <div className="flex-1 p-6 flex flex-col gap-6">
          {selectedPlatform ? (
            <>
              {/* Platform header */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 hairline flex items-center justify-center text-2xl shrink-0">
                  {selectedPlatform.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-display font-black uppercase text-base tracking-tightest">
                      {selectedPlatform.name}
                    </h4>
                    {isConnected(selectedPlatform.id) && (
                      <Badge variant="success">CONNECTED</Badge>
                    )}
                    {selectedPlatform.isDefault && (
                      <Badge variant="accent">DEFAULT</Badge>
                    )}
                  </div>
                  <p className="font-sans text-xs text-white/40 mt-1">{selectedPlatform.description}</p>
                </div>
              </div>

              {/* URL input */}
              {selectedPlatform.noUrl ? (
                <div className="card-metal rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <p className="font-mono text-xs text-white/70">No external link required</p>
                  </div>
                  <p className="font-sans text-xs text-white/30">
                    SpadeChat will handle booking directly through your AI-powered profile. Customers interact with your services and book without leaving the SpadeChat ecosystem.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="mono-label-sm opacity-40 block mb-3">
                    {selectedPlatform.urlLabel.toUpperCase()}
                  </label>
                  <div className="flex items-center gap-2 hairline rounded-lg px-3 py-3 focus-within:border-accent/40 transition-colors" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <LinkIcon className="w-3.5 h-3.5 text-white/20 shrink-0" />
                    <input
                      type="url"
                      value={urlValue}
                      onChange={(e) => { setUrlValue(e.target.value); setError(null); setSuccessMsg(null) }}
                      placeholder={selectedPlatform.urlPlaceholder}
                      className="flex-1 bg-transparent font-mono text-xs text-white placeholder:text-white/15 focus:outline-none"
                    />
                  </div>
                  <p className="font-sans text-[11px] text-white/25 mt-2">
                    Paste the direct link to your booking page. AI assistants will direct customers here to complete their booking.
                  </p>
                </div>
              )}

              {/* Feedback */}
              {error && (
                <p className="font-mono text-[11px] text-destructive">{error}</p>
              )}
              {successMsg && (
                <p className="font-mono text-[11px] text-accent">{successMsg}</p>
              )}

              {/* Action */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleConnect}
                  loading={saving}
                  variant={isConnected(selectedPlatform.id) ? 'outline' : 'solid'}
                  size="sm"
                >
                  {saving ? 'SAVING...' : isConnected(selectedPlatform.id) ? 'UPDATE' : 'CONNECT'}
                </Button>
                {isConnected(selectedPlatform.id) && (
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-accent/60">
                    <CheckCircle className="w-3 h-3" />
                    ACTIVE
                  </span>
                )}
              </div>

              {/* Info callout */}
              <div className="mt-auto pt-4 hairline-t">
                <p className="font-sans text-[11px] text-white/20 leading-relaxed">
                  When AI assistants recommend your business, they will direct customers to your connected booking system. You can change this at any time.
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full py-16">
              <p className="font-mono text-xs text-white/20">Select a platform to configure</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
