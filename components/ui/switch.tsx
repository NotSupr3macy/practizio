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
          checked ? 'bg-accent' : 'bg-white/10'
        )}
      >
        <span
          className={cn(
            'inline-block h-3.5 w-3.5 rounded-full transition-transform duration-300',
            checked ? 'translate-x-[22px] bg-black' : 'translate-x-1 bg-white/60'
          )}
        />
      </button>
      {label && (
        <span className="font-mono text-[11px] text-white/40 uppercase" style={{ letterSpacing: '0.15em' }}>{label}</span>
      )}
    </label>
  )
}
