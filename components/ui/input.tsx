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
          <label htmlFor={id} className="mono-label text-white/30 mb-2 block">{label}</label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full bg-transparent border-0 pb-3 font-mono text-sm text-white placeholder:text-white/15 focus:outline-none transition-colors duration-300 rounded-none',
            error && 'focus:border-destructive',
            className
          )}
          style={{
            borderBottom: error
              ? '1px solid rgb(255, 51, 102)'
              : '1px solid rgba(255, 255, 255, 0.08)',
          }}
          {...props}
        />
        {error && <p className="text-destructive font-mono text-xs mt-2">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }
export type { InputProps }
