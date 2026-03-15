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
        'inline-flex items-center px-2.5 py-1 font-mono text-[9px] font-medium uppercase rounded-full',
        {
          'bg-white/5 text-white/50': variant === 'default',
          'bg-accent/10 text-accent': variant === 'accent' || variant === 'success',
          'bg-neon-pink/10 text-neon-pink': variant === 'warning',
          'bg-destructive/10 text-destructive': variant === 'destructive',
        },
        className
      )}
      style={{ letterSpacing: '0.15em' }}
    >
      {children}
    </span>
  )
}
