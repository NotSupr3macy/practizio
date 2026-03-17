import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getProfileCompleteness, formatDate } from '@/lib/utils'
import { StatCard } from '@/components/ui/stat-card'
import { Badge } from '@/components/ui/badge'
import { Bot, CalendarCheck, Activity, Briefcase, Clock, Cpu, CreditCard, CheckCircle, Share2, Star, ExternalLink, Copy, Eye } from 'lucide-react'
import Link from 'next/link'
import { BookingIntegrations } from '@/components/dashboard/booking-integrations'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: practice } = await supabase
    .from('practices')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!practice) redirect('/onboarding')

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

  const [
    { count: aiQueriesCount },
    { count: appointmentsCount },
    { count: servicesCount },
    { data: recentQueries },
    { count: pendingPaymentsCount },
    { count: ordersCount },
    { count: searchAppearancesCount },
  ] = await Promise.all([
    supabase.from('ai_queries').select('*', { count: 'exact', head: true }).eq('practice_id', practice.id).gte('created_at', monthStart).lte('created_at', monthEnd),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('practice_id', practice.id).gte('created_at', monthStart).lte('created_at', monthEnd),
    supabase.from('services').select('*', { count: 'exact', head: true }).eq('practice_id', practice.id),
    supabase.from('ai_queries').select('*').eq('practice_id', practice.id).order('created_at', { ascending: false }).limit(10),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('practice_id', practice.id).eq('booking_status', 'pending_payment'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('practice_id', practice.id).gte('created_at', monthStart).lte('created_at', monthEnd),
    supabase.from('search_appearances').select('*', { count: 'exact', head: true }).eq('practice_id', practice.id).gte('created_at', monthStart).lte('created_at', monthEnd),
  ])

  const profileScore = getProfileCompleteness(practice)
  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/directory/${practice.slug}`
  const totalBookings = (appointmentsCount ?? 0) + (ordersCount ?? 0)
  const isNewBusiness = totalBookings === 0 && (aiQueriesCount ?? 0) === 0

  return (
    <div className="space-y-8">
      <div className="border-b border-[var(--border-light)] pb-8">
        <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] block mb-2">DASHBOARD OVERVIEW</span>
        <h1 className="font-['Playfair_Display'] font-light text-3xl md:text-4xl text-[var(--foreground)]">OVERVIEW</h1>
        <p className="font-['Space_Mono'] text-sm text-[var(--muted-text)] mt-2">
          Welcome back. Here is your business overview.
        </p>
      </div>

      {isNewBusiness ? (
        /* ========== NEW BUSINESS WELCOME STATE ========== */
        <div className="space-y-6">
          {/* Status banner */}
          <div className="bg-white border border-[var(--border-light)] rounded-[2px] p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, var(--primary-accent), transparent)' }} />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-[2px] bg-[rgba(61,112,104,0.1)] flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[var(--primary-accent)]" />
              </div>
              <div>
                <h2 className="font-['Playfair_Display'] font-light text-xl text-[var(--foreground)]">YOUR AI BOOKING IS LIVE</h2>
                <p className="font-['Space_Mono'] text-sm text-[var(--muted-text)] mt-1">
                  Customers can now find and book with you through AI assistants
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-[var(--primary-accent)]" />
              <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--primary-accent)]">ACTIVE</span>
            </div>
          </div>

          {/* What happens next */}
          <div className="bg-white border border-[var(--border-light)] rounded-[2px]">
            <div className="p-6 border-b border-[var(--border-light)]">
              <h3 className="font-['Playfair_Display'] font-light text-lg text-[var(--foreground)]">WHAT HAPPENS NEXT</h3>
              <p className="font-['Space_Mono'] text-sm text-[var(--muted-text)] mt-1">
                When someone uses an AI assistant to search for a {practice.industry || 'business'} in your area, your business will appear. Here&apos;s how to help that happen faster:
              </p>
            </div>

            <div className="divide-y divide-[var(--border-light)]">
              {/* Tip 1 */}
              <div className="p-6 flex gap-4">
                <div className="w-8 h-8 rounded-[2px] bg-[rgba(61,112,104,0.1)] flex items-center justify-center shrink-0 mt-0.5">
                  <Share2 className="w-4 h-4 text-[var(--primary-accent)]" />
                </div>
                <div className="flex-1">
                  <p className="font-['Space_Mono'] text-sm font-medium text-[var(--foreground)] mb-2">Share your SpadeChat profile with customers</p>
                  <p className="font-['Space_Mono'] text-xs text-[var(--muted-text)] mb-3">
                    The more people know about your AI booking option, the more bookings you&apos;ll get.
                  </p>
                  <div className="flex items-center gap-2 bg-[var(--cream)] border border-[var(--border-light)] px-3 py-2 rounded-[2px]">
                    <code className="font-['Space_Mono'] text-xs text-[var(--primary-accent)] break-all flex-1">{profileUrl}</code>
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--muted-text)] shrink-0" />
                  </div>
                </div>
              </div>

              {/* Tip 2 */}
              <div className="p-6 flex gap-4">
                <div className="w-8 h-8 rounded-[2px] bg-[rgba(61,112,104,0.1)] flex items-center justify-center shrink-0 mt-0.5">
                  <Star className="w-4 h-4 text-[var(--primary-accent)]" />
                </div>
                <div>
                  <p className="font-['Space_Mono'] text-sm font-medium text-[var(--foreground)] mb-2">Ask happy customers to try booking through AI</p>
                  <p className="font-['Space_Mono'] text-xs text-[var(--muted-text)]">
                    Suggest they try: &quot;Hey, next time you need a {practice.industry || 'service'}, try asking ChatGPT or Claude to book it for you at {practice.name}!&quot;
                  </p>
                </div>
              </div>

              {/* Tip 3 */}
              <div className="p-6 flex gap-4">
                <div className="w-8 h-8 rounded-[2px] bg-[rgba(61,112,104,0.1)] flex items-center justify-center shrink-0 mt-0.5">
                  <Briefcase className="w-4 h-4 text-[var(--primary-accent)]" />
                </div>
                <div>
                  <p className="font-['Space_Mono'] text-sm font-medium text-[var(--foreground)] mb-2">Keep your services and hours up to date</p>
                  <p className="font-['Space_Mono'] text-xs text-[var(--muted-text)]">
                    Accurate info helps AI assistants give your customers the right information.
                  </p>
                  <Link href="/dashboard/services" className="inline-block mt-2 font-['Space_Mono'] text-[10px] uppercase text-[var(--primary-accent)] hover:text-[var(--foreground)] transition-colors" style={{ letterSpacing: '0.15em' }}>
                    UPDATE SERVICES →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Test it yourself */}
          <div className="bg-white border border-[var(--border-light)] rounded-[2px] p-6 md:p-8">
            <h3 className="font-['Playfair_Display'] font-light text-base text-[var(--foreground)] mb-3">TEST IT YOURSELF</h3>
            <p className="font-['Space_Mono'] text-sm text-[var(--muted-text)] mb-4">
              Try asking an AI assistant to find your business:
            </p>
            <div className="bg-[var(--cream)] border border-[var(--border-light)] p-4 rounded-[2px]">
              <p className="font-['Space_Mono'] text-sm text-[var(--primary-accent)] italic">
                &quot;Find a {practice.industry || 'business'} near {(practice.address as { city?: string } | null)?.city || 'me'} and book an appointment&quot;
              </p>
            </div>
          </div>

          {/* Profile preview */}
          <div className="bg-white border border-[var(--border-light)] rounded-[2px] p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)]">YOUR PROFILE PAGE</span>
              <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="font-['Space_Mono'] text-[10px] uppercase text-[var(--primary-accent)] hover:text-[var(--foreground)] transition-colors" style={{ letterSpacing: '0.15em' }}>
                VIEW LIVE →
              </a>
            </div>
            <div className="bg-[var(--cream)] border border-[var(--border-light)] p-4 rounded-[2px]">
              <p className="font-['Space_Mono'] text-sm font-medium text-[var(--foreground)]">{practice.name}</p>
              <p className="font-['Space_Mono'] text-xs text-[var(--muted-text)] mt-1">{practice.industry}</p>
              {(practice.address as { city?: string; state?: string } | null) && (
                <p className="font-['Space_Mono'] text-xs text-[var(--muted-text)] mt-1">
                  {[(practice.address as { city?: string; state?: string }).city, (practice.address as { city?: string; state?: string }).state].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Booking integration */}
          <BookingIntegrations
            currentPlatform={(practice as any).booking_system_type}
            currentBookingUrl={(practice as any).booking_url}
            practiceId={practice.id}
          />
        </div>
      ) : (
        /* ========== ACTIVE BUSINESS DASHBOARD ========== */
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0">
            <StatCard title="AI Searches" value={searchAppearancesCount ?? 0} change="This month" icon={Eye} />
            <StatCard title="AI Queries" value={aiQueriesCount ?? 0} change="This month" icon={Bot} />
            <StatCard title="Bookings" value={totalBookings} change="This month" icon={CalendarCheck} />
            <StatCard title="Profile Score" value={`${profileScore}%`} change={profileScore === 100 ? 'Complete' : 'Incomplete'} trend={profileScore === 100 ? 'up' : 'down'} icon={Activity} />
            <StatCard title="Active Services" value={servicesCount ?? 0} icon={Briefcase} />
            <StatCard title="Pending Payments" value={pendingPaymentsCount ?? 0} change="Awaiting deposit" icon={CreditCard} />
          </div>

          <div className="bg-white border border-[var(--border-light)] rounded-[2px]">
            <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between">
              <h3 className="font-['Playfair_Display'] font-light text-lg text-[var(--foreground)]">RECENT AI ACTIVITY</h3>
              <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)]">LAST 10 QUERIES</span>
            </div>

            {recentQueries && recentQueries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border-light)]">
                      <th className="text-left font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] py-3 px-6">ACTION</th>
                      <th className="text-left font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] py-3 px-6">AGENT</th>
                      <th className="text-left font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] py-3 px-6">TIMESTAMP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentQueries.map((query) => (
                      <tr key={query.id} className="border-b border-[var(--border-light)] hover:bg-[var(--cream)] transition-colors">
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-2">
                            <Cpu className="w-3.5 h-3.5 text-[var(--primary-accent)]" />
                            <span className="font-['Space_Mono'] text-sm text-[var(--foreground)]">{query.tool_called}</span>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <Badge variant="accent">{query.agent_identifier || 'AI ASSISTANT'}</Badge>
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-1.5 font-['Space_Mono'] text-xs text-[var(--muted-text)]">
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
                <span className="font-['Playfair_Display'] font-light text-[80px] leading-none opacity-[0.06] block text-[var(--foreground)]">00</span>
                <p className="font-['Space_Mono'] text-sm text-[var(--muted-text)] -mt-4">
                  No AI activity yet. Once AI assistants start discovering your business, activity will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Booking integration */}
          <BookingIntegrations
            currentPlatform={(practice as any).booking_system_type}
            currentBookingUrl={(practice as any).booking_url}
            practiceId={practice.id}
          />
        </>
      )}
    </div>
  )
}
