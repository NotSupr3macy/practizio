'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Link as LinkIcon, Search, ChevronDown, ChevronUp, Loader2, HelpCircle } from 'lucide-react'

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
  instructions: string[]
  exampleUrl: string
  urlPattern: RegExp
  urlError: string
}

interface PlatformCategory {
  label: string
  platforms: Platform[]
}

const PLATFORM_CATEGORIES: PlatformCategory[] = [
  {
    label: 'CALENDAR & SCHEDULING',
    platforms: [
      {
        id: 'calendly', name: 'Calendly', emoji: '📅', description: 'Scheduling automation',
        urlPlaceholder: 'https://calendly.com/your-name', urlLabel: 'Scheduling Link',
        exampleUrl: 'https://calendly.com/jane-doe',
        urlPattern: /^https?:\/\/(www\.)?calendly\.com\/.+/i,
        urlError: 'This doesn\'t look like a Calendly link. It should look like: calendly.com/your-name',
        instructions: [
          'Log in to Calendly at calendly.com',
          'Click your profile icon (top-right) → "Share Your Link"',
          'Copy your scheduling link (looks like calendly.com/your-name)',
          'Paste it below',
        ],
      },
      {
        id: 'acuity', name: 'Acuity / Squarespace Scheduling', emoji: '🗓', description: 'Appointment scheduling',
        urlPlaceholder: 'https://acuityscheduling.com/schedule.php?owner=...', urlLabel: 'Booking Link',
        exampleUrl: 'https://acuityscheduling.com/schedule.php?owner=12345',
        urlPattern: /^https?:\/\/(www\.)?(acuityscheduling\.com|squarespacescheduling\.com)\/.+/i,
        urlError: 'This doesn\'t look like an Acuity link. It should include acuityscheduling.com or squarespacescheduling.com',
        instructions: [
          'Log in to Acuity Scheduling (or Squarespace Scheduling)',
          'Go to "Share Your Calendar" (left sidebar)',
          'Copy the "Direct Scheduling Link"',
          'Paste it below',
        ],
      },
      {
        id: 'cal_com', name: 'Cal.com', emoji: '📆', description: 'Open source scheduling',
        urlPlaceholder: 'https://cal.com/your-name', urlLabel: 'Booking Link',
        exampleUrl: 'https://cal.com/jane-doe',
        urlPattern: /^https?:\/\/(www\.)?cal\.com\/.+/i,
        urlError: 'This doesn\'t look like a Cal.com link. It should look like: cal.com/your-name',
        instructions: [
          'Log in to Cal.com',
          'Go to "Event Types" in the sidebar',
          'Click "Copy link" on the event type you want to use',
          'Paste it below (looks like cal.com/your-name)',
        ],
      },
      {
        id: 'google_calendar', name: 'Google Calendar', emoji: '🔵', description: 'Google Calendar booking or embed',
        urlPlaceholder: 'https://calendar.app.google/ABC123', urlLabel: 'Calendar Link',
        exampleUrl: 'https://calendar.app.google/PB647iXRRFoCxwov6',
        urlPattern: /^https?:\/\/calendar\.(app\.google|google\.com)\/.+/i,
        urlError: 'This doesn\'t look like a Google Calendar appointment link. It should look like calendar.app.google/... — your regular calendar URL won\'t work.',
        instructions: [
          'Open Google Calendar → click the + button → "Appointment schedule"',
          'Set up your appointment schedule (name, duration, hours)',
          'On the sharing page, click "Copy" next to "Open booking page"',
          'Paste the link below — it should look like calendar.app.google/ABC123',
          '⚠️ Note: Your regular calendar URL (calendar.google.com/calendar/u/0/r) will NOT work. You need the Appointment Schedule link.',
        ],
      },
      {
        id: 'microsoft_bookings', name: 'Microsoft Bookings', emoji: '🪟', description: 'Microsoft 365 booking pages',
        urlPlaceholder: 'https://outlook.office365.com/owa/calendar/...', urlLabel: 'Booking Page URL',
        exampleUrl: 'https://outlook.office365.com/owa/calendar/MyBusiness@...',
        urlPattern: /^https?:\/\/(outlook\.office365\.com|outlook\.office\.com|book\.ms|booking\.microsoft\.com)\/.+/i,
        urlError: 'This doesn\'t look like a Microsoft Bookings link. It should include outlook.office365.com or booking.microsoft.com',
        instructions: [
          'Open Microsoft 365 → go to Bookings (bookings.microsoft.com)',
          'Click on your booking page',
          'Click "Share" → copy the booking page link',
          'Paste it below',
        ],
      },
      {
        id: 'setmore', name: 'Setmore', emoji: '📋', description: 'Free appointment scheduling',
        urlPlaceholder: 'https://yourname.setmore.com', urlLabel: 'Booking Page URL',
        exampleUrl: 'https://janedoe.setmore.com',
        urlPattern: /^https?:\/\/(.+\.)?setmore\.com/i,
        urlError: 'This doesn\'t look like a Setmore link. It should look like: yourname.setmore.com',
        instructions: [
          'Log in to Setmore',
          'Go to Settings → Booking Page',
          'Copy your booking page URL',
          'Paste it below',
        ],
      },
      {
        id: 'simplybook', name: 'SimplyBook.me', emoji: '📌', description: 'Online booking system',
        urlPlaceholder: 'https://yourname.simplybook.me', urlLabel: 'Booking URL',
        exampleUrl: 'https://janedoe.simplybook.me',
        urlPattern: /^https?:\/\/(.+\.)?simplybook\.(me|it)/i,
        urlError: 'This doesn\'t look like a SimplyBook.me link. It should look like: yourname.simplybook.me',
        instructions: [
          'Log in to SimplyBook.me',
          'Go to Settings → Booking Widget → Direct link',
          'Copy the link',
          'Paste it below',
        ],
      },
    ],
  },
  {
    label: 'SALON & BEAUTY',
    platforms: [
      {
        id: 'vagaro', name: 'Vagaro', emoji: '💇', description: 'Salon & spa booking',
        urlPlaceholder: 'https://www.vagaro.com/your-salon', urlLabel: 'Booking Link',
        exampleUrl: 'https://www.vagaro.com/janessalon',
        urlPattern: /^https?:\/\/(www\.)?vagaro\.com\/.+/i,
        urlError: 'This doesn\'t look like a Vagaro link. It should look like: vagaro.com/your-salon-name',
        instructions: [
          'Log in to Vagaro',
          'Go to your business profile page (or MySite)',
          'Copy the URL from your browser — it looks like vagaro.com/your-salon-name',
          'Paste it below',
        ],
      },
      {
        id: 'fresha', name: 'Fresha', emoji: '🌿', description: 'Beauty & wellness platform',
        urlPlaceholder: 'https://www.fresha.com/a/...', urlLabel: 'Booking Link',
        exampleUrl: 'https://www.fresha.com/a/janes-salon-new-york-123',
        urlPattern: /^https?:\/\/(www\.)?fresha\.com\/.+/i,
        urlError: 'This doesn\'t look like a Fresha link. It should include fresha.com',
        instructions: [
          'Log in to Fresha (partners.fresha.com)',
          'Go to Settings → Online Booking',
          'Copy your booking page link',
          'Paste it below',
        ],
      },
      {
        id: 'booksy', name: 'Booksy', emoji: '✂️', description: 'Beauty services booking',
        urlPlaceholder: 'https://booksy.com/en-us/...', urlLabel: 'Booking Link',
        exampleUrl: 'https://booksy.com/en-us/12345_janes-barbershop',
        urlPattern: /^https?:\/\/(www\.)?booksy\.com\/.+/i,
        urlError: 'This doesn\'t look like a Booksy link. It should include booksy.com',
        instructions: [
          'Open Booksy Biz app or log in at booksy.com',
          'Go to your business profile',
          'Tap "Share" or copy your profile link',
          'Paste it below',
        ],
      },
      {
        id: 'glossgenius', name: 'GlossGenius', emoji: '💅', description: 'Beauty pro booking platform',
        urlPlaceholder: 'https://book.glossgenius.com/...', urlLabel: 'Booking Link',
        exampleUrl: 'https://book.glossgenius.com/janedoe',
        urlPattern: /^https?:\/\/(book\.)?glossgenius\.com\/.+/i,
        urlError: 'This doesn\'t look like a GlossGenius link. It should include glossgenius.com',
        instructions: [
          'Open GlossGenius app or dashboard',
          'Go to Settings → Booking Site',
          'Copy your booking link',
          'Paste it below',
        ],
      },
      {
        id: 'boulevard', name: 'Boulevard', emoji: '💄', description: 'Salon & spa management',
        urlPlaceholder: 'https://booking.boulevard.app/...', urlLabel: 'Booking Link',
        exampleUrl: 'https://booking.boulevard.app/janes-salon',
        urlPattern: /^https?:\/\/(booking\.)?boulevard\.(app|io)\/.+/i,
        urlError: 'This doesn\'t look like a Boulevard link. It should include boulevard.app',
        instructions: [
          'Log in to Boulevard dashboard',
          'Go to Settings → Online Booking',
          'Copy your booking page URL',
          'Paste it below',
        ],
      },
    ],
  },
  {
    label: 'HEALTH & FITNESS',
    platforms: [
      {
        id: 'mindbody', name: 'Mindbody', emoji: '🧘', description: 'Wellness & fitness booking',
        urlPlaceholder: 'https://www.mindbodyonline.com/explore/locations/...', urlLabel: 'Booking Link',
        exampleUrl: 'https://www.mindbodyonline.com/explore/locations/janes-yoga',
        urlPattern: /^https?:\/\/(www\.)?(mindbodyonline\.com|mindbody\.io)\/.+/i,
        urlError: 'This doesn\'t look like a Mindbody link. It should include mindbodyonline.com',
        instructions: [
          'Log in to Mindbody business dashboard',
          'Go to Home → Marketing → Booking Links',
          'Copy your direct booking link',
          'Paste it below',
        ],
      },
      {
        id: 'jane_app', name: 'Jane App', emoji: '🏥', description: 'Healthcare practice management',
        urlPlaceholder: 'https://yourname.janeapp.com', urlLabel: 'Booking Link',
        exampleUrl: 'https://janedoeclinic.janeapp.com',
        urlPattern: /^https?:\/\/(.+\.)?janeapp\.com/i,
        urlError: 'This doesn\'t look like a Jane App link. It should look like: yourname.janeapp.com',
        instructions: [
          'Log in to Jane App',
          'Go to Settings → Online Booking',
          'Copy your online booking URL (looks like yourname.janeapp.com)',
          'Paste it below',
        ],
      },
      {
        id: 'zenoti', name: 'Zenoti', emoji: '🧬', description: 'Spa & salon software',
        urlPlaceholder: 'https://yourname.zenoti.com/webstoreNew/services', urlLabel: 'Booking Link',
        exampleUrl: 'https://janesspa.zenoti.com/webstoreNew/services',
        urlPattern: /^https?:\/\/(.+\.)?zenoti\.com\/.+/i,
        urlError: 'This doesn\'t look like a Zenoti link. It should include zenoti.com',
        instructions: [
          'Log in to Zenoti dashboard',
          'Go to Settings → Online Booking → Webstore',
          'Copy your webstore/booking URL',
          'Paste it below',
        ],
      },
      {
        id: 'wellnessliving', name: 'WellnessLiving', emoji: '🏃', description: 'Business management platform',
        urlPlaceholder: 'https://widget.wellnessliving.com/...', urlLabel: 'Booking Link',
        exampleUrl: 'https://widget.wellnessliving.com/janes-fitness',
        urlPattern: /^https?:\/\/(.+\.)?wellnessliving\.com\/.+/i,
        urlError: 'This doesn\'t look like a WellnessLiving link. It should include wellnessliving.com',
        instructions: [
          'Log in to WellnessLiving',
          'Go to Setup → Online Widgets → Client Web App',
          'Copy your booking widget link',
          'Paste it below',
        ],
      },
    ],
  },
  {
    label: 'RESTAURANT & FOOD',
    platforms: [
      {
        id: 'opentable', name: 'OpenTable', emoji: '🍽️', description: 'Restaurant reservations',
        urlPlaceholder: 'https://www.opentable.com/r/...', urlLabel: 'Restaurant Link',
        exampleUrl: 'https://www.opentable.com/r/janes-bistro-new-york',
        urlPattern: /^https?:\/\/(www\.)?opentable\.com\/.+/i,
        urlError: 'This doesn\'t look like an OpenTable link. It should include opentable.com',
        instructions: [
          'Search for your restaurant on opentable.com',
          'Go to your restaurant\'s page',
          'Copy the URL from your browser',
          'Paste it below',
        ],
      },
      {
        id: 'resy', name: 'Resy', emoji: '🥂', description: 'Restaurant booking platform',
        urlPlaceholder: 'https://resy.com/cities/.../venues/...', urlLabel: 'Booking Link',
        exampleUrl: 'https://resy.com/cities/ny/venues/janes-bistro',
        urlPattern: /^https?:\/\/(www\.)?resy\.com\/.+/i,
        urlError: 'This doesn\'t look like a Resy link. It should include resy.com',
        instructions: [
          'Search for your restaurant on resy.com',
          'Go to your restaurant\'s page',
          'Copy the URL from your browser',
          'Paste it below',
        ],
      },
      {
        id: 'toast', name: 'Toast', emoji: '🍕', description: 'Restaurant point of sale & ordering',
        urlPlaceholder: 'https://www.toasttab.com/your-restaurant/...', urlLabel: 'Ordering Link',
        exampleUrl: 'https://www.toasttab.com/janes-pizza/v3',
        urlPattern: /^https?:\/\/(www\.)?toasttab\.com\/.+/i,
        urlError: 'This doesn\'t look like a Toast link. It should include toasttab.com',
        instructions: [
          'Log in to Toast dashboard',
          'Go to Online Ordering → Settings',
          'Copy your online ordering link',
          'Paste it below',
        ],
      },
      {
        id: 'square_online', name: 'Square Online', emoji: '🛒', description: 'Online ordering & store',
        urlPlaceholder: 'https://squareup.com/store/...', urlLabel: 'Ordering Link',
        exampleUrl: 'https://squareup.com/store/janes-bakery',
        urlPattern: /^https?:\/\/(www\.)?(squareup\.com|square\.site)\/.+/i,
        urlError: 'This doesn\'t look like a Square Online link. It should include squareup.com or square.site',
        instructions: [
          'Log in to Square Dashboard',
          'Go to Online → Site → View Site',
          'Copy the URL of your online store/ordering page',
          'Paste it below',
        ],
      },
    ],
  },
  {
    label: 'GENERAL BUSINESS',
    platforms: [
      {
        id: 'square_appointments', name: 'Square Appointments', emoji: '🟦', description: 'Appointment booking with Square',
        urlPlaceholder: 'https://squareup.com/appointments/book/...', urlLabel: 'Booking Link',
        exampleUrl: 'https://squareup.com/appointments/book/abc123/janes-shop',
        urlPattern: /^https?:\/\/(www\.)?squareup\.com\/appointments\/.+/i,
        urlError: 'This doesn\'t look like a Square Appointments link. It should include squareup.com/appointments/',
        instructions: [
          'Log in to Square Dashboard',
          'Go to Appointments → Online Booking',
          'Click "Share booking site"',
          'Copy the booking link',
          'Paste it below',
        ],
      },
      {
        id: 'jobber', name: 'Jobber', emoji: '🔧', description: 'Home service business software',
        urlPlaceholder: 'https://clienthub.getjobber.com/client_hubs/...', urlLabel: 'Booking Link',
        exampleUrl: 'https://clienthub.getjobber.com/client_hubs/abc123',
        urlPattern: /^https?:\/\/(.+\.)?(getjobber\.com|jobber\.com)\/.+/i,
        urlError: 'This doesn\'t look like a Jobber link. It should include getjobber.com or jobber.com',
        instructions: [
          'Log in to Jobber',
          'Go to Client Hub → Settings',
          'Copy your Client Hub or online booking link',
          'Paste it below',
        ],
      },
      {
        id: 'servicetitan', name: 'ServiceTitan', emoji: '⚙️', description: 'Field service management',
        urlPlaceholder: 'https://booking.servicetitan.com/...', urlLabel: 'Booking Link',
        exampleUrl: 'https://booking.servicetitan.com/janes-plumbing',
        urlPattern: /^https?:\/\/(.+\.)?servicetitan\.com\/.+/i,
        urlError: 'This doesn\'t look like a ServiceTitan link. It should include servicetitan.com',
        instructions: [
          'Log in to ServiceTitan',
          'Go to Marketing → Online Booking',
          'Copy your booking page URL',
          'Paste it below',
        ],
      },
      {
        id: 'housecall_pro', name: 'HouseCall Pro', emoji: '🏠', description: 'Home service software',
        urlPlaceholder: 'https://app.housecallpro.com/book/...', urlLabel: 'Booking Link',
        exampleUrl: 'https://app.housecallpro.com/book/janes-hvac',
        urlPattern: /^https?:\/\/(.+\.)?housecallpro\.com\/.+/i,
        urlError: 'This doesn\'t look like a HouseCall Pro link. It should include housecallpro.com',
        instructions: [
          'Log in to HouseCall Pro',
          'Go to Settings → Online Booking',
          'Copy your booking page link',
          'Paste it below',
        ],
      },
    ],
  },
  {
    label: 'CUSTOM',
    platforms: [
      {
        id: 'custom', name: 'Custom URL', emoji: '🔗', description: 'Any external booking or scheduling page',
        urlPlaceholder: 'https://your-booking-page.com', urlLabel: 'Booking URL',
        exampleUrl: 'https://yourbusiness.com/book',
        urlPattern: /^https?:\/\/.+\..+/i,
        urlError: 'Please enter a valid URL starting with http:// or https://',
        instructions: [
          'Open your booking or scheduling page in your browser',
          'Copy the URL that customers would use to book with you',
          'Make sure it\'s a public link (test it in an incognito/private window)',
          'Paste it below',
        ],
      },
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

function detectPlatformFromUrl(url: string): string {
  const lower = url.toLowerCase()
  if (lower.includes('calendly.com')) return 'calendly'
  if (lower.includes('acuityscheduling.com') || lower.includes('squareup.com/appointments')) return 'acuity'
  if (lower.includes('cal.com')) return 'cal_com'
  if (lower.includes('calendar.google.com') || lower.includes('calendar.app.google')) return 'google_calendar'
  if (lower.includes('outlook.office365.com') || lower.includes('microsoft')) return 'microsoft_bookings'
  if (lower.includes('setmore.com')) return 'setmore'
  if (lower.includes('simplybook.me')) return 'simplybook'
  if (lower.includes('vagaro.com')) return 'vagaro'
  if (lower.includes('fresha.com')) return 'fresha'
  if (lower.includes('booksy.com')) return 'booksy'
  if (lower.includes('glossgenius.com')) return 'glossgenius'
  if (lower.includes('boulevard.app')) return 'boulevard'
  if (lower.includes('mindbody')) return 'mindbody'
  if (lower.includes('janeapp.com')) return 'jane_app'
  if (lower.includes('zenoti.com')) return 'zenoti'
  if (lower.includes('wellnessliving.com')) return 'wellnessliving'
  if (lower.includes('opentable.com')) return 'opentable'
  if (lower.includes('resy.com')) return 'resy'
  if (lower.includes('toasttab.com')) return 'toast'
  if (lower.includes('squareup.com') || lower.includes('square.site')) return 'square_online'
  if (lower.includes('jobber.com') || lower.includes('getjobber.com')) return 'jobber'
  if (lower.includes('servicetitan.com')) return 'servicetitan'
  if (lower.includes('housecallpro.com')) return 'housecall_pro'
  return 'custom'
}

export function BookingIntegrations({ currentPlatform, currentBookingUrl, practiceId }: BookingIntegrationsProps) {
  // If platform is 'internal' but we have a URL, auto-detect the platform from the URL
  const activePlatformId = (currentPlatform && currentPlatform !== 'internal')
    ? currentPlatform
    : currentBookingUrl
      ? detectPlatformFromUrl(currentBookingUrl)
      : 'custom'
  const [selectedId, setSelectedId] = useState<string>(activePlatformId)
  const [urlValue, setUrlValue] = useState<string>(currentBookingUrl || '')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedPlatformId, setSavedPlatformId] = useState<string>(activePlatformId)
  const [savedUrl, setSavedUrl] = useState<string>(currentBookingUrl || '')
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [showInstructions, setShowInstructions] = useState(false)
  const [urlValidation, setUrlValidation] = useState<{
    status: 'idle' | 'checking' | 'valid' | 'invalid_format' | 'unreachable'
    message: string
  }>({ status: 'idle', message: '' })

  const urlValidationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selectedPlatform = useMemo(() => ALL_PLATFORMS.find((p) => p.id === selectedId), [selectedId])

  // ─── URL Validation (debounced) ──────────────────────────────────────────
  useEffect(() => {
    if (urlValidationTimeout.current) {
      clearTimeout(urlValidationTimeout.current)
    }

    const url = urlValue.trim()
    if (!url || !selectedPlatform || selectedPlatform.noUrl) {
      setUrlValidation({ status: 'idle', message: '' })
      return
    }

    // Quick format check
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
    } catch {
      setUrlValidation({ status: 'invalid_format', message: 'This doesn\'t look like a valid URL. Make sure it starts with https://' })
      return
    }

    const urlToCheck = url.startsWith('http') ? url : `https://${url}`

    // Check platform pattern
    if (!selectedPlatform.urlPattern.test(urlToCheck)) {
      setUrlValidation({ status: 'invalid_format', message: selectedPlatform.urlError })
      return
    }

    // Pattern matched — verify reachability (debounced)
    setUrlValidation({ status: 'checking', message: 'Checking link...' })

    urlValidationTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/validate-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlToCheck }),
        })
        const data = await res.json()
        if (data.reachable) {
          setUrlValidation({ status: 'valid', message: 'Link verified — looks good!' })
        } else {
          setUrlValidation({ status: 'unreachable', message: 'We couldn\'t reach this link. Double-check the URL or try opening it in your browser.' })
        }
      } catch {
        setUrlValidation({ status: 'valid', message: 'Link format looks correct' })
      }
    }, 800)

    return () => {
      if (urlValidationTimeout.current) {
        clearTimeout(urlValidationTimeout.current)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlValue, selectedId])

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
    if (search.trim()) return true
    const activeCat = PLATFORM_CATEGORIES.find((c) => c.platforms.some((p) => p.id === savedPlatformId))
    if (activeCat && activeCat.label === label) return true
    if (label === 'CALENDAR & SCHEDULING' && !activeCat) return true
    return expandedCategories[label] ?? false
  }

  function handleSelectPlatform(platform: Platform) {
    setSelectedId(platform.id)
    setError(null)
    setSuccessMsg(null)
    setShowInstructions(false)
    setUrlValidation({ status: 'idle', message: '' })
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

  // Validation icon helper
  function renderValidationIcon() {
    switch (urlValidation.status) {
      case 'checking':
        return <Loader2 className="w-3.5 h-3.5 text-white/40 animate-spin shrink-0" />
      case 'valid':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      case 'invalid_format':
      case 'unreachable':
        return <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
      default:
        return null
    }
  }

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

              {/* Instructions toggle */}
              <div>
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="flex items-center gap-2 font-mono text-[11px] text-accent/70 hover:text-accent transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showInstructions ? 'Hide' : 'How to find your'} {selectedPlatform.name} link</span>
                  {showInstructions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {showInstructions && (
                  <div className="mt-3 rounded-xl bg-white/[0.03] hairline p-4 space-y-2">
                    {selectedPlatform.instructions.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="font-mono text-[10px] text-accent/60 shrink-0 mt-0.5 w-4 text-right">
                          {step.startsWith('⚠️') ? '' : `${i + 1}.`}
                        </span>
                        <p className={[
                          'font-sans text-xs leading-relaxed',
                          step.startsWith('⚠️') ? 'text-amber-400/80' : 'text-white/50',
                        ].join(' ')}>
                          {step}
                        </p>
                      </div>
                    ))}
                    {selectedPlatform.exampleUrl && (
                      <div className="pt-2 mt-2 border-t border-white/[0.05]">
                        <p className="font-mono text-[10px] text-white/25">
                          Example: <span className="text-white/40">{selectedPlatform.exampleUrl}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
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
                  <div className={[
                    'flex items-center gap-2 rounded-lg px-3 py-3 transition-colors border',
                    urlValidation.status === 'valid' ? 'border-emerald-500/30' :
                    urlValidation.status === 'invalid_format' || urlValidation.status === 'unreachable' ? 'border-red-500/30' :
                    'border-white/[0.08] focus-within:border-accent/40',
                  ].join(' ')}>
                    <LinkIcon className="w-3.5 h-3.5 text-white/20 shrink-0" />
                    <input
                      type="url"
                      value={urlValue}
                      onChange={(e) => { setUrlValue(e.target.value); setError(null); setSuccessMsg(null) }}
                      placeholder={selectedPlatform.urlPlaceholder}
                      className="flex-1 bg-transparent font-mono text-xs text-white placeholder:text-white/15 focus:outline-none"
                    />
                    {renderValidationIcon()}
                  </div>

                  {/* Validation feedback */}
                  {urlValidation.status !== 'idle' && (
                    <p className={[
                      'font-mono text-[11px] mt-2',
                      urlValidation.status === 'valid' ? 'text-emerald-400' :
                      urlValidation.status === 'checking' ? 'text-white/40' :
                      'text-red-400',
                    ].join(' ')}>
                      {urlValidation.message}
                    </p>
                  )}

                  {urlValidation.status === 'idle' && (
                    <p className="font-sans text-[11px] text-white/25 mt-2">
                      Paste the direct link to your booking page. AI assistants will direct customers here to complete their booking.
                    </p>
                  )}
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
