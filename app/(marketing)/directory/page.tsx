import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Directory — Find AI-Accessible Practices',
  description: 'Browse professional practices that are discoverable and bookable by AI agents via MCP endpoints.',
}

export const revalidate = 60

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string }
}) {
  const supabase = createClient()

  let query = supabase
    .from('practices')
    .select('id, slug, name, practice_type, address, phone, website, is_active, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (searchParams.type && searchParams.type !== 'all') {
    query = query.eq('practice_type', searchParams.type)
  }

  if (searchParams.q) {
    query = query.ilike('name', `%${searchParams.q}%`)
  }

  const { data: practices } = await query

  const practiceTypes = [
    { value: 'all', label: 'ALL_PRACTICES' },
    { value: 'dental', label: 'DENTAL' },
    { value: 'medical', label: 'MEDICAL' },
    { value: 'legal', label: 'LEGAL' },
    { value: 'financial', label: 'FINANCIAL' },
  ]

  return (
    <div className="pt-[72px]">
      {/* Header */}
      <div className="px-6 md:px-12 py-16 hairline-b">
        <span className="mono-label-sm opacity-40 block mb-4">AI_PRACTICE_DIRECTORY</span>
        <h1 className="font-display font-black uppercase text-4xl md:text-6xl tracking-tightest">
          DIRECTORY
        </h1>
        <p className="font-sans text-sm font-light opacity-50 mt-4 max-w-lg">
          Every practice listed here is AI-accessible via MCP. AI agents can query
          availability, services, and book appointments in real-time.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row hairline-b">
        <div className="flex-1 px-6 md:px-12 py-4 hairline-r">
          <form>
            <input
              name="q"
              defaultValue={searchParams.q}
              placeholder="SEARCH_PRACTICES..."
              className="w-full bg-transparent font-mono text-sm text-white placeholder:opacity-30 focus:outline-none py-2"
              style={{ letterSpacing: '0.1em' }}
            />
          </form>
        </div>
        <div className="flex">
          {practiceTypes.map((type) => (
            <Link
              key={type.value}
              href={`/directory?type=${type.value}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
              className={`px-4 md:px-6 py-4 font-mono text-[10px] font-medium uppercase transition-all duration-300 hairline-r last:border-r-0 ${
                (searchParams.type || 'all') === type.value
                  ? 'bg-white text-black'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
              }`}
              style={{ letterSpacing: '0.2em' }}
            >
              {type.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Practice grid */}
      {practices && practices.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3">
          {practices.map((practice, i) => {
            const address = practice.address as { city?: string; state?: string } | null
            return (
              <Link
                key={practice.id}
                href={`/directory/${practice.slug}`}
                className={`p-8 md:p-10 flex flex-col justify-between min-h-[280px] card-interactive hairline-b ${
                  (i + 1) % 3 !== 0 ? 'hairline-r' : ''
                } group`}
              >
                <div>
                  <span className="mono-label-sm opacity-40 uppercase">
                    {practice.practice_type?.replace(/ /g, '_')}
                  </span>
                  <h3 className="font-display font-black uppercase text-xl tracking-tightest mt-3 group-hover:text-accent transition-colors duration-300">
                    {practice.name || 'UNNAMED_PRACTICE'}
                  </h3>
                  {address && (address.city || address.state) && (
                    <p className="font-mono text-xs opacity-30 mt-2 uppercase" style={{ letterSpacing: '0.2em' }}>
                      {[address.city, address.state].filter(Boolean).join('_')}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-6">
                  <span className="mono-label-sm text-accent">MCP_ACTIVE</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-32">
          <span className="font-display font-black text-[120px] leading-none opacity-[0.03] block">
            00
          </span>
          <h3 className="font-display font-black uppercase text-2xl tracking-tightest mt-4">
            NO PRACTICES FOUND
          </h3>
          <p className="font-sans text-sm font-light opacity-40 mt-2">
            {searchParams.q
              ? 'Try adjusting your search terms.'
              : 'Be the first to list your practice.'}
          </p>
          <Link
            href="/signup"
            className="inline-block mt-8 btn-solid"
          >
            LIST_YOUR_PRACTICE
          </Link>
        </div>
      )}

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'AI-Accessible Professional Practices',
            description: 'Practices discoverable via MCP endpoints by AI agents',
            numberOfItems: practices?.length || 0,
            itemListElement: practices?.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'LocalBusiness',
                name: p.name,
                url: `${process.env.NEXT_PUBLIC_APP_URL}/directory/${p.slug}`,
              },
            })),
          }),
        }}
      />
    </div>
  )
}
