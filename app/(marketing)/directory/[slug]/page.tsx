import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatTime } from '@/lib/utils'
import type { Metadata } from 'next'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data: practice } = await supabase
    .from('practices')
    .select('name, practice_type')
    .eq('slug', params.slug)
    .single()

  if (!practice) return { title: 'Practice Not Found' }

  return {
    title: `${practice.name} — AI-Accessible ${practice.practice_type} Practice`,
    description: `Book appointments at ${practice.name} through AI agents. MCP endpoint available.`,
  }
}

export default async function PracticeProfilePage({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const { data: practice } = await supabase
    .from('practices')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!practice) notFound()

  const [{ data: services }, { data: providers }, { data: availability }] = await Promise.all([
    supabase.from('services').select('*').eq('practice_id', practice.id),
    supabase.from('providers').select('*').eq('practice_id', practice.id),
    supabase.from('availability').select('*').eq('practice_id', practice.id).order('day_of_week'),
  ])

  const address = practice.address as { street?: string; city?: string; state?: string; zip?: string } | null
  const mcpEndpoint = `${process.env.NEXT_PUBLIC_APP_URL}/api/mcp/${practice.slug}`

  return (
    <div className="pt-[72px]">
      {/* Back nav */}
      <div className="px-6 md:px-12 py-4 hairline-b">
        <Link
          href="/directory"
          className="font-mono text-[10px] font-medium uppercase opacity-40 hover:opacity-100 transition-opacity duration-300"
          style={{ letterSpacing: '0.2em' }}
        >
          ← BACK_TO_DIRECTORY
        </Link>
      </div>

      {/* Header */}
      <div className="grid md:grid-cols-2 hairline-b">
        <div className="px-6 md:px-12 py-12 md:py-20 md:hairline-r">
          <span className="mono-label-sm opacity-40 block mb-4">
            {practice.practice_type?.toUpperCase().replace(/ /g, '_')}_PRACTICE
          </span>
          <h1 className="font-display font-black uppercase text-4xl md:text-6xl tracking-tightest">
            {practice.name || 'UNNAMED'}
          </h1>
          {address && (
            <p className="font-mono text-xs opacity-30 mt-4 uppercase" style={{ letterSpacing: '0.15em' }}>
              {[address.street, address.city, address.state, address.zip]
                .filter(Boolean)
                .join(' / ')}
            </p>
          )}
          <div className="flex gap-8 mt-6">
            {practice.phone && (
              <span className="font-mono text-xs opacity-40" style={{ letterSpacing: '0.1em' }}>
                {practice.phone}
              </span>
            )}
            {practice.website && (
              <a
                href={practice.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-accent hover:underline"
                style={{ letterSpacing: '0.1em' }}
              >
                {practice.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>

        {/* MCP Endpoint */}
        <div className="px-6 md:px-12 py-12 md:py-20 flex flex-col justify-between">
          <div>
            <span className="mono-label-sm opacity-40 block mb-4">MCP_ENDPOINT</span>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-green-500 inline-block" />
              <span className="mono-label-sm text-green-500">ACTIVE</span>
            </div>
            <code
              className="block font-mono text-sm text-accent mt-4 break-all"
              style={{ letterSpacing: '0.05em' }}
            >
              {mcpEndpoint}
            </code>
          </div>
          <p className="font-mono text-[10px] opacity-30 mt-6 uppercase" style={{ letterSpacing: '0.15em' }}>
            AI agents can connect to this endpoint to query practice info, check availability, and book appointments.
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="hairline-b">
        <div className="px-6 md:px-12 py-6 hairline-b">
          <span className="mono-label-sm opacity-40">SERVICES</span>
        </div>
        {services && services.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <div
                key={service.id}
                className={`px-6 md:px-12 py-8 hairline-b ${
                  (i + 1) % 3 !== 0 ? 'lg:hairline-r' : ''
                } ${(i + 1) % 2 !== 0 ? 'md:hairline-r lg:border-r-0' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-black uppercase text-base tracking-tightest">
                      {service.name}
                    </h3>
                    {service.duration_minutes && (
                      <span className="font-mono text-[10px] opacity-30 mt-1 block uppercase" style={{ letterSpacing: '0.2em' }}>
                        {service.duration_minutes}_MIN
                      </span>
                    )}
                  </div>
                  {(service.price_min || service.price_max) && (
                    <span className="font-mono text-sm text-accent">
                      {service.price_min && service.price_max
                        ? `$${service.price_min}–$${service.price_max}`
                        : service.price_min
                        ? `$${service.price_min}+`
                        : ''}
                    </span>
                  )}
                </div>
                {service.description && (
                  <p className="font-sans text-sm font-light opacity-40 mt-3">
                    {service.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 md:px-12 py-12">
            <p className="font-mono text-xs opacity-30 uppercase" style={{ letterSpacing: '0.2em' }}>
              NO_SERVICES_LISTED
            </p>
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="grid md:grid-cols-2 hairline-b">
        <div className="md:hairline-r">
          <div className="px-6 md:px-12 py-6 hairline-b">
            <span className="mono-label-sm opacity-40">HOURS</span>
          </div>
          <div className="px-6 md:px-12 py-6">
            {availability && availability.length > 0 ? (
              <div className="space-y-0">
                {DAYS.map((day, i) => {
                  const slot = availability.find((a) => a.day_of_week === i && a.is_open)
                  return (
                    <div key={day} className="flex items-center justify-between py-3 hairline-b last:border-b-0">
                      <span className="font-mono text-[10px] font-medium uppercase opacity-50" style={{ letterSpacing: '0.2em' }}>
                        {day.toUpperCase()}
                      </span>
                      {slot ? (
                        <span className="font-mono text-sm">
                          {formatTime(slot.open_time)} – {formatTime(slot.close_time)}
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] opacity-20 uppercase" style={{ letterSpacing: '0.2em' }}>
                          CLOSED
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="font-mono text-xs opacity-30 uppercase" style={{ letterSpacing: '0.2em' }}>
                NO_HOURS_LISTED
              </p>
            )}
          </div>
        </div>

        {/* Providers */}
        <div>
          <div className="px-6 md:px-12 py-6 hairline-b">
            <span className="mono-label-sm opacity-40">PROVIDERS</span>
          </div>
          <div className="px-6 md:px-12 py-6">
            {providers && providers.length > 0 ? (
              <div className="space-y-0">
                {providers.map((provider) => (
                  <div key={provider.id} className="py-4 hairline-b last:border-b-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 hairline flex items-center justify-center font-mono text-[10px] font-medium text-accent" style={{ letterSpacing: '0.1em' }}>
                        {provider.name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-display font-black uppercase text-sm tracking-tightest">
                          {provider.name}
                        </h4>
                        {provider.title && (
                          <span className="font-mono text-[10px] opacity-40 uppercase" style={{ letterSpacing: '0.15em' }}>
                            {provider.title.replace(/ /g, '_')}
                          </span>
                        )}
                      </div>
                    </div>
                    {provider.specialties && provider.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 ml-14">
                        {provider.specialties.map((s: string) => (
                          <span
                            key={s}
                            className="font-mono text-[9px] font-medium uppercase bg-accent/10 text-accent px-2 py-0.5"
                            style={{ letterSpacing: '0.2em' }}
                          >
                            {s.replace(/ /g, '_')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-mono text-xs opacity-30 uppercase" style={{ letterSpacing: '0.2em' }}>
                NO_PROVIDERS_LISTED
              </p>
            )}
          </div>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: practice.name,
            telephone: practice.phone,
            url: practice.website,
            address: address
              ? {
                  '@type': 'PostalAddress',
                  streetAddress: address.street,
                  addressLocality: address.city,
                  addressRegion: address.state,
                  postalCode: address.zip,
                }
              : undefined,
          }),
        }}
      />
    </div>
  )
}
