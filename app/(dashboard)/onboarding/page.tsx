'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatTime } from '@/lib/utils'
import { findTemplateForIndustry } from '@/lib/service-templates'
import {
  Building2,
  Clock,
  Plus,
  Rocket,
  Briefcase,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Globe,
  Tag,
  X,
  Sparkles,
  Settings2,
  ShoppingCart,
  CalendarCheck,
  Package,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HelpCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useCallback, useEffect, useRef } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ServiceEntry {
  name: string
  price_min: string
  price_max: string
  duration_minutes: string
  description: string
  show_price: boolean
  price: string
  priceType: 'fixed' | 'starting_at' | 'varies' | 'free'
  currency: string
  paymentTiming: 'at_service' | 'at_booking' | 'deposit_then_remainder' | 'free'
  depositAmount: string
  paymentLink: string
  reservationHoldMinutes: string
}

interface DayAvailability {
  day_of_week: number
  label: string
  is_open: boolean
  open_time: string
  close_time: string
}

interface AdditionalInfoEntry {
  key: string
  value: string
}

interface CatalogEntry {
  name: string
  category: string
  price: string
  description: string
  options: string // comma-separated option groups e.g. "Size: S,M,L"
}

interface FormData {
  // Step 1: Account (handled by signup page)
  // Step 2: Business Profile
  name: string
  industry: string
  interaction_type: 'appointment' | 'order' | 'hybrid'
  tags: string[]
  tagInput: string
  phone: string
  website: string
  address_street: string
  address_city: string
  address_state: string
  address_zip: string
  additional_info: AdditionalInfoEntry[]
  booking_url: string
  // Step 3: Booking System (appointment/hybrid only)
  booking_system_type: string
  integration_request_system: string
  // Step 4: Services (appointment/hybrid) / Catalog (order/hybrid)
  services: ServiceEntry[]
  catalog_items: CatalogEntry[]
  // Step 5: Availability
  availability: DayAvailability[]
  // Step 6: Business Rules
  min_advance_hours: string
  max_advance_days: string
  buffer_minutes: string
  additional_rules: string
  // Step 7: Review
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const INDUSTRY_SUGGESTIONS = [
  'Hair Salon', 'Barbershop', 'Dental Office', 'Medical Practice', 'Yoga Studio',
  'Dog Grooming', 'Auto Repair', 'Tattoo Parlor', 'Photography Studio',
  'Tutoring Center', 'Law Firm', 'Financial Advisor', 'Veterinary Clinic',
  'Spa & Wellness', 'Personal Trainer', 'Music Teacher', 'Therapy Practice',
  'Consulting', 'Nail Salon', 'Massage Therapy', 'Chiropractic', 'Optometry',
  'Tax Preparation', 'Real Estate Agent', 'Driving School', 'Dance Studio',
  'Martial Arts Studio', 'Pet Sitting', 'House Cleaning', 'Landscaping',
  'Plumbing', 'Electrical', 'HVAC', 'Accounting', 'Insurance Agent',
]

const ADDITIONAL_INFO_SUGGESTIONS: Record<string, string[]> = {
  dental: ['Accepted Insurance', 'Emergency Services', 'Parking'],
  medical: ['Accepted Insurance', 'Telehealth Available', 'Languages Spoken'],
  'hair salon': ['Parking', 'Walk-ins Welcome', 'Products Used'],
  'tattoo': ['Age Requirement', 'Deposit Required', 'Bring Reference Photos'],
  'dog grooming': ['Vaccination Requirement', 'Breed Restrictions', 'Drop-off Available'],
  'yoga studio': ['What to Bring', 'Difficulty Levels', 'Heated Studio'],
  'auto repair': ['Loaner Cars Available', 'Warranty', 'Brands Serviced'],
  default: ['Parking', 'Accessibility', 'Payment Methods', 'Cancellation Policy'],
}

// ---------------------------------------------------------------------------
// Booking Platform Data & Instructions
// ---------------------------------------------------------------------------

interface BookingPlatform {
  id: string
  name: string
  emoji: string
  urlPlaceholder: string
  instructions: string[]
  exampleUrl: string
  /** Regex pattern the URL must match to be considered correct for this platform */
  urlPattern: RegExp
  /** Human-readable error when the URL doesn't match the pattern */
  urlError: string
}

interface BookingPlatformCategory {
  label: string
  platforms: BookingPlatform[]
}

const BOOKING_PLATFORM_CATEGORIES: BookingPlatformCategory[] = [
  {
    label: 'CALENDAR & SCHEDULING',
    platforms: [
      {
        id: 'calendly', name: 'Calendly', emoji: '📅',
        urlPlaceholder: 'https://calendly.com/your-name',
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
        id: 'acuity', name: 'Acuity / Squarespace', emoji: '🗓',
        urlPlaceholder: 'https://acuityscheduling.com/schedule.php?owner=...',
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
        id: 'cal_com', name: 'Cal.com', emoji: '📆',
        urlPlaceholder: 'https://cal.com/your-name',
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
        id: 'google_calendar', name: 'Google Calendar', emoji: '🔵',
        urlPlaceholder: 'https://calendar.app.google/ABC123',
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
        id: 'microsoft_bookings', name: 'Microsoft Bookings', emoji: '🪟',
        urlPlaceholder: 'https://outlook.office365.com/owa/calendar/...',
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
        id: 'setmore', name: 'Setmore', emoji: '📋',
        urlPlaceholder: 'https://yourname.setmore.com',
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
        id: 'simplybook', name: 'SimplyBook.me', emoji: '📌',
        urlPlaceholder: 'https://yourname.simplybook.me',
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
        id: 'vagaro', name: 'Vagaro', emoji: '💇',
        urlPlaceholder: 'https://www.vagaro.com/your-salon',
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
        id: 'fresha', name: 'Fresha', emoji: '🌿',
        urlPlaceholder: 'https://www.fresha.com/a/...',
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
        id: 'booksy', name: 'Booksy', emoji: '✂️',
        urlPlaceholder: 'https://booksy.com/en-us/...',
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
        id: 'glossgenius', name: 'GlossGenius', emoji: '💅',
        urlPlaceholder: 'https://book.glossgenius.com/...',
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
        id: 'boulevard', name: 'Boulevard', emoji: '💄',
        urlPlaceholder: 'https://booking.boulevard.app/...',
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
        id: 'mindbody', name: 'Mindbody', emoji: '🧘',
        urlPlaceholder: 'https://www.mindbodyonline.com/explore/locations/...',
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
        id: 'jane_app', name: 'Jane App', emoji: '🏥',
        urlPlaceholder: 'https://yourname.janeapp.com',
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
        id: 'zenoti', name: 'Zenoti', emoji: '🧬',
        urlPlaceholder: 'https://yourname.zenoti.com/webstoreNew/services',
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
        id: 'wellnessliving', name: 'WellnessLiving', emoji: '🏃',
        urlPlaceholder: 'https://widget.wellnessliving.com/...',
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
        id: 'opentable', name: 'OpenTable', emoji: '🍽️',
        urlPlaceholder: 'https://www.opentable.com/r/...',
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
        id: 'resy', name: 'Resy', emoji: '🥂',
        urlPlaceholder: 'https://resy.com/cities/.../venues/...',
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
        id: 'toast', name: 'Toast', emoji: '🍕',
        urlPlaceholder: 'https://www.toasttab.com/your-restaurant/...',
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
        id: 'square_online', name: 'Square Online', emoji: '🛒',
        urlPlaceholder: 'https://squareup.com/store/...',
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
        id: 'square_appointments', name: 'Square Appointments', emoji: '🟦',
        urlPlaceholder: 'https://squareup.com/appointments/book/...',
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
        id: 'jobber', name: 'Jobber', emoji: '🔧',
        urlPlaceholder: 'https://clienthub.getjobber.com/client_hubs/...',
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
        id: 'servicetitan', name: 'ServiceTitan', emoji: '⚙️',
        urlPlaceholder: 'https://booking.servicetitan.com/...',
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
        id: 'housecall_pro', name: 'HouseCall Pro', emoji: '🏠',
        urlPlaceholder: 'https://app.housecallpro.com/book/...',
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
    label: 'OTHER',
    platforms: [
      {
        id: 'custom', name: 'Other / Custom URL', emoji: '🔗',
        urlPlaceholder: 'https://your-booking-page.com',
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

const ALL_BOOKING_PLATFORMS: BookingPlatform[] = BOOKING_PLATFORM_CATEGORIES.flatMap((c) => c.platforms)

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function buildDefaultAvailability(): DayAvailability[] {
  return DAY_LABELS.map((label, index) => ({
    day_of_week: index,
    label,
    is_open: index >= 1 && index <= 5,
    open_time: '09:00',
    close_time: '17:00',
  }))
}

function getSteps(interactionType: string) {
  if (interactionType === 'order') {
    return ['BUSINESS_PROFILE', 'CATALOG', 'AVAILABILITY', 'LAUNCH']
  }
  if (interactionType === 'hybrid') {
    return ['BUSINESS_PROFILE', 'SERVICES', 'CATALOG', 'AVAILABILITY', 'LAUNCH']
  }
  // appointment (default)
  return ['BUSINESS_PROFILE', 'SERVICES', 'AVAILABILITY', 'LAUNCH']
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showIndustrySuggestions, setShowIndustrySuggestions] = useState(false)
  const [selectedBookingPlatformId, setSelectedBookingPlatformId] = useState<string | null>(null)
  const [platformSearchQuery, setPlatformSearchQuery] = useState('')
  const [expandedPlatformCats, setExpandedPlatformCats] = useState<Record<string, boolean>>({})
  const [urlValidation, setUrlValidation] = useState<{ status: 'idle' | 'checking' | 'valid' | 'invalid_format' | 'unreachable'; message: string }>({ status: 'idle', message: '' })

  const selectedBookingPlatform = selectedBookingPlatformId
    ? ALL_BOOKING_PLATFORMS.find((p) => p.id === selectedBookingPlatformId) ?? null
    : null

  const filteredPlatformCategories = platformSearchQuery.trim()
    ? BOOKING_PLATFORM_CATEGORIES.map((cat) => ({
        ...cat,
        platforms: cat.platforms.filter(
          (p) => p.name.toLowerCase().includes(platformSearchQuery.toLowerCase())
        ),
      })).filter((cat) => cat.platforms.length > 0)
    : BOOKING_PLATFORM_CATEGORIES

  const [formData, setFormData] = useState<FormData>({
    name: '',
    industry: '',
    interaction_type: 'appointment',
    tags: [],
    tagInput: '',
    phone: '',
    website: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zip: '',
    additional_info: [],
    booking_url: '',
    booking_system_type: 'internal',
    integration_request_system: '',
    services: [{ name: '', price_min: '', price_max: '', duration_minutes: '30', description: '', show_price: true, price: '', priceType: 'fixed' as const, currency: 'USD', paymentTiming: 'at_service' as const, depositAmount: '', paymentLink: '', reservationHoldMinutes: '15' }],
    catalog_items: [{ name: '', category: '', price: '', description: '', options: '' }],
    availability: buildDefaultAvailability(),
    min_advance_hours: '1',
    max_advance_days: '60',
    buffer_minutes: '0',
    additional_rules: '',
  })

  // --- URL Validation (debounced) ---

  const urlValidationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (urlValidationTimeout.current) {
      clearTimeout(urlValidationTimeout.current)
    }

    const url = formData.booking_url.trim()
    if (!url || !selectedBookingPlatform) {
      setUrlValidation({ status: 'idle', message: '' })
      return
    }

    // Quick format check — is it a valid URL at all?
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
    } catch {
      setUrlValidation({ status: 'invalid_format', message: 'This doesn\'t look like a valid URL. Make sure it starts with https://' })
      return
    }

    const urlToCheck = url.startsWith('http') ? url : `https://${url}`

    // Check if URL matches the platform's expected pattern
    if (!selectedBookingPlatform.urlPattern.test(urlToCheck)) {
      setUrlValidation({ status: 'invalid_format', message: selectedBookingPlatform.urlError })
      return
    }

    // Pattern matched — verify the URL is reachable (debounced)
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
        // Network error on our end — don't block the user
        setUrlValidation({ status: 'valid', message: 'Link format looks correct' })
      }
    }, 800)

    return () => {
      if (urlValidationTimeout.current) {
        clearTimeout(urlValidationTimeout.current)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.booking_url, selectedBookingPlatformId])

  // --- Helpers ---

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function updateService(index: number, field: keyof ServiceEntry, value: string | boolean) {
    setFormData((prev) => {
      const updated = [...prev.services]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, services: updated }
    })
  }

  function addService() {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { name: '', price_min: '', price_max: '', duration_minutes: '30', description: '', show_price: true, price: '', priceType: 'fixed' as const, currency: 'USD', paymentTiming: 'at_service' as const, depositAmount: '', paymentLink: '', reservationHoldMinutes: '15' }],
    }))
  }

  function removeService(index: number) {
    setFormData((prev) => ({ ...prev, services: prev.services.filter((_, i) => i !== index) }))
  }

  function loadTemplate() {
    const templates = findTemplateForIndustry(formData.industry)
    if (templates) {
      setFormData((prev) => ({
        ...prev,
        services: templates.map((t) => ({
          name: t.name,
          price_min: '',
          price_max: '',
          duration_minutes: String(t.duration_minutes),
          description: t.description,
          show_price: true,
          price: t.pricing.price != null ? String(t.pricing.price) : '',
          priceType: t.pricing.priceType,
          currency: t.pricing.currency,
          paymentTiming: t.pricing.paymentTiming,
          depositAmount: t.pricing.depositAmount != null ? String(t.pricing.depositAmount) : '',
          paymentLink: '',
          reservationHoldMinutes: '15',
        })),
      }))
    }
  }

  function updateCatalogItem(index: number, field: keyof CatalogEntry, value: string) {
    setFormData((prev) => {
      const updated = [...prev.catalog_items]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, catalog_items: updated }
    })
  }

  function addCatalogItem() {
    setFormData((prev) => ({
      ...prev,
      catalog_items: [...prev.catalog_items, { name: '', category: '', price: '', description: '', options: '' }],
    }))
  }

  function removeCatalogItem(index: number) {
    setFormData((prev) => ({ ...prev, catalog_items: prev.catalog_items.filter((_, i) => i !== index) }))
  }

  function addTag() {
    const tag = formData.tagInput.trim().toLowerCase()
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag], tagInput: '' }))
    }
  }

  function removeTag(tag: string) {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  function addAdditionalInfo() {
    setFormData((prev) => ({ ...prev, additional_info: [...prev.additional_info, { key: '', value: '' }] }))
  }

  function updateAdditionalInfo(index: number, field: 'key' | 'value', value: string) {
    setFormData((prev) => {
      const updated = [...prev.additional_info]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, additional_info: updated }
    })
  }

  function removeAdditionalInfo(index: number) {
    setFormData((prev) => ({ ...prev, additional_info: prev.additional_info.filter((_, i) => i !== index) }))
  }

  function updateAvailability(index: number, field: keyof DayAvailability, value: string | boolean) {
    setFormData((prev) => {
      const updated = [...prev.availability]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, availability: updated }
    })
  }

  const filteredSuggestions = formData.industry
    ? INDUSTRY_SUGGESTIONS.filter((s) => s.toLowerCase().includes(formData.industry.toLowerCase()))
    : INDUSTRY_SUGGESTIONS.slice(0, 12)

  function getAdditionalInfoSuggestions(): string[] {
    const industry = formData.industry.toLowerCase()
    for (const [key, suggestions] of Object.entries(ADDITIONAL_INFO_SUGGESTIONS)) {
      if (industry.includes(key)) return suggestions
    }
    return ADDITIONAL_INFO_SUGGESTIONS.default
  }

  const STEP_LABELS = getSteps(formData.interaction_type)
  const STEP_NUMBERS = STEP_LABELS.map((_, i) => String(i + 1).padStart(2, '0'))

  function currentStepLabel() {
    return STEP_LABELS[currentStep] ?? ''
  }

  function displayLabel(label: string) {
    return label.replace(/_/g, ' ')
  }

  function canAdvance(): boolean {
    const label = currentStepLabel()
    if (label === 'BUSINESS_PROFILE') return formData.name.trim() !== '' && formData.industry.trim() !== '' && selectedBookingPlatformId !== null && formData.booking_url.trim() !== ''
    if (label === 'SERVICES') return formData.services.some((s) => s.name.trim() !== '')
    if (label === 'CATALOG') return formData.catalog_items.some((c) => c.name.trim() !== '')
    return true
  }

  function nextStep() {
    if (currentStep < STEP_LABELS.length - 1 && canAdvance()) {
      setCurrentStep((prev) => prev + 1)
      setError(null)
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      setError(null)
    }
  }

  async function handleLaunch() {
    setIsSubmitting(true)
    setError(null)

    try {
      const hasAddress = formData.address_street.trim() || formData.address_city.trim()

      const additionalInfoObj: Record<string, string> = {}
      for (const entry of formData.additional_info) {
        if (entry.key.trim() && entry.value.trim()) {
          additionalInfoObj[entry.key.trim()] = entry.value.trim()
        }
      }

      const payload: Record<string, unknown> = {
        name: formData.name.trim(),
        industry: formData.industry.trim(),
        interaction_type: formData.interaction_type,
        tags: formData.tags,
        phone: formData.phone.trim() || null,
        website: formData.website.trim() || null,
        booking_url: formData.booking_url.trim() || null,
        booking_system_type: formData.booking_system_type,
        address: hasAddress
          ? {
              street: formData.address_street.trim(),
              city: formData.address_city.trim(),
              state: formData.address_state.trim(),
              zip: formData.address_zip.trim(),
            }
          : null,
        additional_info: additionalInfoObj,
        availability: formData.availability.map((a) => ({
          day_of_week: a.day_of_week,
          open_time: a.open_time,
          close_time: a.close_time,
          is_open: a.is_open,
        })),
      }

      // Appointment/hybrid: include services, booking system, business rules
      if (formData.interaction_type !== 'order') {
        // Collect payment link from any service that has one (use first found as practice default)
        const serviceWithPaymentLink = formData.services.find((s) => s.paymentLink.trim())
        if (serviceWithPaymentLink) {
          payload.payment_url = serviceWithPaymentLink.paymentLink.trim()
        }
        const serviceWithHoldTime = formData.services.find((s) => s.paymentTiming === 'deposit_then_remainder' && s.reservationHoldMinutes)
        if (serviceWithHoldTime) {
          payload.default_hold_minutes = Number(serviceWithHoldTime.reservationHoldMinutes) || 15
        }

        payload.services = formData.services
          .filter((s) => s.name.trim() !== '')
          .map((s) => ({
            name: s.name.trim(),
            price_min: s.price_min ? Number(s.price_min) : null,
            price_max: s.price_max ? Number(s.price_max) : null,
            duration_minutes: s.duration_minutes ? Number(s.duration_minutes) : null,
            description: s.description.trim() || null,
            show_price: s.show_price,
            pricing: {
              price: s.price ? Number(s.price) : null,
              currency: s.currency || 'USD',
              priceType: s.priceType,
              depositRequired: s.paymentTiming === 'deposit_then_remainder',
              depositAmount: s.depositAmount ? Number(s.depositAmount) : null,
              paymentTiming: s.paymentTiming,
            },
          }))
        payload.business_rules = {
          min_advance_hours: Number(formData.min_advance_hours) || 1,
          max_advance_days: Number(formData.max_advance_days) || 60,
          buffer_minutes: Number(formData.buffer_minutes) || 0,
          additional_rules: formData.additional_rules.trim(),
        }
      }

      // Order/hybrid: include catalog items
      if (formData.interaction_type !== 'appointment') {
        payload.catalog_items = formData.catalog_items
          .filter((c) => c.name.trim() !== '')
          .map((c) => ({
            name: c.name.trim(),
            category: c.category.trim() || null,
            price: c.price ? Math.round(Number(c.price) * 100) : 0, // convert to cents
            description: c.description.trim() || null,
            options: c.options.trim() ? [{ name: c.options.split(':')[0]?.trim() || 'Options', choices: c.options.split(':').slice(1).join(':').split(',').map((s) => s.trim()).filter(Boolean) }] : [],
          }))
      }

      const response = await fetch('/api/practices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create business')
      }

      // If they chose Google Calendar, redirect to OAuth so AI can book directly
      if (selectedBookingPlatformId === 'google_calendar') {
        window.location.href = '/api/integrations/google?from=onboarding'
        return
      }

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const generatedSlug = formData.name
    ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : 'your-business'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Step progress bar */}
      <div className="hairline-b">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <span className="mono-label-sm opacity-40 block mb-3">BUSINESS SETUP</span>
          <h1 className="font-display font-black uppercase text-2xl tracking-tightest mb-8">
            GET YOUR BUSINESS AI-READY
          </h1>

          <div className="flex items-center overflow-x-auto pb-2">
            {STEP_LABELS.map((label, index) => {
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <div key={label} className="flex items-center flex-1 min-w-0">
                  <div className="flex items-center gap-2 shrink-0">
                    <div
                      className={`flex items-center justify-center w-7 h-7 shrink-0 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-accent text-background'
                          : isActive
                          ? 'hairline text-accent'
                          : 'hairline text-muted-foreground'
                      }`}
                    >
                      <span className="font-mono text-[9px] font-bold" style={{ letterSpacing: '0.05em' }}>
                        {isCompleted ? '✓' : STEP_NUMBERS[index]}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-[8px] font-medium hidden lg:block transition-colors duration-300 uppercase whitespace-nowrap ${
                        isActive ? 'text-accent' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                      style={{ letterSpacing: '0.1em' }}
                    >
                      {displayLabel(label)}
                    </span>
                  </div>
                  {index < STEP_LABELS.length - 1 && (
                    <div className={`h-px flex-1 mx-3 min-w-[20px] transition-colors duration-300 ${index < currentStep ? 'bg-accent' : 'bg-white/10'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto px-6 py-8 w-full">
        {/* ============================================================ */}
        {/* Step: Business Profile */}
        {/* ============================================================ */}
        {currentStepLabel() === 'BUSINESS_PROFILE' && (
          <div className="animate-fade-in space-y-8">
            <div>
              <span className="mono-label-sm opacity-40 block mb-2">STEP 01</span>
              <h2 className="font-display font-black uppercase text-xl tracking-tightest">BUSINESS PROFILE</h2>
              <p className="font-sans text-sm font-light opacity-50 mt-2">Tell us about your business so AI agents can find and recommend you.</p>
            </div>

            <div className="space-y-5">
              <Input id="business-name" label="Business Name *" placeholder="e.g. Joe's Barbershop" value={formData.name} onChange={(e) => updateField('name', e.target.value)} />

              {/* Industry — free text with autocomplete */}
              <div className="relative">
                <Input
                  id="industry"
                  label="Industry / Category *"
                  placeholder="e.g. Hair Salon, Dental Office, Yoga Studio..."
                  value={formData.industry}
                  onChange={(e) => {
                    updateField('industry', e.target.value)
                    setShowIndustrySuggestions(true)
                  }}
                  onFocus={() => setShowIndustrySuggestions(true)}
                  onBlur={() => setTimeout(() => setShowIndustrySuggestions(false), 200)}
                />
                {showIndustrySuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card hairline max-h-48 overflow-y-auto">
                    {filteredSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="w-full text-left px-4 py-2 font-mono text-sm hover:bg-accent/10 hover:text-accent transition-colors"
                        onMouseDown={() => {
                          updateField('industry', suggestion)
                          setShowIndustrySuggestions(false)
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Interaction Type */}
              <div>
                <label className="block text-sm text-muted-foreground mb-3">What do customers do with your business?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'appointment' as const, label: 'Book Appointments', desc: 'Salons, dentists, mechanics, consultants', icon: CalendarCheck },
                    { id: 'order' as const, label: 'Place Orders', desc: 'Restaurants, grocery, retail, delivery', icon: ShoppingCart },
                    { id: 'hybrid' as const, label: 'Both', desc: 'Book services + order products', icon: Package },
                  ].map(({ id, label, desc, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        updateField('interaction_type', id)
                        // Reset step when changing type to avoid being on a non-existent step
                        setCurrentStep(0)
                      }}
                      className={`p-4 text-left transition-all duration-300 ${
                        formData.interaction_type === id
                          ? 'bg-accent/10 border-2 border-accent'
                          : 'hairline hover:bg-white/[0.02]'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-2 text-accent" />
                      <p className="font-mono text-sm font-medium text-foreground">{label}</p>
                      <p className="font-sans text-xs opacity-50 mt-1">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Tags (for discoverability)</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="accent" className="flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="tag-input"
                    placeholder="Add a tag (e.g. spa, massage, wellness)"
                    value={formData.tagInput}
                    onChange={(e) => updateField('tagInput', e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                  />
                  <Button variant="outline" onClick={addTag} className="shrink-0"><Tag className="w-4 h-4" /></Button>
                </div>
              </div>

              {/* Booking System Picker */}
              <div className="hairline-t pt-5">
                <span className="mono-label-sm opacity-40 block mb-2">BOOKING SYSTEM *</span>
                <p className="font-sans text-xs opacity-40 mb-4">
                  What booking system do you use? We&apos;ll show you exactly how to get the right link.
                </p>

                {/* Platform search */}
                <div className="flex items-center gap-2 hairline rounded-lg px-3 py-2.5 mb-3 focus-within:border-accent/40 transition-colors" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <HelpCircle className="w-3.5 h-3.5 text-white/20 shrink-0" />
                  <input
                    type="text"
                    value={platformSearchQuery}
                    onChange={(e) => setPlatformSearchQuery(e.target.value)}
                    placeholder="Search for your booking platform..."
                    className="flex-1 bg-transparent font-mono text-xs text-white placeholder:text-white/20 focus:outline-none"
                  />
                </div>

                {/* Platform grid */}
                <div className="hairline rounded-lg overflow-hidden mb-4 max-h-[320px] overflow-y-auto">
                  {filteredPlatformCategories.map((cat) => {
                    const isExpanded = platformSearchQuery.trim()
                      ? true
                      : expandedPlatformCats[cat.label] ?? (cat.label === 'CALENDAR & SCHEDULING' || cat.platforms.some((p) => p.id === selectedBookingPlatformId))
                    return (
                      <div key={cat.label}>
                        <button
                          type="button"
                          onClick={() => setExpandedPlatformCats((prev) => ({ ...prev, [cat.label]: !isExpanded }))}
                          className="w-full flex items-center justify-between px-4 py-2 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                        >
                          <span className="font-mono text-[9px] opacity-30 uppercase tracking-[0.15em]">{cat.label}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3 opacity-20" /> : <ChevronDown className="w-3 h-3 opacity-20" />}
                        </button>
                        {isExpanded && (
                          <div className="grid grid-cols-2 sm:grid-cols-3">
                            {cat.platforms.map((platform) => {
                              const isSelected = selectedBookingPlatformId === platform.id
                              return (
                                <button
                                  key={platform.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedBookingPlatformId(platform.id)
                                    updateField('booking_system_type', platform.id)
                                    // Clear URL and validation when switching platforms
                                    updateField('booking_url', '')
                                    setUrlValidation({ status: 'idle', message: '' })
                                  }}
                                  className={`flex items-center gap-2.5 px-4 py-3 text-left transition-all duration-200 border-b border-r border-white/[0.04] ${
                                    isSelected
                                      ? 'bg-accent/10 border-accent/20'
                                      : 'hover:bg-white/[0.03]'
                                  }`}
                                >
                                  <span className="text-base shrink-0">{platform.emoji}</span>
                                  <span className={`font-mono text-[11px] truncate ${isSelected ? 'text-accent font-medium' : 'text-white/60'}`}>
                                    {platform.name}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {filteredPlatformCategories.length === 0 && (
                    <div className="px-4 py-6 text-center">
                      <p className="font-mono text-xs text-white/20">No platforms found — try &quot;Other / Custom URL&quot;</p>
                    </div>
                  )}
                </div>

                {/* Platform-specific instructions */}
                {selectedBookingPlatform && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="bg-accent/5 hairline rounded-lg p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xl">{selectedBookingPlatform.emoji}</span>
                        <div>
                          <h4 className="font-display font-black uppercase text-sm tracking-tightest">
                            How to get your {selectedBookingPlatform.name} link
                          </h4>
                        </div>
                      </div>
                      <ol className="space-y-2 ml-1">
                        {selectedBookingPlatform.instructions.map((instruction, i) => (
                          <li key={i} className="flex gap-3 items-start">
                            <span className="font-mono text-[10px] text-accent font-bold mt-0.5 shrink-0">{i + 1}.</span>
                            <span className={`font-sans text-xs leading-relaxed ${instruction.startsWith('⚠️') ? 'text-yellow-400/80' : 'text-white/50'}`}>
                              {instruction}
                            </span>
                          </li>
                        ))}
                      </ol>
                      <div className="mt-3 pt-3 border-t border-white/[0.06]">
                        <p className="font-mono text-[10px] text-white/20">
                          Example: <span className="text-white/30">{selectedBookingPlatform.exampleUrl}</span>
                        </p>
                      </div>
                    </div>

                    {/* URL input */}
                    <div>
                      <div className={`flex items-center gap-2 rounded-lg px-3 py-3 transition-colors ${
                        urlValidation.status === 'valid'
                          ? 'border border-green-500/40 bg-green-500/[0.03]'
                          : urlValidation.status === 'invalid_format' || urlValidation.status === 'unreachable'
                          ? 'border border-red-500/40 bg-red-500/[0.03]'
                          : 'hairline focus-within:border-accent/40'
                      }`} style={urlValidation.status === 'idle' || urlValidation.status === 'checking' ? { borderColor: 'rgba(255,255,255,0.08)' } : undefined}>
                        <LinkIcon className="w-3.5 h-3.5 text-white/20 shrink-0" />
                        <input
                          type="url"
                          value={formData.booking_url}
                          onChange={(e) => updateField('booking_url', e.target.value)}
                          placeholder={selectedBookingPlatform.urlPlaceholder}
                          className="flex-1 bg-transparent font-mono text-xs text-white placeholder:text-white/15 focus:outline-none"
                        />
                        {/* Validation icon */}
                        {urlValidation.status === 'checking' && (
                          <Loader2 className="w-4 h-4 text-white/30 animate-spin shrink-0" />
                        )}
                        {urlValidation.status === 'valid' && (
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        )}
                        {(urlValidation.status === 'invalid_format' || urlValidation.status === 'unreachable') && (
                          <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        )}
                      </div>

                      {/* Validation message */}
                      {urlValidation.status === 'valid' && (
                        <div className="flex items-center gap-2 mt-2">
                          <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                          <p className="font-mono text-[11px] text-green-500">{urlValidation.message}</p>
                        </div>
                      )}
                      {urlValidation.status === 'invalid_format' && (
                        <div className="flex items-start gap-2 mt-2">
                          <XCircle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                          <p className="font-mono text-[11px] text-red-400">{urlValidation.message}</p>
                        </div>
                      )}
                      {urlValidation.status === 'unreachable' && (
                        <div className="flex items-start gap-2 mt-2">
                          <XCircle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                          <p className="font-mono text-[11px] text-red-400">{urlValidation.message}</p>
                        </div>
                      )}
                      {urlValidation.status === 'checking' && (
                        <div className="flex items-center gap-2 mt-2">
                          <Loader2 className="w-3 h-3 text-white/30 animate-spin shrink-0" />
                          <p className="font-mono text-[11px] text-white/30">{urlValidation.message}</p>
                        </div>
                      )}
                      {urlValidation.status === 'idle' && (
                        <p className="font-sans text-[11px] opacity-30 mt-2">
                          AI assistants will direct customers here to complete their booking.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {!selectedBookingPlatform && (
                  <p className="font-sans text-[11px] text-accent/50 mt-2">
                    Select your booking platform above to see step-by-step instructions.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input id="phone" label="Phone Number" type="tel" placeholder="(555) 123-4567" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
                <Input id="website" label="Website" type="url" placeholder="https://yourbusiness.com" value={formData.website} onChange={(e) => updateField('website', e.target.value)} />
              </div>

              <div className="hairline-t pt-5">
                <span className="mono-label-sm opacity-40 block mb-4">ADDRESS</span>
                <div className="space-y-4">
                  <Input id="street" label="Street Address" placeholder="123 Main Street, Suite 100" value={formData.address_street} onChange={(e) => updateField('address_street', e.target.value)} />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <Input id="city" label="City" placeholder="Portland" value={formData.address_city} onChange={(e) => updateField('address_city', e.target.value)} />
                    </div>
                    <Input id="state" label="State" placeholder="OR" value={formData.address_state} onChange={(e) => updateField('address_state', e.target.value)} />
                    <Input id="zip" label="ZIP" placeholder="97201" value={formData.address_zip} onChange={(e) => updateField('address_zip', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="hairline-t pt-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="mono-label-sm opacity-40">ADDITIONAL INFO</span>
                  <Button variant="ghost" size="sm" onClick={addAdditionalInfo}><Plus className="w-3 h-3 mr-1" />ADD FIELD</Button>
                </div>
                <p className="font-sans text-xs opacity-40 mb-4">Add any relevant details for your customers (e.g. parking info, insurance accepted, requirements).</p>

                {formData.additional_info.length === 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getAdditionalInfoSuggestions().map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="px-3 py-1 hairline font-mono text-[10px] uppercase text-muted-foreground hover:text-accent hover:border-accent/30 transition-colors"
                        style={{ letterSpacing: '0.1em' }}
                        onClick={() => setFormData((prev) => ({ ...prev, additional_info: [...prev.additional_info, { key: suggestion, value: '' }] }))}
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-3">
                  {formData.additional_info.map((entry, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <Input id={`info-key-${i}`} placeholder="Label (e.g. Parking)" value={entry.key} onChange={(e) => updateAdditionalInfo(i, 'key', e.target.value)} />
                      </div>
                      <div className="flex-[2]">
                        <Input id={`info-value-${i}`} placeholder="Value (e.g. Free parking in rear lot)" value={entry.value} onChange={(e) => updateAdditionalInfo(i, 'value', e.target.value)} />
                      </div>
                      <button type="button" onClick={() => removeAdditionalInfo(i)} className="mt-2 p-1 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* Step: Services (appointment/hybrid only) */}
        {/* ============================================================ */}
        {currentStepLabel() === 'SERVICES' && (
          <div className="animate-fade-in space-y-8">
            <div>
              <span className="mono-label-sm opacity-40 block mb-2">STEP {STEP_NUMBERS[currentStep]}</span>
              <h2 className="font-display font-black uppercase text-xl tracking-tightest">SERVICES</h2>
              <p className="font-sans text-sm font-light opacity-50 mt-2">Add the services AI agents can book for your customers.</p>
            </div>

            {/* Template suggestion */}
            {findTemplateForIndustry(formData.industry) && (
              <div className="flex items-center justify-between p-4 bg-accent/5 hairline">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <p className="font-mono text-xs opacity-70">
                    We have suggested services for <span className="text-accent">{formData.industry}</span> businesses.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={loadTemplate}>Load Template</Button>
              </div>
            )}

            <div className="space-y-4">
              {formData.services.map((service, index) => (
                <Card key={index} className="relative p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Input id={`svc-name-${index}`} label="Service Name *" placeholder="e.g. Haircut, Oil Change, Consultation..." value={service.name} onChange={(e) => updateService(index, 'name', e.target.value)} />
                      </div>
                      {formData.services.length > 1 && (
                        <button type="button" onClick={() => removeService(index)} className="mt-7 p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input id={`svc-duration-${index}`} label="Duration (min)" type="number" placeholder="30" value={service.duration_minutes} onChange={(e) => updateService(index, 'duration_minutes', e.target.value)} />
                      <Input id={`svc-price-${index}`} label="Price ($)" type="number" placeholder="45.00" value={service.price} onChange={(e) => updateService(index, 'price', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Price Type</label>
                        <select value={service.priceType} onChange={(e) => updateService(index, 'priceType', e.target.value)} className="w-full appearance-none px-4 py-2.5 bg-card hairline text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-200 cursor-pointer">
                          <option value="fixed">Fixed price</option>
                          <option value="starting_at">Starting at</option>
                          <option value="varies">Varies / quote required</option>
                          <option value="free">Free</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Payment Timing</label>
                        <select value={service.paymentTiming} onChange={(e) => updateService(index, 'paymentTiming', e.target.value)} className="w-full appearance-none px-4 py-2.5 bg-card hairline text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-200 cursor-pointer">
                          <option value="at_service">Pay at time of service</option>
                          <option value="at_booking">Pay when booking</option>
                          <option value="deposit_then_remainder">Deposit required, remainder at service</option>
                          <option value="free">Free / no payment</option>
                        </select>
                      </div>
                    </div>
                    {service.paymentTiming === 'deposit_then_remainder' && (
                      <div className="grid grid-cols-2 gap-4">
                        <Input id={`svc-deposit-${index}`} label="Deposit Amount ($)" type="number" placeholder="50" value={service.depositAmount} onChange={(e) => updateService(index, 'depositAmount', e.target.value)} />
                        <Input id={`svc-hold-${index}`} label="Reservation Hold (min)" type="number" placeholder="15" value={service.reservationHoldMinutes} onChange={(e) => updateService(index, 'reservationHoldMinutes', e.target.value)} />
                      </div>
                    )}
                    {(service.paymentTiming === 'at_booking' || service.paymentTiming === 'deposit_then_remainder') && (
                      <Input id={`svc-payment-link-${index}`} label="Payment Link (optional)" placeholder="https://pay.stripe.com/... or PayPal.me/..." value={service.paymentLink} onChange={(e) => updateService(index, 'paymentLink', e.target.value)} />
                    )}
                    <Input id={`svc-desc-${index}`} label="Description" placeholder="Brief description..." value={service.description} onChange={(e) => updateService(index, 'description', e.target.value)} />
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={addService} className="w-full"><Plus className="w-4 h-4 mr-2" />ADD SERVICE</Button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* Step: Catalog (order/hybrid only) */}
        {/* ============================================================ */}
        {currentStepLabel() === 'CATALOG' && (
          <div className="animate-fade-in space-y-8">
            <div>
              <span className="mono-label-sm opacity-40 block mb-2">STEP {STEP_NUMBERS[currentStep]}</span>
              <h2 className="font-display font-black uppercase text-xl tracking-tightest">CATALOG / MENU</h2>
              <p className="font-sans text-sm font-light opacity-50 mt-2">Add items that AI agents can order for your customers.</p>
            </div>

            <div className="space-y-4">
              {formData.catalog_items.map((item, index) => (
                <Card key={index} className="relative p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Input id={`cat-name-${index}`} label="Item Name *" placeholder="e.g. Margherita Pizza, Organic Apples..." value={item.name} onChange={(e) => updateCatalogItem(index, 'name', e.target.value)} />
                      </div>
                      {formData.catalog_items.length > 1 && (
                        <button type="button" onClick={() => removeCatalogItem(index)} className="mt-7 p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input id={`cat-category-${index}`} label="Category" placeholder="e.g. Pizza, Produce, Drinks..." value={item.category} onChange={(e) => updateCatalogItem(index, 'category', e.target.value)} />
                      <Input id={`cat-price-${index}`} label="Price ($)" type="number" placeholder="12.99" value={item.price} onChange={(e) => updateCatalogItem(index, 'price', e.target.value)} />
                    </div>
                    <Input id={`cat-desc-${index}`} label="Description" placeholder="Brief description..." value={item.description} onChange={(e) => updateCatalogItem(index, 'description', e.target.value)} />
                    <Input id={`cat-options-${index}`} label="Options (optional)" placeholder="e.g. Size: Small, Medium, Large" value={item.options} onChange={(e) => updateCatalogItem(index, 'options', e.target.value)} />
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={addCatalogItem} className="w-full"><Plus className="w-4 h-4 mr-2" />ADD ITEM</Button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* Step: Availability */}
        {/* ============================================================ */}
        {currentStepLabel() === 'AVAILABILITY' && (
          <div className="animate-fade-in space-y-8">
            <div>
              <span className="mono-label-sm opacity-40 block mb-2">STEP {STEP_NUMBERS[currentStep]}</span>
              <h2 className="font-display font-black uppercase text-xl tracking-tightest">AVAILABILITY</h2>
              <p className="font-sans text-sm font-light opacity-50 mt-2">Set your weekly hours so AI agents know when to schedule.</p>
            </div>
            <div className="space-y-0">
              {formData.availability.map((day, index) => (
                <div key={day.day_of_week} className={`flex items-center gap-4 px-4 py-4 hairline-b transition-all duration-200 ${day.is_open ? '' : 'opacity-50'}`}>
                  <Switch checked={day.is_open} onCheckedChange={(checked) => updateAvailability(index, 'is_open', checked)} />
                  <span className="font-mono text-[10px] font-medium w-28 uppercase" style={{ letterSpacing: '0.2em' }}>{day.label.toUpperCase()}</span>
                  {day.is_open ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input type="time" value={day.open_time} onChange={(e) => updateAvailability(index, 'open_time', e.target.value)} className="bg-transparent hairline-b px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-accent transition-all" />
                      <span className="text-muted-foreground text-xs font-mono uppercase" style={{ letterSpacing: '0.15em' }}>to</span>
                      <input type="time" value={day.close_time} onChange={(e) => updateAvailability(index, 'close_time', e.target.value)} className="bg-transparent hairline-b px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-accent transition-all" />
                    </div>
                  ) : (
                    <span className="font-mono text-[10px] opacity-30 uppercase" style={{ letterSpacing: '0.2em' }}>CLOSED</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* Step: Review & Launch */}
        {/* ============================================================ */}
        {currentStepLabel() === 'LAUNCH' && (
          <div className="animate-fade-in space-y-8">
            <div>
              <span className="mono-label-sm opacity-40 block mb-2">STEP {STEP_NUMBERS[currentStep]}</span>
              <h2 className="font-display font-black uppercase text-xl tracking-tightest">REVIEW & LAUNCH</h2>
              <p className="font-sans text-sm font-light opacity-50 mt-2">Everything looks great. Review and go live.</p>
            </div>

            <div className="space-y-0">
              {/* Business Details */}
              <div className="py-6 hairline-b">
                <div className="flex items-center gap-3 mb-4"><Building2 className="w-4 h-4 text-accent" /><span className="mono-label-sm opacity-60">BUSINESS DETAILS</span></div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  <div><span className="mono-label-sm opacity-30 block mb-1">NAME</span><p className="text-foreground font-mono text-sm">{formData.name}</p></div>
                  <div><span className="mono-label-sm opacity-30 block mb-1">INDUSTRY</span><p className="text-foreground font-mono text-sm">{formData.industry}</p></div>
                  {formData.tags.length > 0 && (
                    <div className="col-span-2"><span className="mono-label-sm opacity-30 block mb-1">TAGS</span><div className="flex gap-2 flex-wrap">{formData.tags.map((t) => <Badge key={t} variant="accent">{t}</Badge>)}</div></div>
                  )}
                  {formData.phone && <div><span className="mono-label-sm opacity-30 block mb-1">PHONE</span><p className="text-foreground font-mono text-sm">{formData.phone}</p></div>}
                  {formData.website && <div><span className="mono-label-sm opacity-30 block mb-1">WEBSITE</span><p className="text-foreground font-mono text-sm">{formData.website}</p></div>}
                </div>
              </div>

              {/* Services (appointment/hybrid) */}
              {formData.interaction_type !== 'order' && (
                <div className="py-6 hairline-b">
                  <div className="flex items-center gap-3 mb-4"><Briefcase className="w-4 h-4 text-accent" /><span className="mono-label-sm opacity-60">SERVICES ({formData.services.filter((s) => s.name.trim()).length})</span></div>
                  {formData.services.filter((s) => s.name.trim()).map((service, index) => (
                    <div key={index} className="flex items-center justify-between py-3 hairline-b last:border-b-0">
                      <div>
                        <p className="text-foreground font-mono text-sm">{service.name}</p>
                        {service.description && <p className="font-sans text-xs opacity-40 mt-0.5">{service.description}</p>}
                      </div>
                      <div className="text-right">
                        {service.duration_minutes && <p className="font-mono text-[10px] opacity-30 uppercase" style={{ letterSpacing: '0.15em' }}>{service.duration_minutes}_MIN</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Catalog (order/hybrid) */}
              {formData.interaction_type !== 'appointment' && (
                <div className="py-6 hairline-b">
                  <div className="flex items-center gap-3 mb-4"><ShoppingCart className="w-4 h-4 text-accent" /><span className="mono-label-sm opacity-60">CATALOG ({formData.catalog_items.filter((c) => c.name.trim()).length})</span></div>
                  {formData.catalog_items.filter((c) => c.name.trim()).map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 hairline-b last:border-b-0">
                      <div>
                        <p className="text-foreground font-mono text-sm">{item.name}</p>
                        {item.category && <p className="font-sans text-xs opacity-40 mt-0.5">{item.category}</p>}
                      </div>
                      <div className="text-right">
                        {item.price && <p className="font-mono text-sm text-accent">${item.price}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Hours */}
              <div className="py-6 hairline-b">
                <div className="flex items-center gap-3 mb-4"><Clock className="w-4 h-4 text-accent" /><span className="mono-label-sm opacity-60">BUSINESS HOURS</span></div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {formData.availability.map((day) => (
                    <div key={day.day_of_week} className={`px-3 py-2 text-center font-mono text-[10px] ${day.is_open ? 'bg-accent/10 text-accent hairline' : 'bg-card hairline text-muted-foreground/50'}`} style={{ letterSpacing: '0.1em' }}>
                      <p className="font-bold">{day.label.slice(0, 3).toUpperCase()}</p>
                      {day.is_open ? <p className="mt-0.5">{formatTime(day.open_time)}–{formatTime(day.close_time)}</p> : <p className="mt-0.5">CLOSED</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules (appointment/hybrid only) */}
              {formData.interaction_type !== 'order' && (
                <div className="py-6 hairline-b">
                  <div className="flex items-center gap-3 mb-4"><Settings2 className="w-4 h-4 text-accent" /><span className="mono-label-sm opacity-60">BOOKING RULES</span></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><span className="mono-label-sm opacity-30 block mb-1">MIN ADVANCE</span><p className="font-mono text-sm">{formData.min_advance_hours}h</p></div>
                    <div><span className="mono-label-sm opacity-30 block mb-1">MAX ADVANCE</span><p className="font-mono text-sm">{formData.max_advance_days}d</p></div>
                    <div><span className="mono-label-sm opacity-30 block mb-1">BUFFER</span><p className="font-mono text-sm">{formData.buffer_minutes}min</p></div>
                  </div>
                </div>
              )}

              {/* AI Booking Link */}
              <div className="py-6">
                <div className="flex items-center gap-3 mb-4"><Globe className="w-4 h-4 text-accent" /><span className="mono-label-sm opacity-60">YOUR AI BOOKING LINK</span></div>
                <p className="font-sans text-sm font-light opacity-50 mb-3">AI assistants will use this link to book for your customers.</p>
                <div className="bg-background hairline px-4 py-3">
                  <code className="text-accent font-mono text-sm break-all">
                    {typeof window !== 'undefined' ? window.location.origin : 'https://spadechat.com'}/api/mcp/{generatedSlug}
                  </code>
                </div>
              </div>
            </div>

            {/* Google Calendar OAuth notice */}
            {selectedBookingPlatformId === 'google_calendar' && (
              <div className="bg-accent/10 border border-accent/20 rounded-lg px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🔵</span>
                  <div>
                    <p className="text-sm font-mono text-foreground font-medium">One more step after launch</p>
                    <p className="text-xs font-sans text-white/50 mt-1">
                      You&apos;ll be asked to sign in with Google so AI assistants can create appointments directly on your calendar. This is what makes the magic happen — customers get booked automatically.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive font-mono">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 hairline-t">
          {currentStep > 0 ? (
            <Button variant="ghost" onClick={prevStep}><ArrowLeft className="w-4 h-4 mr-2" />BACK</Button>
          ) : (
            <div />
          )}

          {currentStep < STEP_LABELS.length - 1 ? (
            <Button onClick={nextStep} disabled={!canAdvance()}>NEXT<ArrowRight className="w-4 h-4 ml-2" /></Button>
          ) : (
            <Button onClick={handleLaunch} loading={isSubmitting} size="lg" variant="accent"><Rocket className="w-5 h-5 mr-2" />LAUNCH BUSINESS</Button>
          )}
        </div>
      </div>
    </div>
  )
}
