'use client'

import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-text)] mb-2 block">{label}</label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full appearance-none bg-transparent border-0 border-b pb-3 font-mono text-sm text-[var(--foreground)] focus:outline-none transition-colors duration-300 cursor-pointer rounded-none',
              error ? 'border-b-red-600' : 'border-b-[var(--border-light)] focus:border-b-[var(--primary-accent)]',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-white text-[var(--foreground)]">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-text)] pointer-events-none" />
        </div>
        {error && <p className="text-red-600 font-mono text-xs mt-2 uppercase tracking-[0.2em]">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
export { Select }
