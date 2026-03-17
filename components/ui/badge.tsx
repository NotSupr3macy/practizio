import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'destructive'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 font-mono text-[9px] font-medium uppercase rounded-[2px] tracking-[0.2em]',
        {
          'bg-[var(--cream)] text-[var(--muted-text)] border border-[var(--border-light)]': variant === 'default',
          'bg-[var(--primary-accent)]/10 text-[var(--primary-accent)]': variant === 'accent' || variant === 'success',
          'bg-amber-50 text-amber-700': variant === 'warning',
          'bg-red-50 text-red-600': variant === 'destructive',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
