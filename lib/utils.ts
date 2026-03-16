import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export function formatDate(date: string | Date): string {
  // For date-only strings like "2026-03-19", append T12:00:00 to avoid
  // timezone shift (JS parses date-only strings as UTC midnight, which
  // shifts back a day in western timezones when formatted locally)
  const d = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(date + 'T12:00:00')
    : new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

export function generateSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const suffix = Math.random().toString(36).substring(2, 6)
  return `${slug}-${suffix}`
}

export function generateConfirmationNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'PZ-'
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function getProfileCompleteness(practice: {
  name?: string | null
  phone?: string | null
  website?: string | null
  address?: unknown
  industry?: string | null
  tags?: string[] | null
}): number {
  const fields = [
    !!practice.name,
    !!practice.phone,
    !!practice.website,
    !!practice.address,
    !!(practice.industry && practice.industry.trim()),
    !!(practice.tags && practice.tags.length > 0),
  ]
  return Math.round((fields.filter(Boolean).length / fields.length) * 100)
}
