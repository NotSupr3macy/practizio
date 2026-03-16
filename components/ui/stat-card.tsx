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
    <div className={cn('card-metal rounded-xl p-4 sm:p-6 card-interactive', className)}>
      <div className="flex items-center justify-between mb-3 sm:mb-6">
        <span className="mono-label-sm text-white/20">{title.toUpperCase()}</span>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg glass-panel flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/20" />
        </div>
      </div>
      <div className="font-display font-extrabold text-2xl sm:text-4xl tracking-tightest text-chrome truncate">{value}</div>
      {change && (
        <div className="flex items-center gap-1.5 mt-3">
          {trend === 'up' ? (
            <TrendingUp className="w-3 h-3 text-accent" />
          ) : trend === 'down' ? (
            <TrendingDown className="w-3 h-3 text-destructive" />
          ) : null}
          <span className={cn('mono-label-sm', trend === 'up' ? 'text-accent' : trend === 'down' ? 'text-destructive' : 'text-white/20')}>
            {change.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}
