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
        <h1 className="text-4xl text-[var(--foreground)]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
          Businesses
        </h1>
        <p className="mt-2 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
          {practices?.length ?? 0} TOTAL BUSINESSES
        </p>
      </div>

      {/* Search */}
      <form method="GET" className="relative max-w-md">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-text)]" />
        <input
          name="q"
          defaultValue={q || ''}
          placeholder="Search by name, slug, or industry..."
          className="w-full bg-transparent pl-7 pb-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-text)] focus:outline-none"
          style={{
            fontFamily: "'Space Mono', monospace",
            borderBottom: '1px solid var(--border-light)',
          }}
        />
      </form>

      {/* Table */}
      <div className="bg-white border border-[var(--border-light)] rounded-[2px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--border-light)',
                }}
              >
                <th className="text-left px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                  NAME
                </th>
                <th className="text-left px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                  INDUSTRY
                </th>
                <th className="text-left px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                  SLUG
                </th>
                <th className="text-left px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                  PLAN
                </th>
                <th className="text-left px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                  STATUS
                </th>
                <th className="text-left px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                  AI QUERIES
                </th>
                <th className="text-left px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                  CREATED
                </th>
              </tr>
            </thead>
            <tbody>
              {practices?.map((practice) => (
                <tr
                  key={practice.id}
                  className="hover:bg-[var(--cream)] transition-colors duration-200"
                  style={{
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/businesses/${practice.id}`}
                      className="text-sm text-[var(--foreground)] hover:text-[var(--primary-accent)] transition-colors"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      {practice.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace" }}>
                    {practice.industry || '—'}
                  </td>
                  <td className="px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
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
                  <td className="px-6 py-4 text-lg text-[var(--primary-accent)]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
                    {queryCounts[practice.id] || 0}
                  </td>
                  <td className="px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
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
                    className="px-6 py-12 text-center text-sm text-[var(--muted-text)]"
                    style={{ fontFamily: "'Space Mono', monospace" }}
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
