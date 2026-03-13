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
    <div className={cn('hairline p-6 card-interactive', className)}>
      <div className="flex items-center justify-between mb-6">
        <span className="mono-label-sm opacity-40">{title.toUpperCase().replace(/ /g, '_')}</span>
        <Icon className="w-4 h-4 opacity-20" />
      </div>
      <div className="font-display font-black text-4xl tracking-tightest">{value}</div>
      {change && (
        <div className="flex items-center gap-1.5 mt-3">
          {trend === 'up' ? (
            <TrendingUp className="w-3 h-3 text-green-500" />
          ) : trend === 'down' ? (
            <TrendingDown className="w-3 h-3 text-red-500" />
          ) : null}
          <span
            className={cn(
              'mono-label-sm',
              trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'opacity-40'
            )}
          >
            {change.toUpperCase().replace(/ /g, '_')}
          </span>
        </div>
      )}
    </div>
  )
}
