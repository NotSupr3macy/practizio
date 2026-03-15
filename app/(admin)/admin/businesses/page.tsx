import { createAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Search } from 'lucide-react'

export default async function AdminBusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const supabase = createAdminClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  // Fetch all practices
  let practicesQuery = supabase
    .from('practices')
    .select('*')
    .order('created_at', { ascending: false })

  if (q) {
    practicesQuery = practicesQuery.or(
      `name.ilike.%${q}%,slug.ilike.%${q}%,industry.ilike.%${q}%`
    )
  }

  const { data: practices } = await practicesQuery

  // Fetch AI query counts for this month per practice
  const { data: aiQueries } = await supabase
    .from('ai_queries')
    .select('practice_id')
    .gte('created_at', startOfMonth)

  const queryCounts: Record<string, number> = {}
  if (aiQueries) {
    for (const q of aiQueries) {
      queryCounts[q.practice_id] = (queryCounts[q.practice_id] || 0) + 1
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-extrabold text-4xl tracking-tightest text-chrome-3d">
          BUSINESSES
        </h1>
        <p className="mono-label-sm text-white/20 mt-2">
          {practices?.length ?? 0} TOTAL BUSINESSES
        </p>
      </div>

      {/* Search */}
      <form method="GET" className="relative max-w-md">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          name="q"
          defaultValue={q || ''}
          placeholder="Search by name, slug, or industry..."
          className="w-full bg-transparent pl-7 pb-3 font-mono text-sm text-white placeholder:text-white/15 focus:outline-none"
          style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        />
      </form>

      {/* Table */}
      <div className="card-metal rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                <th className="text-left px-6 py-4 mono-label-sm text-white/20">
                  NAME
                </th>
                <th className="text-left px-6 py-4 mono-label-sm text-white/20">
                  INDUSTRY
                </th>
                <th className="text-left px-6 py-4 mono-label-sm text-white/20">
                  SLUG
                </th>
                <th className="text-left px-6 py-4 mono-label-sm text-white/20">
                  PLAN
                </th>
                <th className="text-left px-6 py-4 mono-label-sm text-white/20">
                  STATUS
                </th>
                <th className="text-left px-6 py-4 mono-label-sm text-white/20">
                  AI QUERIES
                </th>
                <th className="text-left px-6 py-4 mono-label-sm text-white/20">
                  CREATED
                </th>
              </tr>
            </thead>
            <tbody>
              {practices?.map((practice) => (
                <tr
                  key={practice.id}
                  className="hover:bg-white/[0.02] transition-colors duration-200"
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
                  }}
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/businesses/${practice.id}`}
                      className="font-mono text-sm text-white/80 hover:text-accent transition-colors"
                    >
                      {practice.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-white/40">
                    {practice.industry || '—'}
                  </td>
                  <td className="px-6 py-4 mono-label-sm text-white/30">
                    /{practice.slug}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        practice.plan === 'growth'
                          ? 'accent'
                          : practice.plan === 'starter'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {practice.plan}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={practice.is_active ? 'success' : 'destructive'}
                    >
                      {practice.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-display font-extrabold text-lg tracking-tightest text-accent">
                    {queryCounts[practice.id] || 0}
                  </td>
                  <td className="px-6 py-4 mono-label-sm text-white/20">
                    {new Date(practice.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
              {(!practices || practices.length === 0) && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center font-mono text-sm text-white/20"
                  >
                    No businesses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
