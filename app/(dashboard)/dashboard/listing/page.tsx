import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Bot, Globe, MapPin, Phone, Tag, Info } from 'lucide-react'
import { CopyButton } from './copy-button'

export default async function ListingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: practice } = await supabase.from('practices').select('*').eq('user_id', user.id).single()
  if (!practice) redirect('/onboarding')

  const [{ data: services }, { data: availability }, { data: providers }] = await Promise.all([
    supabase.from('services').select('*').eq('practice_id', practice.id).order('name'),
    supabase.from('availability').select('*').eq('practice_id', practice.id).order('day_of_week'),
    supabase.from('providers').select('*').eq('practice_id', practice.id),
  ])

  const mcpEndpoint = `${process.env.NEXT_PUBLIC_APP_URL}/api/mcp/${practice.slug}`
  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/directory/${practice.slug}`
  const address = practice.address as { street?: string; city?: string; state?: string; zip?: string } | null
  const tags = (practice.tags as string[]) ?? []
  const additionalInfo = (practice.additional_info as Record<string, string>) ?? {}

  return (
    <div className="space-y-8">
      <div>
        <span className="mono-label-sm opacity-40 block mb-3">PUBLIC LISTING</span>
        <h1 className="font-display font-black uppercase text-3xl tracking-tightest">LISTING</h1>
        <p className="font-sans text-sm font-light opacity-50 mt-2">How your business appears to AI assistants and in the directory</p>
      </div>

      {/* AI Booking Link */}
      <Card>
        <div className="flex items-center justify-between p-6 hairline-b">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-accent" />
            <span className="mono-label-sm opacity-60">YOUR AI BOOKING LINK</span>
            <Badge variant="success">ACTIVE</Badge>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 bg-background hairline px-4 py-3">
            <code className="text-accent font-mono text-sm break-all flex-1">{mcpEndpoint}</code>
            <CopyButton text={mcpEndpoint} />
          </div>
          <div className="flex items-center gap-3 bg-background hairline px-4 py-3 mt-3">
            <Globe className="w-4 h-4 opacity-40" />
            <code className="font-mono text-sm break-all flex-1 opacity-60">{profileUrl}</code>
            <CopyButton text={profileUrl} />
          </div>
        </div>
      </Card>

      {/* Business Info */}
      <Card>
        <div className="p-6 hairline-b">
          <span className="mono-label-sm opacity-40">BUSINESS INFO</span>
        </div>
        <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-8">
          <div><span className="mono-label-sm opacity-30 block mb-1">NAME</span><p className="font-mono text-sm">{practice.name}</p></div>
          <div><span className="mono-label-sm opacity-30 block mb-1">INDUSTRY</span><p className="font-mono text-sm">{practice.industry}</p></div>
          <div><span className="mono-label-sm opacity-30 block mb-1">SLUG</span><p className="font-mono text-sm text-accent">{practice.slug}</p></div>
          <div><span className="mono-label-sm opacity-30 block mb-1">PLAN</span><Badge variant="accent">{((practice.plan as string) || 'free').toUpperCase()}</Badge></div>
          {tags.length > 0 && (
            <div className="col-span-2">
              <span className="mono-label-sm opacity-30 block mb-1">TAGS</span>
              <div className="flex gap-2 flex-wrap">{tags.map((t) => <Badge key={t} variant="accent">{t}</Badge>)}</div>
            </div>
          )}
          {address && (
            <div className="col-span-2">
              <span className="mono-label-sm opacity-30 block mb-1">ADDRESS</span>
              <p className="font-mono text-sm">{[address.street, address.city, address.state, address.zip].filter(Boolean).join(', ')}</p>
            </div>
          )}
          {practice.phone && <div><span className="mono-label-sm opacity-30 block mb-1">PHONE</span><p className="font-mono text-sm">{practice.phone}</p></div>}
          {practice.website && <div><span className="mono-label-sm opacity-30 block mb-1">WEBSITE</span><p className="font-mono text-sm">{practice.website}</p></div>}
        </div>

        {Object.keys(additionalInfo).length > 0 && (
          <div className="p-6 hairline-t">
            <div className="flex items-center gap-2 mb-4"><Info className="w-4 h-4 text-accent" /><span className="mono-label-sm opacity-40">ADDITIONAL INFO</span></div>
            {Object.entries(additionalInfo).map(([key, value]) => (
              <div key={key} className="flex gap-4 py-2 hairline-b last:border-b-0">
                <span className="mono-label-sm opacity-40 w-40 shrink-0">{key.toUpperCase()}</span>
                <span className="font-mono text-sm opacity-70">{value}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Services */}
      {services && services.length > 0 && (
        <Card>
          <div className="p-6 hairline-b"><span className="mono-label-sm opacity-40">SERVICES ({services.length})</span></div>
          {services.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-6 py-3 hairline-b last:border-b-0">
              <div>
                <p className="font-mono text-sm">{s.name}</p>
                {s.description && <p className="font-sans text-xs opacity-40">{s.description}</p>}
              </div>
              <div className="text-right">
                {s.duration_minutes && <p className="font-mono text-xs opacity-40">{s.duration_minutes} min</p>}
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
