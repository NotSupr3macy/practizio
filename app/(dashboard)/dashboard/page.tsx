import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getProfileCompleteness, formatDate } from '@/lib/utils'
import { StatCard } from '@/components/ui/stat-card'
import { Badge } from '@/components/ui/badge'
import { Bot, CalendarCheck, Activity, Briefcase, Clock, Cpu } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: practice } = await supabase
    .from('practices')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!practice) redirect('/onboarding')

  // Get current month boundaries
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

  // Fetch stats in parallel
  const [
    { count: aiQueriesCount },
    { count: appointmentsCount },
    { count: servicesCount },
    { data: recentQueries },
  ] = await Promise.all([
    supabase
      .from('ai_queries')
      .select('*', { count: 'exact', head: true })
      .eq('practice_id', practice.id)
      .gte('created_at', monthStart)
      .lte('created_at', monthEnd),
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('practice_id', practice.id)
      .gte('created_at', monthStart)
      .lte('created_at', monthEnd),
    supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('practice_id', practice.id),
    supabase
      .from('ai_queries')
      .select('*')
      .eq('practice_id', practice.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const profileScore = getProfileCompleteness(practice)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="hairline-b pb-8">
        <span className="mono-label-sm opacity-40 block mb-2">DASHBOARD_OVERVIEW</span>
        <h1 className="font-display font-black uppercase text-3xl md:text-4xl tracking-tightest">
          OVERVIEW
        </h1>
        <p className="font-sans text-sm font-light opacity-40 mt-2">
          Welcome back. Here is an overview of your practice.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
        <StatCard
          title="AI Queries"
          value={aiQueriesCount ?? 0}
          change="This month"
          icon={Bot}
        />
        <StatCard
          title="Appointments Booked"
          value={appointmentsCount ?? 0}
          change="This month"
          icon={CalendarCheck}
        />
        <StatCard
          title="Profile Score"
          value={`${profileScore}%`}
          change={profileScore === 100 ? 'Complete' : 'Incomplete'}
          trend={profileScore === 100 ? 'up' : 'down'}
          icon={Activity}
        />
        <StatCard
          title="Active Services"
          value={servicesCount ?? 0}
          icon={Briefcase}
        />
      </div>

      {/* Recent Activity */}
      <div className="hairline">
        <div className="px-6 py-4 hairline-b flex items-center justify-between">
          <h3 className="font-display font-black uppercase text-lg tracking-tightest">
            RECENT_AI_ACTIVITY
          </h3>
          <span className="mono-label-sm opacity-40">LAST_10_QUERIES</span>
        </div>

        {recentQueries && recentQueries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="hairline-b">
                  <th className="text-left mono-label-sm opacity-40 py-3 px-6">
                    TOOL_CALLED
                  </th>
                  <th className="text-left mono-label-sm opacity-40 py-3 px-6">
                    AGENT
                  </th>
                  <th className="text-left mono-label-sm opacity-40 py-3 px-6">
                    TIMESTAMP
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentQueries.map((query) => (
                  <tr
                    key={query.id}
                    className="hairline-b card-interactive"
                  >
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-accent" />
                        <span className="font-mono text-sm">
                          {query.tool_called}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <Badge variant="accent">
                        {query.agent_identifier || 'UNKNOWN_AGENT'}
                      </Badge>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-1.5 font-mono text-xs opacity-40">
                        <Clock className="w-3 h-3" />
                        {formatDate(query.created_at)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="font-display font-black text-[80px] leading-none opacity-[0.03] block">
              00
            </span>
            <p className="font-mono text-sm opacity-30 -mt-4">
              No AI queries yet. Once AI agents start discovering your practice, activity will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
