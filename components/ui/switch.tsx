'use client'

import { cn } from '@/lib/utils'

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  className?: string
}

export function Switch({ checked, onCheckedChange, label, className }: SwitchProps) {
  return (
    <label className={cn('inline-flex items-center gap-3 cursor-pointer', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300',
          checked ? 'bg-[var(--primary-accent)]' : 'bg-[var(--border-light)]'
        )}
      >
        <span
          className={cn(
            'inline-block h-3.5 w-3.5 rounded-full transition-transform duration-300',
            checked ? 'translate-x-[22px] bg-white' : 'translate-x-1 bg-[var(--muted-text)]'
          )}
        />
      </button>
      {label && (
        <span className="font-mono text-[11px] text-[var(--muted-text)] uppercase tracking-[0.2em]">{label}</span>
      )}
    </label>
  )
}
