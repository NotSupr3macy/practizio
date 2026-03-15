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
          'inline-flex items-center justify-center font-mono font-medium uppercase tracking-[0.2em] transition-all duration-400 rounded-lg focus:outline-none',
          (loading || disabled) && 'opacity-40 cursor-not-allowed',
          {
            'bg-accent text-black hover:shadow-[0_0_30px_rgba(40,105,169,0.4)] hover:translate-y-[-1px]': variant === 'solid',
            'bg-gradient-to-r from-accent to-neon-cyan text-black hover:shadow-[0_0_30px_rgba(40,105,169,0.3)]': variant === 'accent',
            'text-white/60 hover:text-white hover:bg-white/5': variant === 'outline',
            'bg-transparent text-white/40 hover:text-white hover:bg-white/[0.03]': variant === 'ghost',
            'bg-destructive text-white hover:bg-destructive/80 hover:shadow-[0_0_20px_rgba(255,51,102,0.3)]': variant === 'destructive',
          },
          {
            'px-4 py-2 text-[10px]': size === 'sm',
            'px-6 py-3 text-[10px]': size === 'md',
            'px-8 py-4 text-[11px]': size === 'lg',
          },
          className
        )}
        style={variant === 'outline' ? { border: '1px solid rgba(255, 255, 255, 0.08)' } : undefined}
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
