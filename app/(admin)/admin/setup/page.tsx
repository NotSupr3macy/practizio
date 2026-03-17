'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Check, AlertCircle } from 'lucide-react'

export default function AdminSetupPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    industry: '',
    interaction_type: 'appointment',
    phone: '',
    website: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  })

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          industry: form.industry,
          interaction_type: form.interaction_type,
          phone: form.phone || null,
          website: form.website || null,
          address: {
            street: form.street,
            city: form.city,
            state: form.state,
            zip: form.zip,
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create business')
      } else {
        setSuccess(form.email)
        setForm({
          name: '',
          email: '',
          industry: '',
          interaction_type: 'appointment',
          phone: '',
          website: '',
          street: '',
          city: '',
          state: '',
          zip: '',
        })
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl text-[var(--foreground)]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
          Concierge Setup
        </h1>
        <p className="mt-2 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
          CREATE A BUSINESS ON BEHALF OF A CLIENT
        </p>
      </div>

      {/* Success */}
      {success && (
        <div className="bg-white border border-[var(--border-light)] rounded-[2px] p-6 flex items-start gap-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(61, 112, 104, 0.1)' }}>
            <Check className="w-4 h-4 text-[var(--primary-accent)]" />
          </div>
          <div>
            <p className="text-sm text-[var(--primary-accent)] font-medium" style={{ fontFamily: "'Space Mono', monospace" }}>
              Business created successfully!
            </p>
            <p className="text-sm text-[var(--muted-text)] mt-1" style={{ fontFamily: "'Space Mono', monospace" }}>
              Invite email sent to{' '}
              <span className="text-[var(--foreground)]">{success}</span>
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-white border border-[var(--border-light)] rounded-[2px] p-6 flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <p className="text-sm text-destructive font-medium" style={{ fontFamily: "'Space Mono', monospace" }}>
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[var(--border-light)] rounded-[2px] p-8 space-y-8">
        <div className="space-y-6">
          <h2 className="text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>BUSINESS INFO</h2>

          <Input
            label="Business Name"
            placeholder="Acme Dental Clinic"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
          />

          <Input
            label="Owner Email"
            type="email"
            placeholder="owner@example.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
          />

          <Input
            label="Industry"
            placeholder="e.g. Hair Salon, Dental Office, Yoga Studio"
            value={form.industry}
            onChange={(e) => update('industry', e.target.value)}
            required
          />

          <Select
            label="Interaction Type"
            value={form.interaction_type}
            onChange={(e) => update('interaction_type', e.target.value)}
            options={[
              { value: 'appointment', label: 'Appointment-based' },
              { value: 'order', label: 'Order-based' },
              { value: 'hybrid', label: 'Hybrid (Both)' },
            ]}
          />

          <Input
            label="Phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />

          <Input
            label="Website"
            type="url"
            placeholder="https://example.com"
            value={form.website}
            onChange={(e) => update('website', e.target.value)}
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>ADDRESS</h2>

          <Input
            label="Street"
            placeholder="123 Main St"
            value={form.street}
            onChange={(e) => update('street', e.target.value)}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="City"
              placeholder="San Francisco"
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
            />
            <Input
              label="State"
              placeholder="CA"
              value={form.state}
              onChange={(e) => update('state', e.target.value)}
            />
            <Input
              label="ZIP"
              placeholder="94102"
              value={form.zip}
              onChange={(e) => update('zip', e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="solid"
          size="lg"
          loading={loading}
          className="w-full"
        >
          CREATE BUSINESS
        </Button>
      </form>
    </div>
  )
}
