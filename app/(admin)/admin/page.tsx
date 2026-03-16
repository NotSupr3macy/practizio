import { createAdminClient } from '@/lib/supabase/admin'
import { StatCard } from '@/components/ui/stat-card'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Zap,
  CalendarCheck,
  ShoppingCart,
  Users,
} from 'lucide-react'

export default async function AdminOverviewPage() {
  const supabase = createAdminClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  // Run all queries in parallel
  const [
    practicesRes,
    aiQueriesRes,
    appointmentsRes,
    ordersRes,
    leadsRes,
    recentLeadsRes,
    activePracticesRes,
  ] = await Promise.all([
    supabase.from('practices').select('id', { count: 'exact', head: true }),
    supabase
      .from('ai_queries')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startOfMonth),
    supabase
      .from('appointments')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startOfMonth),
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startOfMonth),
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('ai_queries')
      .select('practice_id, practices(name, slug)')
      .gte('created_at', startOfMonth),
  ])

  // Aggregate most active practices
  const practiceQueryCounts: Record<string, { name: string; slug: string; count: number }> = {}
  if (activePracticesRes.data) {
    for (const q of activePracticesRes.data) {
      const pid = q.practice_id
      if (!practiceQueryCounts[pid]) {
        const practice = q.practices as unknown as { name: string; slug: string } | null
        practiceQueryCounts[pid] = {
          name: practice?.name || 'Unknown',
          slug: practice?.slug || '',
          count: 0,
        }
      }
      practiceQueryCounts[pid].count++
    }
  }
  const topPractices = Object.values(practiceQueryCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const totalPractices = practicesRes.count ?? 0
  const totalAiQueries = aiQueriesRes.count ?? 0
  const totalAppointments = appointmentsRes.count ?? 0
  const totalOrders = ordersRes.count ?? 0
  const totalLeads = leadsRes.count ?? 0
  const recentLeads = recentLeadsRes.data ?? []

  const statusVariant = (status: string) => {
    switch (status) {
      case 'new':
        return 'accent'
      case 'contacted':
        return 'default'
      case 'setup_in_progress':
        return 'warning'
      case 'setup_complete':
        return 'success'
      case 'not_interested':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-display font-extrabold text-4xl tracking-tightest text-chrome-3d">
          ADMIN OVERVIEW
        </h1>
        <p className="mono-label-sm text-white/20 mt-2">
          PLATFORM METRICS &mdash;{' '}
          {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Businesses"
          value={totalPractices}
          icon={Building2}
        />
        <StatCard
          title="AI Queries"
          value={totalAiQueries}
          icon={Zap}
          change="THIS MONTH"
        />
        <StatCard
          title="Appointments"
          value={totalAppointments}
          icon={CalendarCheck}
          change="THIS MONTH"
        />
        <StatCard
          title="Orders"
          value={totalOrders}
          icon={ShoppingCart}
          change="THIS MONTH"
        />
        <StatCard
          title="Leads"
          value={totalLeads}
          icon={Users}
        />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="card-metal rounded-xl p-6">
          <h2 className="mono-label-sm text-white/20 mb-4">RECENT LEADS</h2>
          {recentLeads.length === 0 ? (
            <p className="font-mono text-sm text-white/20">No leads yet.</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead: Record<string, unknown>) => (
                <div
                  key={lead.id as string}
                  className="glass-panel rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-mono text-sm text-white/80">
                      {lead.business_name as string}
                    </p>
                    <p className="mono-label-sm text-white/20 mt-1">
                      {lead.email as string}
                    </p>
                  </div>
                  <Badge variant={statusVariant(lead.status as string) as 'default' | 'accent' | 'success' | 'warning' | 'destructive'}>
                    {(lead.status as string).replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Most Active Practices */}
        <div className="card-metal rounded-xl p-6">
          <h2 className="mono-label-sm text-white/20 mb-4">
            MOST ACTIVE BUSINESSES (AI QUERIES)
          </h2>
          {topPractices.length === 0 ? (
            <p className="font-mono text-sm text-white/20">
              No AI queries this month.
            </p>
          ) : (
            <div className="space-y-3">
              {topPractices.map((p, i) => (
                <div
                  key={p.slug || i}
                  className="glass-panel rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-mono text-sm text-white/80">{p.name}</p>
                    <p className="mono-label-sm text-white/20 mt-1">
                      /{p.slug}
                    </p>
                  </div>
                  <span className="font-display font-extrabold text-xl tracking-tightest text-accent">
                    {p.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
