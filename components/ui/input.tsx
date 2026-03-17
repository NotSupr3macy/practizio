'use client'

import { cn } from '@/lib/utils'
import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-text)] mb-2 block">{label}</label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full bg-transparent border-0 border-b pb-3 font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--muted-text)]/40 focus:outline-none transition-colors duration-300 rounded-none',
            error ? 'border-b-red-600 focus:border-b-red-600' : 'border-b-[var(--border-light)] focus:border-b-[var(--primary-accent)]',
            className
          )}
          {...props}
        />
        {error && <p className="text-red-600 font-mono text-xs mt-2 uppercase tracking-[0.2em]">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }
export type { InputProps }
