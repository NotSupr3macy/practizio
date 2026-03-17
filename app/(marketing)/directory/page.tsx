import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Directory — Find AI-Bookable Businesses | Practizio',
  description: 'Browse businesses that accept AI-powered bookings. Hair salons, dentists, yoga studios, mechanics, and more — all bookable through AI assistants.',
}

export const revalidate = 60

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('practices')
    .select('id, slug, name, industry, tags, address, phone, website, is_active, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (params.category && params.category !== 'all') {
    query = query.ilike('industry', `%${params.category}%`)
  }

  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,industry.ilike.%${params.q}%`)
  }

  const { data: practices } = await query

  // Get unique industries for filter tabs
  const industries = Array.from(
    new Set((practices ?? []).map((p) => (p.industry as string) || 'Other').filter(Boolean))
  ).slice(0, 8)

  return (
    <div className="pt-[72px] bg-[var(--cream)]">
      {/* Header */}
      <div className="px-6 md:px-12 py-16 border-b border-[var(--border-light)]">
        <span className="mono-label-sm text-[var(--muted-text)] block mb-4">AI BUSINESS DIRECTORY</span>
        <h1 className="text-4xl md:text-6xl tracking-tight text-[var(--foreground)]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
          Directory
        </h1>
        <p className="font-mono text-xs text-[var(--muted-text)] mt-4 max-w-lg uppercase" style={{ letterSpacing: '0.2em' }}>
          Every business listed here accepts AI-powered bookings. AI assistants can check
          availability, browse services, and book appointments in real-time.
        </p>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row border-b border-[var(--border-light)]">
        <div className="flex-1 px-6 md:px-12 py-4 border-r border-[var(--border-light)]">
          <form className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[var(--muted-text)]" />
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Search businesses... (e.g. haircut, dentist, yoga, mechanic)"
              className="w-full bg-transparent font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--muted-text)] focus:outline-none py-2"
              style={{ letterSpacing: '0.05em' }}
            />
          </form>
        </div>
        <div className="flex overflow-x-auto">
          <Link
            href={`/directory${params.q ? `?q=${params.q}` : ''}`}
            className={`px-4 md:px-6 py-4 font-mono text-[10px] font-medium uppercase transition-all duration-300 border-r border-[var(--border-light)] whitespace-nowrap ${
              !params.category || params.category === 'all'
                ? 'bg-[var(--primary-accent)] text-white'
                : 'text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-white'
            }`}
            style={{ letterSpacing: '0.2em' }}
          >
            ALL
          </Link>
          {industries.map((industry) => (
            <Link
              key={industry}
              href={`/directory?category=${encodeURIComponent(industry)}${params.q ? `&q=${params.q}` : ''}`}
              className={`px-4 md:px-6 py-4 font-mono text-[10px] font-medium uppercase transition-all duration-300 border-r border-[var(--border-light)] whitespace-nowrap ${
                params.category === industry
                  ? 'bg-[var(--primary-accent)] text-white'
                  : 'text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-white'
              }`}
              style={{ letterSpacing: '0.2em' }}
            >
              {industry.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
      {practices && practices.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3">
          {practices.map((practice, i) => {
            const address = practice.address as { city?: string; state?: string } | null
            const tags = (practice.tags as string[]) ?? []
            return (
              <Link
                key={practice.id}
                href={`/directory/${practice.slug}`}
                className={`p-8 md:p-10 flex flex-col justify-between min-h-[280px] bg-white hover:bg-[var(--cream)] transition-colors duration-300 border-b border-[var(--border-light)] ${
                  (i + 1) % 3 !== 0 ? 'border-r border-r-[var(--border-light)]' : ''
                } group`}
              >
                <div>
                  <span className="mono-label-sm text-[var(--muted-text)] uppercase">
                    {((practice.industry as string) || 'BUSINESS')}
                  </span>
                  <h3 className="text-xl tracking-tight mt-3 text-[var(--foreground)] group-hover:text-[var(--primary-accent)] transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
                    {practice.name || 'Unnamed Business'}
                  </h3>
                  {address && (address.city || address.state) && (
                    <p className="font-mono text-xs text-[var(--muted-text)] mt-2 uppercase" style={{ letterSpacing: '0.2em' }}>
                      {[address.city, address.state].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {tags.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="font-mono text-[9px] px-2 py-0.5 bg-[var(--primary-accent)]/10 text-[var(--primary-accent)] uppercase" style={{ letterSpacing: '0.1em' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-6">
                  <span className="mono-label-sm text-[var(--primary-accent)]">AI BOOKABLE</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[var(--primary-accent)]" />
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-32">
          <span className="text-[120px] leading-none text-[var(--border-light)] block" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
            00
          </span>
          <h3 className="text-2xl tracking-tight mt-4 text-[var(--foreground)]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
            No Businesses Found
          </h3>
          <p className="font-mono text-sm text-[var(--muted-text)] mt-2">
            {params.q
              ? 'Try adjusting your search terms.'
              : 'Be the first to list your business.'}
          </p>
          <Link href="/signup" className="inline-block mt-8 btn-primary">
            LIST YOUR BUSINESS
          </Link>
        </div>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'AI-Bookable Businesses',
            description: 'Businesses that accept AI-powered bookings through AI assistants',
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
