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
          <label htmlFor={id} className="mono-label opacity-60 mb-2 block">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full appearance-none bg-transparent pb-3 font-mono text-sm text-white focus:outline-none transition-colors duration-300 cursor-pointer rounded-none',
              className
            )}
            style={{
              borderBottom: error
                ? '0.5px solid rgb(239, 68, 68)'
                : '0.5px solid rgba(255, 255, 255, 0.15)',
            }}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-black text-white">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 pointer-events-none" />
        </div>
        {error && <p className="text-destructive font-mono text-xs mt-2">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
export { Select }
