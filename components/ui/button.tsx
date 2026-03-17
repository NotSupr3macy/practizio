'use client'

import { cn } from '@/lib/utils'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'accent' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'solid', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-mono font-medium uppercase tracking-[0.25em] transition-all duration-300 rounded-[2px] focus:outline-none text-[10px]',
          (loading || disabled) && 'opacity-40 cursor-not-allowed',
          {
            'bg-[var(--primary-accent)] text-white hover:opacity-90': variant === 'solid' || variant === 'accent',
            'border border-[var(--border-light)] text-[var(--foreground)] bg-transparent hover:bg-[var(--cream)]': variant === 'outline',
            'bg-transparent text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--cream)]': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
          },
          {
            'px-4 py-2 text-[10px]': size === 'sm',
            'px-6 py-3 text-[10px]': size === 'md',
            'px-8 py-4 text-[11px]': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
export type { ButtonProps }
