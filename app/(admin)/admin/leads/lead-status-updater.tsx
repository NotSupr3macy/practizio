'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const statuses = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'setup_in_progress', label: 'Setup in Progress' },
  { value: 'setup_complete', label: 'Setup Complete' },
  { value: 'not_interested', label: 'Not Interested' },
]

const statusColors: Record<string, string> = {
  new: 'text-[var(--primary-accent)] border-[var(--primary-accent)]',
  contacted: 'text-[var(--foreground)] border-[var(--border-light)]',
  setup_in_progress: 'text-amber-600 border-amber-400',
  setup_complete: 'text-emerald-600 border-emerald-400',
  not_interested: 'text-red-600 border-red-400',
}

export function LeadStatusUpdater({
  leadId,
  currentStatus,
}: {
  leadId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(currentStatus)

  const handleChange = async (newStatus: string) => {
    setLoading(true)
    setStatus(newStatus)

    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      })

      if (!res.ok) {
        setStatus(currentStatus)
      } else {
        router.refresh()
      }
    } catch {
      setStatus(currentStatus)
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={loading}
      className={`appearance-none bg-white px-2.5 py-1 rounded-[2px] cursor-pointer focus:outline-none transition-all ${
        statusColors[status] || 'text-[var(--foreground)] border-[var(--border-light)]'
      } ${loading ? 'opacity-40' : ''}`}
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '9px',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        border: '1px solid',
      }}
    >
      {statuses.map((s) => (
        <option
          key={s.value}
          value={s.value}
          className="bg-white text-[var(--foreground)]"
        >
          {s.label}
        </option>
      ))}
    </select>
  )
}
