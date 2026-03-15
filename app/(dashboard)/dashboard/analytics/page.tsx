import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  Bot,
  CalendarCheck,
  TrendingUp,
  Clock,
  Cpu,
  Target,
} from 'lucide-react'

export const metadata = {
  title: 'Analytics',
}

export default async function AnalyticsPage() {
  const supabase = await createClient()

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

  // Current month boundaries
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

  // Fetch all analytics data in parallel
  const [
    { count: totalQueries },
    { count: monthQueries },
    { count: totalAppointments },
    { count: monthAppointments },
    { data: allQueries },
    { data: recentQueries },
  ] = await Promise.all([
    supabase
      .from('ai_queries')
      .select('*', { count: 'exact', head: true })
      .eq('practice_id', practice.id),
    supabase
      .from('ai_queries')
      .select('*', { count: 'exact', head: true })
      .eq('practice_id', practice.id)
      .gte('created_at', monthStart)
      .lte('created_at', monthEnd),
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('practice_id', practice.id),
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('practice_id', practice.id)
      .gte('created_at', monthStart)
      .lte('created_at', monthEnd),
    supabase
      .from('ai_queries')
      .select('tool_called')
      .eq('practice_id', practice.id),
    supabase
      .from('ai_queries')
      .select('*')
      .eq('practice_id', practice.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  // Calculate most queried tool
  const toolCounts: Record<string, number> = {}
  allQueries?.forEach((q) => {
    toolCounts[q.tool_called] = (toolCounts[q.tool_called] || 0) + 1
  })
  const mostQueriedTool = Object.entries(toolCounts).sort(
    ([, a], [, b]) => b - a
  )[0]

  // Booking conversion rate
  const conversionRate =
    (totalQueries ?? 0) > 0
      ? Math.round(((totalAppointments ?? 0) / (totalQueries ?? 1)) * 100)
      : 0

  // Tool distribution for bar chart
  const toolDistribution = Object.entries(toolCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
  const maxToolCount = toolDistribution.length > 0 ? toolDistribution[0][1] : 1

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <span className="mono-label-sm opacity-40 block mb-3">PERFORMANCE DATA</span>
        <h1 className="font-display font-black uppercase text-3xl tracking-tightest">ANALYTICS</h1>
        <p className="font-sans text-sm font-light opacity-50 mt-2">
          Track how AI agents interact with your practice
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total AI Queries"
          value={totalQueries ?? 0}
          icon={Bot}
        />
        <StatCard
          title="Queries This Month"
          value={monthQueries ?? 0}
          change={`${monthAppointments ?? 0} bookings`}
          icon={BarChart3}
        />
        <StatCard
          title="Most Queried Tool"
          value={mostQueriedTool ? mostQueriedTool[0] : 'N/A'}
          change={mostQueriedTool ? `${mostQueriedTool[1]} calls` : undefined}
          icon={Cpu}
        />
        <StatCard
          title="Booking Conversion"
          value={`${conversionRate}%`}
          change="Query to booking"
          trend={conversionRate > 10 ? 'up' : 'down'}
          icon={Target}
        />
      </div>

      {/* Tool Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            Tool Usage Distribution
          </CardTitle>
          <CardDescription>
            Which actions AI assistants perform most frequently
          </CardDescription>
        </CardHeader>

        {toolDistribution.length > 0 ? (
          <div className="space-y-3">
            {toolDistribution.map(([tool, count]) => (
              <div key={tool} className="flex items-center gap-4">
                <span className="text-xs font-mono text-muted-foreground w-[160px] truncate">
                  {tool}
                </span>
                <div className="flex-1 h-8 bg-background overflow-hidden hairline">
                  <div
                    className="h-full bg-accent transition-all duration-500 flex items-center justify-end pr-3"
                    style={{
                      width: `${Math.max((count / maxToolCount) * 100, 8)}%`,
                    }}
                  >
                    <span className="text-xs font-mono text-background font-medium">
                      {count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm font-mono text-muted-foreground">
              No query data yet. Charts will populate as AI agents query your practice.
            </p>
          </div>
        )}
      </Card>

      {/* Recent Queries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Queries</CardTitle>
          <CardDescription>
            Detailed log of AI agent interactions
          </CardDescription>
        </CardHeader>

        {recentQueries && recentQueries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="hairline-b">
                  <th className="text-left text-xs font-mono text-muted-foreground py-3 px-4">
                    Tool
                  </th>
                  <th className="text-left text-xs font-mono text-muted-foreground py-3 px-4">
                    Agent
                  </th>
                  <th className="text-left text-xs font-mono text-muted-foreground py-3 px-4">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentQueries.map((query) => (
                  <tr
                    key={query.id}
                    className="hairline-b hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-accent" />
                        <span className="text-sm font-mono text-foreground">
                          {query.tool_called}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="accent">
                        {query.agent_identifier || 'Unknown'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
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
          <div className="text-center py-12">
            <Bot className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm font-mono text-muted-foreground">
              No queries recorded yet. Activity will appear here once AI agents begin discovering your practice.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
