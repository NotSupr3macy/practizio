import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down'
  icon: LucideIcon
  className?: string
}

export function StatCard({ title, value, change, trend, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn('bg-white border border-[var(--border-light)] rounded-[2px] p-4 sm:p-6 transition-all duration-300 hover:border-[var(--primary-accent)]', className)}>
      <div className="flex items-center justify-between mb-3 sm:mb-6">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--muted-text)]">{title.toUpperCase()}</span>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] border border-[var(--border-light)] flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--primary-accent)]" />
        </div>
      </div>
      <div className="font-[Playfair_Display] font-light text-2xl sm:text-4xl text-[var(--foreground)] truncate">{value}</div>
      {change && (
        <div className="flex items-center gap-1.5 mt-3">
          {trend === 'up' ? (
            <TrendingUp className="w-3 h-3 text-[var(--primary-accent)]" />
          ) : trend === 'down' ? (
            <TrendingDown className="w-3 h-3 text-red-600" />
          ) : null}
          <span className={cn('font-mono text-[9px] uppercase tracking-[0.25em]', trend === 'up' ? 'text-[var(--primary-accent)]' : trend === 'down' ? 'text-red-600' : 'text-[var(--muted-text)]')}>
            {change.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}
