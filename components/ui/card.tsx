import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ className, hover, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-[var(--border-light)] rounded-[2px]',
        hover && 'transition-all duration-300 hover:border-[var(--primary-accent)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4 border-b border-[var(--border-light)]', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('font-[Playfair_Display] font-light text-lg text-[var(--foreground)]', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('font-mono text-sm text-[var(--muted-text)] mt-1 uppercase tracking-[0.2em] text-[10px]', className)} {...props}>
      {children}
    </p>
  )
}
