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
  new: 'text-accent border-accent/30 bg-accent/5',
  contacted: 'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/5',
  setup_in_progress: 'text-neon-pink border-neon-pink/30 bg-neon-pink/5',
  setup_complete: 'text-accent border-accent/30 bg-accent/5',
  not_interested: 'text-destructive border-destructive/30 bg-destructive/5',
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
      className={`appearance-none bg-transparent font-mono text-[9px] font-medium uppercase px-2.5 py-1 rounded-full cursor-pointer focus:outline-none transition-all ${
        statusColors[status] || 'text-white/50 border-white/10 bg-white/5'
      } ${loading ? 'opacity-40' : ''}`}
      style={{
        letterSpacing: '0.15em',
        border: '1px solid',
      }}
    >
      {statuses.map((s) => (
        <option
          key={s.value}
          value={s.value}
          className="bg-[#0c0c0c] text-white"
        >
          {s.label}
        </option>
      ))}
    </select>
  )
}
