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
          'relative inline-flex h-5 w-10 items-center transition-colors duration-300',
          checked ? 'bg-accent' : 'bg-white/10'
        )}
        style={{ border: '0.5px solid rgba(255, 255, 255, 0.15)' }}
      >
        <span
          className={cn(
            'inline-block h-3 w-3 bg-white transition-transform duration-300',
            checked ? 'translate-x-[22px]' : 'translate-x-1'
          )}
        />
      </button>
      {label && (
        <span className="font-mono text-[11px] opacity-60 uppercase" style={{ letterSpacing: '0.2em' }}>
          {label}
        </span>
      )}
    </label>
  )
}
