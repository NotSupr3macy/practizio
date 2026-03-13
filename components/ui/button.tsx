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
          'inline-flex items-center justify-center font-mono font-medium uppercase tracking-[0.3em] transition-all duration-300 rounded-none focus:outline-none',
          // Loading / disabled state
          (loading || disabled) && 'opacity-50 cursor-not-allowed',
          // Variants
          {
            'bg-white text-black hover:bg-accent hover:text-white': variant === 'solid',
            'bg-accent text-white hover:bg-accent-hover': variant === 'accent',
            'text-white hover:bg-white hover:text-black': variant === 'outline',
            'bg-transparent text-white hover:bg-white/5': variant === 'ghost',
            'bg-destructive text-white hover:bg-destructive/80': variant === 'destructive',
          },
          // Outline variant gets hairline border via style, but add base for layout
          variant === 'outline' && 'bg-transparent',
          // Sizes
          {
            'px-4 py-2 text-[10px]': size === 'sm',
            'px-6 py-3 text-[10px]': size === 'md',
            'px-8 py-4 text-[11px]': size === 'lg',
          },
          className
        )}
        style={variant === 'outline' ? { border: '0.5px solid rgba(255, 255, 255, 0.15)' } : undefined}
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
