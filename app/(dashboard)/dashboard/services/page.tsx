'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { Service } from '@/types/database'
import { Plus, Pencil, Trash2, X, Clock, DollarSign } from 'lucide-react'

interface ServiceForm {
  name: string
  price_min: string
  price_max: string
  duration_minutes: string
  description: string
}

const emptyForm: ServiceForm = {
  name: '',
  price_min: '',
  price_max: '',
  duration_minutes: '',
  description: '',
}

export default function ServicesPage() {
  const supabase = createClient()
  const [services, setServices] = useState<Service[]>([])
  const [practiceId, setPracticeId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ServiceForm>(emptyForm)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data: practice } = await supabase
      .from('practices')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!practice) return
    setPracticeId(practice.id)

    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('practice_id', practice.id)
      .order('name')

    setServices(data || [])
    setLoading(false)
  }

  function handleEdit(service: Service) {
    setForm({
      name: service.name,
      price_min: service.price_min?.toString() || '',
      price_max: service.price_max?.toString() || '',
      duration_minutes: service.duration_minutes?.toString() || '',
      description: service.description || '',
    })
    setEditingId(service.id)
    setShowForm(true)
  }

  function handleCancel() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  async function handleSave() {
    if (!practiceId || !form.name.trim()) return
    setSaving(true)

    const payload = {
      practice_id: practiceId,
      name: form.name.trim(),
      price_min: form.price_min ? parseInt(form.price_min) : null,
      price_max: form.price_max ? parseInt(form.price_max) : null,
      duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null,
      description: form.description.trim() || null,
    }

    if (editingId) {
      await supabase.from('services').update(payload).eq('id', editingId)
    } else {
      await supabase.from('services').insert(payload)
    }

    handleCancel()
    setSaving(false)
    loadData()
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this service?')) return
    await supabase.from('services').delete().eq('id', id)
    loadData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)]">LOADING SERVICES</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] block mb-3">SERVICE MANAGEMENT</span>
          <h1 className="font-['Playfair_Display'] font-light text-3xl text-[var(--foreground)]">SERVICES</h1>
          <p className="font-['Space_Mono'] text-sm text-[var(--muted-text)] mt-2">
            Manage the services AI agents can see and book
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Service
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white border border-[var(--primary-accent)]/20 rounded-[2px]">
          <div className="p-6 border-b border-[var(--border-light)]">
            <div className="flex items-center justify-between">
              <h3 className="font-['Playfair_Display'] font-light text-lg text-[var(--foreground)]">{editingId ? 'Edit Service' : 'New Service'}</h3>
              <button
                onClick={handleCancel}
                className="p-1 text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <Input
              id="service-name"
              label="Service Name"
              placeholder="e.g., Dental Cleaning"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                id="service-price-min"
                label="Min Price (cents)"
                type="number"
                placeholder="10000"
                value={form.price_min}
                onChange={(e) => setForm({ ...form, price_min: e.target.value })}
              />
              <Input
                id="service-price-max"
                label="Max Price (cents)"
                type="number"
                placeholder="25000"
                value={form.price_max}
                onChange={(e) => setForm({ ...form, price_max: e.target.value })}
              />
              <Input
                id="service-duration"
                label="Duration (minutes)"
                type="number"
                placeholder="60"
                value={form.duration_minutes}
                onChange={(e) =>
                  setForm({ ...form, duration_minutes: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="service-description"
                className="block text-sm text-[var(--muted-text)]"
              >
                Description
              </label>
              <textarea
                id="service-description"
                rows={3}
                placeholder="Describe this service for AI agents..."
                className="w-full px-4 py-2.5 bg-white border border-[var(--border-light)] rounded-[2px] text-[var(--foreground)] font-['Space_Mono'] text-sm placeholder:text-[var(--muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]/50 focus:border-[var(--primary-accent)]/50 transition-all duration-200 resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} loading={saving} disabled={!form.name.trim()}>
                {editingId ? 'Update Service' : 'Add Service'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Services Table */}
      {services.length > 0 ? (
        <div className="bg-white border border-[var(--border-light)] rounded-[2px]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-light)]">
                  <th className="text-left text-xs font-['Space_Mono'] text-[var(--muted-text)] py-3 px-4">
                    Service
                  </th>
                  <th className="text-left text-xs font-['Space_Mono'] text-[var(--muted-text)] py-3 px-4">
                    Price Range
                  </th>
                  <th className="text-left text-xs font-['Space_Mono'] text-[var(--muted-text)] py-3 px-4">
                    Duration
                  </th>
                  <th className="text-left text-xs font-['Space_Mono'] text-[var(--muted-text)] py-3 px-4">
                    Description
                  </th>
                  <th className="text-right text-xs font-['Space_Mono'] text-[var(--muted-text)] py-3 px-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-[var(--border-light)] hover:bg-[var(--cream)] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="text-sm font-['Space_Mono'] text-[var(--foreground)] font-medium">
                        {service.name}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3 h-3 text-green-600" />
                        <span className="text-sm font-['Space_Mono'] text-[var(--foreground)]">
                          {service.price_min && service.price_max
                            ? `${formatCurrency(service.price_min)} - ${formatCurrency(service.price_max)}`
                            : service.price_min
                              ? formatCurrency(service.price_min)
                              : 'Not set'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[var(--primary-accent)]" />
                        <span className="text-sm font-['Space_Mono'] text-[var(--foreground)]">
                          {service.duration_minutes
                            ? `${service.duration_minutes} min`
                            : 'Not set'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-['Space_Mono'] text-[var(--muted-text)] line-clamp-1 max-w-[200px]">
                        {service.description || '--'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="p-1.5 text-[var(--muted-text)] hover:text-[var(--primary-accent)] hover:bg-[rgba(61,112,104,0.1)] transition-all rounded-[2px]"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-1.5 text-[var(--muted-text)] hover:text-[#c0392b] hover:bg-[#c0392b]/10 transition-all rounded-[2px]"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[var(--border-light)] rounded-[2px] text-center py-12">
          <DollarSign className="w-10 h-10 text-[var(--muted-text)] mx-auto mb-3" />
          <p className="text-sm font-['Space_Mono'] text-[var(--muted-text)] mb-4">
            No services added yet. Add your first service so AI agents can show it to patients.
          </p>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Service
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
