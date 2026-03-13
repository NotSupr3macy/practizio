'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import { formatTime } from '@/lib/utils'
import {
  Building2,
  Clock,
  Plus,
  Rocket,
  Stethoscope,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Globe,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type PracticeType = 'dental' | 'medical' | 'legal' | 'financial' | 'other' | ''

interface ServiceEntry {
  name: string
  price_min: string
  price_max: string
  duration_minutes: string
  description: string
}

interface DayAvailability {
  day_of_week: number
  label: string
  is_open: boolean
  open_time: string
  close_time: string
}

interface FormData {
  name: string
  practice_type: PracticeType
  phone: string
  website: string
  address_street: string
  address_city: string
  address_state: string
  address_zip: string
  services: ServiceEntry[]
  availability: DayAvailability[]
}

const PRACTICE_TYPE_OPTIONS = [
  { value: '', label: 'Select practice type...' },
  { value: 'dental', label: 'Dental Practice' },
  { value: 'medical', label: 'Medical Practice' },
  { value: 'legal', label: 'Legal Practice' },
  { value: 'financial', label: 'Financial Practice' },
  { value: 'other', label: 'Other' },
]

const DEFAULT_SERVICES: Record<string, ServiceEntry[]> = {
  dental: [
    {
      name: 'Dental Cleaning',
      price_min: '100',
      price_max: '200',
      duration_minutes: '60',
      description: 'Professional teeth cleaning and oral exam',
    },
  ],
  medical: [
    {
      name: 'General Consultation',
      price_min: '150',
      price_max: '300',
      duration_minutes: '30',
      description: 'Comprehensive health evaluation and consultation',
    },
  ],
  legal: [
    {
      name: 'Initial Consultation',
      price_min: '200',
      price_max: '500',
      duration_minutes: '60',
      description: 'Review of legal matter and preliminary advice',
    },
  ],
  financial: [
    {
      name: 'Financial Planning Session',
      price_min: '250',
      price_max: '500',
      duration_minutes: '60',
      description: 'Comprehensive review of financial goals and strategy',
    },
  ],
  other: [
    {
      name: '',
      price_min: '',
      price_max: '',
      duration_minutes: '30',
      description: '',
    },
  ],
}

const DAY_LABELS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

function buildDefaultAvailability(): DayAvailability[] {
  return DAY_LABELS.map((label, index) => ({
    day_of_week: index,
    label,
    is_open: index >= 1 && index <= 5,
    open_time: '09:00',
    close_time: '17:00',
  }))
}

const STEP_LABELS = ['PRACTICE_INFO', 'SERVICES', 'AVAILABILITY', 'LAUNCH']
const STEP_NUMBERS = ['01', '02', '03', '04']

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    name: '',
    practice_type: '' as PracticeType,
    phone: '',
    website: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zip: '',
    services: [
      {
        name: '',
        price_min: '',
        price_max: '',
        duration_minutes: '30',
        description: '',
      },
    ],
    availability: buildDefaultAvailability(),
  })

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function updateService(index: number, field: keyof ServiceEntry, value: string) {
    setFormData((prev) => {
      const updated = [...prev.services]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, services: updated }
    })
  }

  function addService() {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          name: '',
          price_min: '',
          price_max: '',
          duration_minutes: '30',
          description: '',
        },
      ],
    }))
  }

  function removeService(index: number) {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }))
  }

  function updateAvailability(
    index: number,
    field: keyof DayAvailability,
    value: string | boolean
  ) {
    setFormData((prev) => {
      const updated = [...prev.availability]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, availability: updated }
    })
  }

  function handlePracticeTypeChange(value: string) {
    const practiceType = value as PracticeType
    updateField('practice_type', practiceType)
    if (practiceType && DEFAULT_SERVICES[practiceType]) {
      updateField('services', [...DEFAULT_SERVICES[practiceType]])
    }
  }

  function canAdvance(): boolean {
    if (currentStep === 0) {
      return formData.name.trim() !== '' && formData.practice_type !== ''
    }
    if (currentStep === 1) {
      return formData.services.some((s) => s.name.trim() !== '')
    }
    return true
  }

  function nextStep() {
    if (currentStep < 3 && canAdvance()) {
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
      const hasAddress =
        formData.address_street.trim() ||
        formData.address_city.trim() ||
        formData.address_state.trim() ||
        formData.address_zip.trim()

      const payload = {
        name: formData.name.trim(),
        practice_type: formData.practice_type,
        phone: formData.phone.trim() || null,
        website: formData.website.trim() || null,
        address: hasAddress
          ? {
              street: formData.address_street.trim(),
              city: formData.address_city.trim(),
              state: formData.address_state.trim(),
              zip: formData.address_zip.trim(),
            }
          : null,
        services: formData.services
          .filter((s) => s.name.trim() !== '')
          .map((s) => ({
            name: s.name.trim(),
            price_min: s.price_min ? Number(s.price_min) : null,
            price_max: s.price_max ? Number(s.price_max) : null,
            duration_minutes: s.duration_minutes ? Number(s.duration_minutes) : null,
            description: s.description.trim() || null,
          })),
        availability: formData.availability.map((a) => ({
          day_of_week: a.day_of_week,
          open_time: a.open_time,
          close_time: a.close_time,
          is_open: a.is_open,
        })),
      }

      const response = await fetch('/api/practices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create practice')
      }

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const generatedSlug = formData.name
    ? formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    : 'your-practice'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Step progress bar */}
      <div className="hairline-b">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <span className="mono-label-sm opacity-40 block mb-3">PRACTICE_SETUP</span>
          <h1 className="font-display font-black uppercase text-2xl tracking-tightest mb-8">
            INITIALIZE YOUR PRACTICE
          </h1>

          <div className="flex items-center">
            {STEP_LABELS.map((label, index) => {
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <div key={label} className="flex items-center flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-8 h-8 shrink-0 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-accent text-background'
                          : isActive
                          ? 'hairline text-accent'
                          : 'hairline text-muted-foreground'
                      }`}
                    >
                      <span className="font-mono text-[10px] font-bold" style={{ letterSpacing: '0.05em' }}>
                        {STEP_NUMBERS[index]}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-[10px] font-medium hidden sm:block transition-colors duration-300 uppercase ${
                        isActive
                          ? 'text-accent'
                          : isCompleted
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                      style={{ letterSpacing: '0.15em' }}
                    >
                      {label}
                    </span>
                  </div>
                  {index < STEP_LABELS.length - 1 && (
                    <div
                      className={`h-px flex-1 mx-3 transition-colors duration-300 ${
                        index < currentStep ? 'bg-accent' : 'bg-white/10'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto px-6 py-8 w-full">
        {/* Step 0: Practice Info */}
        {currentStep === 0 && (
          <div className="animate-fade-in space-y-8">
            <div>
              <span className="mono-label-sm opacity-40 block mb-2">STEP_01</span>
              <h2 className="font-display font-black uppercase text-xl tracking-tightest">
                PRACTICE INFORMATION
              </h2>
              <p className="font-sans text-sm font-light opacity-50 mt-2">
                Tell us about your practice so AI agents can find and recommend you.
              </p>
            </div>

            <div className="space-y-5">
              <Input
                id="practice-name"
                label="Practice Name *"
                placeholder="e.g. Bright Smile Dental"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
              />

              <Select
                id="practice-type"
                label="Practice Type *"
                options={PRACTICE_TYPE_OPTIONS}
                value={formData.practice_type}
                onChange={(e) => handlePracticeTypeChange(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
                <Input
                  id="website"
                  label="Website"
                  type="url"
                  placeholder="https://yourpractice.com"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                />
              </div>

              <div className="hairline-t pt-5">
                <span className="mono-label-sm opacity-40 block mb-4">ADDRESS</span>
                <div className="space-y-4">
                  <Input
                    id="street"
                    label="Street Address"
                    placeholder="123 Main Street, Suite 100"
                    value={formData.address_street}
                    onChange={(e) => updateField('address_street', e.target.value)}
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="col-span-2 sm:col-span-2">
                      <Input
                        id="city"
                        label="City"
                        placeholder="New York"
                        value={formData.address_city}
                        onChange={(e) => updateField('address_city', e.target.value)}
                      />
                    </div>
                    <Input
                      id="state"
                      label="State"
                      placeholder="NY"
                      value={formData.address_state}
                      onChange={(e) => updateField('address_state', e.target.value)}
                    />
                    <Input
                      id="zip"
                      label="ZIP Code"
                      placeholder="10001"
                      value={formData.address_zip}
                      onChange={(e) => updateField('address_zip', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Services */}
        {currentStep === 1 && (
          <div className="animate-fade-in space-y-8">
            <div>
              <span className="mono-label-sm opacity-40 block mb-2">STEP_02</span>
              <h2 className="font-display font-black uppercase text-xl tracking-tightest">
                SERVICES
              </h2>
              <p className="font-sans text-sm font-light opacity-50 mt-2">
                Add the services AI agents can book for your clients. You can always
                edit these later.
              </p>
            </div>

            <div className="space-y-4">
              {formData.services.map((service, index) => (
                <Card key={index} className="relative p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Input
                          id={`service-name-${index}`}
                          label="Service Name *"
                          placeholder="e.g. Teeth Cleaning"
                          value={service.name}
                          onChange={(e) =>
                            updateService(index, 'name', e.target.value)
                          }
                        />
                      </div>
                      {formData.services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="mt-7 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        id={`service-price-min-${index}`}
                        label="Min Price ($)"
                        type="number"
                        placeholder="100"
                        value={service.price_min}
                        onChange={(e) =>
                          updateService(index, 'price_min', e.target.value)
                        }
                      />
                      <Input
                        id={`service-price-max-${index}`}
                        label="Max Price ($)"
                        type="number"
                        placeholder="200"
                        value={service.price_max}
                        onChange={(e) =>
                          updateService(index, 'price_max', e.target.value)
                        }
                      />
                      <Input
                        id={`service-duration-${index}`}
                        label="Duration (min)"
                        type="number"
                        placeholder="60"
                        value={service.duration_minutes}
                        onChange={(e) =>
                          updateService(index, 'duration_minutes', e.target.value)
                        }
                      />
                    </div>

                    <Input
                      id={`service-description-${index}`}
                      label="Description"
                      placeholder="Brief description of this service..."
                      value={service.description}
                      onChange={(e) =>
                        updateService(index, 'description', e.target.value)
                      }
                    />
                  </div>
                </Card>
              ))}

              <Button
                variant="outline"
                onClick={addService}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                ADD_SERVICE
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Availability */}
        {currentStep === 2 && (
          <div className="animate-fade-in space-y-8">
            <div>
              <span className="mono-label-sm opacity-40 block mb-2">STEP_03</span>
              <h2 className="font-display font-black uppercase text-xl tracking-tightest">
                AVAILABILITY
              </h2>
              <p className="font-sans text-sm font-light opacity-50 mt-2">
                Set your weekly availability so AI agents know when to schedule
                appointments.
              </p>
            </div>

            <div className="space-y-0">
              {formData.availability.map((day, index) => (
                <div
                  key={day.day_of_week}
                  className={`flex items-center gap-4 px-4 py-4 hairline-b transition-all duration-200 ${
                    day.is_open ? '' : 'opacity-50'
                  }`}
                >
                  <Switch
                    checked={day.is_open}
                    onCheckedChange={(checked) =>
                      updateAvailability(index, 'is_open', checked)
                    }
                  />

                  <span
                    className="font-mono text-[10px] font-medium w-28 uppercase"
                    style={{ letterSpacing: '0.2em' }}
                  >
                    {day.label.toUpperCase()}
                  </span>

                  {day.is_open ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={day.open_time}
                        onChange={(e) =>
                          updateAvailability(index, 'open_time', e.target.value)
                        }
                        className="bg-transparent hairline-b px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-accent transition-all"
                      />
                      <span className="text-muted-foreground text-xs font-mono uppercase" style={{ letterSpacing: '0.15em' }}>to</span>
                      <input
                        type="time"
                        value={day.close_time}
                        onChange={(e) =>
                          updateAvailability(index, 'close_time', e.target.value)
                        }
                        className="bg-transparent hairline-b px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-accent transition-all"
                      />
                    </div>
                  ) : (
                    <span className="font-mono text-[10px] opacity-30 uppercase" style={{ letterSpacing: '0.2em' }}>
                      CLOSED
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Review & Launch */}
        {currentStep === 3 && (
          <div className="animate-fade-in space-y-8">
            <div>
              <span className="mono-label-sm opacity-40 block mb-2">STEP_04</span>
              <h2 className="font-display font-black uppercase text-xl tracking-tightest">
                REVIEW & LAUNCH
              </h2>
              <p className="font-sans text-sm font-light opacity-50 mt-2">
                Everything looks great. Review your setup and go live.
              </p>
            </div>

            <div className="space-y-0">
              {/* Practice Details Review */}
              <div className="py-6 hairline-b">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-4 h-4 text-accent" />
                  <span className="mono-label-sm opacity-60">PRACTICE_DETAILS</span>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <span className="mono-label-sm opacity-30 block mb-1">NAME</span>
                    <p className="text-foreground font-mono text-sm">{formData.name}</p>
                  </div>
                  <div>
                    <span className="mono-label-sm opacity-30 block mb-1">TYPE</span>
                    <p className="text-foreground font-mono text-sm uppercase">
                      {formData.practice_type}
                    </p>
                  </div>
                  {formData.phone && (
                    <div>
                      <span className="mono-label-sm opacity-30 block mb-1">PHONE</span>
                      <p className="text-foreground font-mono text-sm">{formData.phone}</p>
                    </div>
                  )}
                  {formData.website && (
                    <div>
                      <span className="mono-label-sm opacity-30 block mb-1">WEBSITE</span>
                      <p className="text-foreground font-mono text-sm">{formData.website}</p>
                    </div>
                  )}
                  {formData.address_street && (
                    <div className="col-span-2">
                      <span className="mono-label-sm opacity-30 block mb-1">ADDRESS</span>
                      <p className="text-foreground font-mono text-sm">
                        {formData.address_street}
                        {formData.address_city && `, ${formData.address_city}`}
                        {formData.address_state && `, ${formData.address_state}`}
                        {formData.address_zip && ` ${formData.address_zip}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Services Review */}
              <div className="py-6 hairline-b">
                <div className="flex items-center gap-3 mb-4">
                  <Stethoscope className="w-4 h-4 text-accent" />
                  <span className="mono-label-sm opacity-60">
                    SERVICES ({formData.services.filter((s) => s.name.trim()).length})
                  </span>
                </div>
                <div className="space-y-0">
                  {formData.services
                    .filter((s) => s.name.trim())
                    .map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 hairline-b last:border-b-0"
                      >
                        <div>
                          <p className="text-foreground font-mono text-sm">
                            {service.name}
                          </p>
                          {service.description && (
                            <p className="font-sans text-xs opacity-40 mt-0.5">
                              {service.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {(service.price_min || service.price_max) && (
                            <p className="text-accent font-mono text-sm">
                              {service.price_min && service.price_max
                                ? `$${service.price_min}–$${service.price_max}`
                                : service.price_min
                                ? `FROM_$${service.price_min}`
                                : `UP_TO_$${service.price_max}`}
                            </p>
                          )}
                          {service.duration_minutes && (
                            <p className="font-mono text-[10px] opacity-30 uppercase" style={{ letterSpacing: '0.15em' }}>
                              {service.duration_minutes}_MIN
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Availability Review */}
              <div className="py-6 hairline-b">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="mono-label-sm opacity-60">BUSINESS_HOURS</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {formData.availability.map((day) => (
                    <div
                      key={day.day_of_week}
                      className={`px-3 py-2 text-center font-mono text-[10px] ${
                        day.is_open
                          ? 'bg-accent/10 text-accent hairline'
                          : 'bg-card hairline text-muted-foreground/50'
                      }`}
                      style={{ letterSpacing: '0.1em' }}
                    >
                      <p className="font-bold">{day.label.slice(0, 3).toUpperCase()}</p>
                      {day.is_open ? (
                        <p className="mt-0.5">
                          {formatTime(day.open_time)}–{formatTime(day.close_time)}
                        </p>
                      ) : (
                        <p className="mt-0.5">CLOSED</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* MCP Endpoint Preview */}
              <div className="py-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-4 h-4 text-accent" />
                  <span className="mono-label-sm opacity-60">MCP_ENDPOINT</span>
                </div>
                <p className="font-sans text-sm font-light opacity-50 mb-3">
                  AI agents will connect to your practice through this endpoint.
                </p>
                <div className="bg-background hairline px-4 py-3">
                  <code className="text-accent font-mono text-sm break-all">
                    https://mcp.practizio.com/p/{generatedSlug}
                  </code>
                </div>
              </div>
            </div>

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
            <Button variant="ghost" onClick={prevStep}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <Button
              onClick={nextStep}
              disabled={!canAdvance()}
            >
              NEXT
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleLaunch}
              loading={isSubmitting}
              size="lg"
              variant="accent"
            >
              <Rocket className="w-5 h-5 mr-2" />
              LAUNCH_PRACTICE
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
