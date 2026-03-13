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
        'inline-flex items-center px-2 py-0.5 font-mono text-[9px] font-medium uppercase',
        {
          'bg-white/5 text-white/60': variant === 'default',
          'bg-accent/10 text-accent': variant === 'accent',
          'bg-green-500/10 text-green-500': variant === 'success',
          'bg-yellow-500/10 text-yellow-500': variant === 'warning',
          'bg-red-500/10 text-red-500': variant === 'destructive',
        },
        className
      )}
      style={{ letterSpacing: '0.2em' }}
    >
      {children}
    </span>
  )
}
