import { createAdminClient } from '@/lib/supabase/admin'
import { StatCard } from '@/components/ui/stat-card'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Zap,
  CalendarCheck,
  ShoppingCart,
  Users,
  Unplug,
  MessageSquarePlus,
} from 'lucide-react'

export default async function AdminOverviewPage() {
  let supabase
  try {
    supabase = createAdminClient()
  } catch (e) {
    console.error('Failed to create admin client:', e)
    return (
      <div className="p-10">
        <h1 className="text-2xl text-red-600">Admin client error</h1>
        <p className="mt-2 text-[var(--muted-text)]">Could not connect to database. Check SUPABASE_SERVICE_ROLE_KEY env var.</p>
      </div>
    )
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  // Run all queries in parallel
  let practicesRes, aiQueriesRes, appointmentsRes, ordersRes, leadsRes, recentLeadsRes, activePracticesRes, unconnectedRes, integrationRequestsRes
  try {
    ;[
      practicesRes,
      aiQueriesRes,
      appointmentsRes,
      ordersRes,
      leadsRes,
      recentLeadsRes,
      activePracticesRes,
      unconnectedRes,
      integrationRequestsRes,
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
      supabase.from('practices').select('id', { count: 'exact', head: true }).eq('booking_system_connected', false),
      supabase.from('integration_requests').select('*, practices(name)').order('created_at', { ascending: false }).limit(10),
    ])
  } catch (e) {
    console.error('Admin queries failed:', e)
    return (
      <div className="p-10">
        <h1 className="text-2xl text-red-600">Database query error</h1>
        <p className="mt-2 text-[var(--muted-text)]">Failed to fetch admin data. Check database tables and permissions.</p>
        <pre className="mt-4 text-xs text-red-400">{String(e)}</pre>
      </div>
    )
  }

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
  const unconnectedCount = unconnectedRes.count ?? 0
  const integrationRequests = integrationRequestsRes.data ?? []

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
        <h1 className="text-4xl text-[var(--foreground)]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
          Admin Overview
        </h1>
        <p className="mt-2 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
          PLATFORM METRICS &mdash;{' '}
          {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
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
        <StatCard
          title="Unconnected"
          value={unconnectedCount}
          icon={Unplug}
          change={totalPractices > 0 ? `${Math.round((unconnectedCount / totalPractices) * 100)}%` : '0%'}
          trend={unconnectedCount > 0 ? 'down' : 'up'}
        />
        <StatCard
          title="Integration Reqs"
          value={integrationRequests.length}
          icon={MessageSquarePlus}
        />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white border border-[var(--border-light)] rounded-[2px] p-6">
          <h2 className="mb-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>RECENT LEADS</h2>
          {recentLeads.length === 0 ? (
            <p className="text-sm text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace" }}>No leads yet.</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead: Record<string, unknown>) => (
                <div
                  key={lead.id as string}
                  className="bg-white border border-[var(--border-light)] rounded-[2px] p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-[var(--foreground)]" style={{ fontFamily: "'Space Mono', monospace" }}>
                      {lead.business_name as string}
                    </p>
                    <p className="mt-1 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
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
        <div className="bg-white border border-[var(--border-light)] rounded-[2px] p-6">
          <h2 className="mb-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
            MOST ACTIVE BUSINESSES (AI QUERIES)
          </h2>
          {topPractices.length === 0 ? (
            <p className="text-sm text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace" }}>
              No AI queries this month.
            </p>
          ) : (
            <div className="space-y-3">
              {topPractices.map((p, i) => (
                <div
                  key={p.slug || i}
                  className="bg-white border border-[var(--border-light)] rounded-[2px] p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-[var(--foreground)]" style={{ fontFamily: "'Space Mono', monospace" }}>{p.name}</p>
                    <p className="mt-1 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                      /{p.slug}
                    </p>
                  </div>
                  <span className="text-xl text-[var(--primary-accent)]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
                    {p.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Integration Requests */}
      {integrationRequests.length > 0 && (
        <div className="bg-white border border-[var(--border-light)] rounded-[2px] p-6">
          <h2 className="mb-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>INTEGRATION REQUESTS</h2>
          <div className="space-y-3">
            {integrationRequests.map((req: Record<string, unknown>) => (
              <div
                key={req.id as string}
                className="bg-white border border-[var(--border-light)] rounded-[2px] p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-[var(--foreground)]" style={{ fontFamily: "'Space Mono', monospace" }}>
                    {req.booking_system_name as string}
                  </p>
                  <p className="mt-1 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    {(req.practices as { name: string } | null)?.name || 'Unknown business'}
                  </p>
                </div>
                <Badge variant={req.status === 'new' ? 'accent' : 'default'}>
                  {(req.status as string).toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
