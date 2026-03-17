import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatTime } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Globe, Clock, Bot, Info, Sparkles, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: practice } = await supabase
    .from('practices')
    .select('name, industry, address, tags')
    .eq('slug', slug)
    .single()

  if (!practice) return { title: 'Business Not Found' }

  const address = practice.address as { city?: string; state?: string } | null
  const tags = (practice.tags as string[]) ?? []
  const city = address?.city || ''
  const topServices = tags.slice(0, 3).join(', ')

  return {
    title: `${practice.name} — Book with AI | Practizio`,
    description: `Book appointments at ${practice.name}${city ? ` in ${city}` : ''} through any AI assistant. ${practice.industry} services${topServices ? ` including ${topServices}` : ''}.`,
    openGraph: {
      title: `${practice.name} — Book with AI | Practizio`,
      description: `${practice.industry}${city ? ` in ${city}` : ''} — AI-powered booking available`,
    },
  }
}

export default async function DirectoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const adminSupabase = createAdminClient()

  const { data: practice } = await supabase
    .from('practices')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!practice) notFound()

  // Fetch related data + bookings count in parallel
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

  const [
    { data: services },
    { data: availability },
    { data: providers },
    { count: appointmentsThisMonth },
    { count: ordersThisMonth },
  ] = await Promise.all([
    supabase.from('services').select('*').eq('practice_id', practice.id).order('name'),
    supabase.from('availability').select('*').eq('practice_id', practice.id).order('day_of_week'),
    supabase.from('providers').select('*').eq('practice_id', practice.id),
    adminSupabase.from('appointments').select('*', { count: 'exact', head: true }).eq('practice_id', practice.id).gte('created_at', monthStart).lte('created_at', monthEnd),
    adminSupabase.from('orders').select('*', { count: 'exact', head: true }).eq('practice_id', practice.id).gte('created_at', monthStart).lte('created_at', monthEnd),
  ])

  const address = practice.address as { street?: string; city?: string; state?: string; zip?: string } | null
  const tags = (practice.tags as string[]) ?? []
  const additionalInfo = (practice.additional_info as Record<string, string>) ?? {}
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const aiBookingLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/mcp/${practice.slug}`
  const totalBookings = (appointmentsThisMonth ?? 0) + (ordersThisMonth ?? 0)

  return (
    <div className="pt-[72px] bg-[var(--cream)]">
      {/* Header */}
      <div className="px-6 md:px-12 py-16 border-b border-[var(--border-light)]">
        <div className="flex items-center gap-3 mb-4">
          <span className="mono-label-sm text-[var(--muted-text)] uppercase">
            {((practice.industry as string) || 'BUSINESS')}
          </span>
          <Badge variant="success">AI BOOKABLE</Badge>
          {totalBookings > 0 ? (
            <span className="bg-white border border-[var(--border-light)] px-3 py-1 rounded-[2px] mono-label-sm text-[var(--primary-accent)] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              {totalBookings} booked via AI this month
            </span>
          ) : (
            <span className="bg-white border border-[var(--border-light)] px-3 py-1 rounded-[2px] mono-label-sm text-[var(--muted-text)]">
              New on Practizio
            </span>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl tracking-tight text-[var(--foreground)]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
          {practice.name}
        </h1>

        {tags.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {tags.map((tag) => (
              <span key={tag} className="font-mono text-[10px] px-2 py-1 bg-[var(--primary-accent)]/10 text-[var(--primary-accent)] uppercase" style={{ letterSpacing: '0.1em' }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-6 mt-6">
          {address && (
            <div className="flex items-center gap-2 text-sm text-[var(--muted-text)]">
              <MapPin className="w-4 h-4" />
              <span>{[address.street, address.city, address.state, address.zip].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {practice.phone && (
            <div className="flex items-center gap-2 text-sm text-[var(--muted-text)]">
              <Phone className="w-4 h-4" />
              <span>{practice.phone}</span>
            </div>
          )}
          {practice.website && (
            <div className="flex items-center gap-2 text-sm text-[var(--muted-text)]">
              <Globe className="w-4 h-4" />
              <a href={practice.website} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary-accent)] transition-colors">
                {practice.website}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3">
        {/* Left: Services + Additional Info */}
        <div className="md:col-span-2 border-r border-[var(--border-light)]">
          {/* AI Booking Link */}
          <div className="px-6 md:px-12 py-8 border-b border-[var(--border-light)]">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-5 h-5 text-[var(--primary-accent)]" />
              <span className="mono-label-sm text-[var(--muted-text)]">AI BOOKING LINK</span>
              <Badge variant="success">ACTIVE</Badge>
            </div>
            <div className="bg-white border border-[var(--border-light)] rounded-[2px] px-4 py-3">
              <code className="text-[var(--primary-accent)] font-mono text-sm break-all">{aiBookingLink}</code>
            </div>
            <p className="font-mono text-xs text-[var(--muted-text)] mt-3">
              Share this link with AI platforms or developers to connect your business.
            </p>
          </div>

          {/* Services */}
          {services && services.length > 0 && (
            <div className="px-6 md:px-12 py-8 border-b border-[var(--border-light)]">
              <span className="mono-label-sm text-[var(--muted-text)] block mb-6">SERVICES</span>
              <div className="grid gap-0">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between py-4 border-b border-[var(--border-light)] last:border-b-0">
                    <div>
                      <p className="font-mono text-sm font-medium text-[var(--foreground)]">{service.name}</p>
                      {service.description && <p className="font-mono text-xs text-[var(--muted-text)] mt-1">{service.description}</p>}
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      {service.duration_minutes && (
                        <div className="flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3 text-[var(--primary-accent)]" />
                          <span className="font-mono text-xs text-[var(--muted-text)]">{service.duration_minutes} min</span>
                        </div>
                      )}
                      {service.show_price && (service.price_min || service.price_max) && (
                        <p className="font-mono text-xs text-[var(--primary-accent)] mt-1">
                          {service.price_min && service.price_max
                            ? `$${(service.price_min / 100).toFixed(0)}–$${(service.price_max / 100).toFixed(0)}`
                            : service.price_min
                            ? `From $${(service.price_min / 100).toFixed(0)}`
                            : `Up to $${((service.price_max ?? 0) / 100).toFixed(0)}`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          {Object.keys(additionalInfo).length > 0 && (
            <div className="px-6 md:px-12 py-8 border-b border-[var(--border-light)]">
              <div className="flex items-center gap-2 mb-6">
                <Info className="w-4 h-4 text-[var(--primary-accent)]" />
                <span className="mono-label-sm text-[var(--muted-text)]">ADDITIONAL INFO</span>
              </div>
              <div className="space-y-3">
                {Object.entries(additionalInfo).map(([key, value]) => (
                  <div key={key} className="flex gap-4 py-2 border-b border-[var(--border-light)] last:border-b-0">
                    <span className="mono-label-sm text-[var(--muted-text)] w-40 shrink-0 uppercase">{key}</span>
                    <span className="font-mono text-sm text-[var(--foreground)] opacity-70">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Providers */}
          {providers && providers.length > 0 && (
            <div className="px-6 md:px-12 py-8">
              <span className="mono-label-sm text-[var(--muted-text)] block mb-6">TEAM</span>
              <div className="grid sm:grid-cols-2 gap-4">
                {providers.map((provider) => (
                  <div key={provider.id} className="p-4 border border-[var(--border-light)] rounded-[2px]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[var(--primary-accent)]/10 flex items-center justify-center rounded-[2px]">
                        <span className="font-mono font-bold text-[var(--primary-accent)] text-sm">
                          {provider.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-mono text-sm font-medium text-[var(--foreground)]">{provider.name}</p>
                        {provider.title && <p className="font-mono text-xs text-[var(--muted-text)]">{provider.title}</p>}
                      </div>
                    </div>
                    {provider.specialties && (provider.specialties as string[]).length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-2">
                        {(provider.specialties as string[]).map((s) => (
                          <span key={s} className="font-mono text-[9px] px-2 py-0.5 bg-[var(--primary-accent)]/5 text-[var(--primary-accent)]">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Hours + How to Book */}
        <div>
          <div className="px-6 md:px-8 py-8 border-b border-[var(--border-light)]">
            <span className="mono-label-sm text-[var(--muted-text)] block mb-6">BUSINESS HOURS</span>
            <div className="space-y-0">
              {availability?.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-3 border-b border-[var(--border-light)] last:border-b-0">
                  <span className="font-mono text-xs font-medium uppercase text-[var(--foreground)]" style={{ letterSpacing: '0.15em' }}>
                    {dayNames[a.day_of_week]?.slice(0, 3)}
                  </span>
                  {a.is_open ? (
                    <span className="font-mono text-xs text-[var(--muted-text)]">
                      {formatTime(a.open_time)} – {formatTime(a.close_time)}
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-[var(--muted-text)] opacity-50">CLOSED</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* How to Book */}
          <div className="px-6 md:px-8 py-8 border-b border-[var(--border-light)]">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-[var(--primary-accent)]" />
              <span className="mono-label-sm text-[var(--muted-text)]">HOW TO BOOK</span>
            </div>
            <p className="font-mono text-sm text-[var(--muted-text)] mb-4">
              Open your AI assistant (ChatGPT, Claude, or any AI that supports tool connections) and say:
            </p>
            <div className="bg-white border border-[var(--border-light)] rounded-[2px] p-4 mb-3">
              <p className="font-mono text-xs text-[var(--primary-accent)] italic">
                &quot;Book me an appointment at {practice.name}&quot;
              </p>
            </div>
            <p className="font-mono text-xs text-[var(--muted-text)]">
              The AI assistant will check availability, show you open times, and complete the booking — all in the conversation.
            </p>
          </div>

          {/* This business accepts AI bookings */}
          <div className="px-6 md:px-8 py-8">
            <div className="bg-white border border-[var(--border-light)] rounded-[2px] p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[var(--primary-accent)] animate-pulse" />
                <span className="mono-label-sm text-[var(--primary-accent)]">ACTIVE</span>
              </div>
              <p className="font-mono text-xs text-[var(--muted-text)]">
                This business accepts AI-powered bookings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD Enhanced Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: practice.name,
            description: `${practice.industry}${address?.city ? ` in ${address.city}` : ''} — Book with AI at Practizio`,
            address: address ? {
              '@type': 'PostalAddress',
              streetAddress: address.street,
              addressLocality: address.city,
              addressRegion: address.state,
              postalCode: address.zip,
            } : undefined,
            telephone: practice.phone,
            url: practice.website || `${process.env.NEXT_PUBLIC_APP_URL}/directory/${practice.slug}`,
            image: undefined,
            openingHoursSpecification: availability?.filter(a => a.is_open).map(a => ({
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: dayNames[a.day_of_week],
              opens: a.open_time,
              closes: a.close_time,
            })),
            hasOfferCatalog: services && services.length > 0 ? {
              '@type': 'OfferCatalog',
              name: 'Services',
              itemListElement: services.map(s => ({
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: s.name,
                  description: s.description,
                },
              })),
            } : undefined,
          }),
        }}
      />
    </div>
  )
}
