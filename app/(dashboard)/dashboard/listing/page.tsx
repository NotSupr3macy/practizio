import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
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
        <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] block mb-3">PUBLIC LISTING</span>
        <h1 className="font-['Playfair_Display'] font-light text-3xl text-[var(--foreground)]">LISTING</h1>
        <p className="font-['Space_Mono'] text-sm text-[var(--muted-text)] mt-2">How your business appears to AI assistants and in the directory</p>
      </div>

      {/* AI Booking Link */}
      <div className="bg-white border border-[var(--border-light)] rounded-[2px]">
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-light)]">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-[var(--primary-accent)]" />
            <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--foreground)] opacity-60">YOUR AI BOOKING LINK</span>
            <Badge variant="success">ACTIVE</Badge>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 bg-[var(--cream)] border border-[var(--border-light)] px-4 py-3 rounded-[2px]">
            <code className="text-[var(--primary-accent)] font-['Space_Mono'] text-sm break-all flex-1">{mcpEndpoint}</code>
            <CopyButton text={mcpEndpoint} />
          </div>
          <div className="flex items-center gap-3 bg-[var(--cream)] border border-[var(--border-light)] px-4 py-3 mt-3 rounded-[2px]">
            <Globe className="w-4 h-4 text-[var(--muted-text)]" />
            <code className="font-['Space_Mono'] text-sm break-all flex-1 text-[var(--foreground)] opacity-60">{profileUrl}</code>
            <CopyButton text={profileUrl} />
          </div>
        </div>
      </div>

      {/* Business Info */}
      <div className="bg-white border border-[var(--border-light)] rounded-[2px]">
        <div className="p-6 border-b border-[var(--border-light)]">
          <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)]">BUSINESS INFO</span>
        </div>
        <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-8">
          <div><span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] block mb-1">NAME</span><p className="font-['Space_Mono'] text-sm text-[var(--foreground)]">{practice.name}</p></div>
          <div><span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] block mb-1">INDUSTRY</span><p className="font-['Space_Mono'] text-sm text-[var(--foreground)]">{practice.industry}</p></div>
          <div><span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] block mb-1">SLUG</span><p className="font-['Space_Mono'] text-sm text-[var(--primary-accent)]">{practice.slug}</p></div>
          <div><span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] block mb-1">PLAN</span><Badge variant="accent">{((practice.plan as string) || 'free').toUpperCase()}</Badge></div>
          {tags.length > 0 && (
            <div className="col-span-2">
              <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] block mb-1">TAGS</span>
              <div className="flex gap-2 flex-wrap">{tags.map((t) => <Badge key={t} variant="accent">{t}</Badge>)}</div>
            </div>
          )}
          {address && (
            <div className="col-span-2">
              <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] block mb-1">ADDRESS</span>
              <p className="font-['Space_Mono'] text-sm text-[var(--foreground)]">{[address.street, address.city, address.state, address.zip].filter(Boolean).join(', ')}</p>
            </div>
          )}
          {practice.phone && <div><span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] block mb-1">PHONE</span><p className="font-['Space_Mono'] text-sm text-[var(--foreground)]">{practice.phone}</p></div>}
          {practice.website && <div><span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] block mb-1">WEBSITE</span><p className="font-['Space_Mono'] text-sm text-[var(--foreground)]">{practice.website}</p></div>}
        </div>

        {Object.keys(additionalInfo).length > 0 && (
          <div className="p-6 border-t border-[var(--border-light)]">
            <div className="flex items-center gap-2 mb-4"><Info className="w-4 h-4 text-[var(--primary-accent)]" /><span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)]">ADDITIONAL INFO</span></div>
            {Object.entries(additionalInfo).map(([key, value]) => (
              <div key={key} className="flex gap-4 py-2 border-b border-[var(--border-light)] last:border-b-0">
                <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] w-40 shrink-0">{key.toUpperCase()}</span>
                <span className="font-['Space_Mono'] text-sm text-[var(--foreground)] opacity-70">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Services */}
      {services && services.length > 0 && (
        <div className="bg-white border border-[var(--border-light)] rounded-[2px]">
          <div className="p-6 border-b border-[var(--border-light)]"><span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)]">SERVICES ({services.length})</span></div>
          {services.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-6 py-3 border-b border-[var(--border-light)] last:border-b-0">
              <div>
                <p className="font-['Space_Mono'] text-sm text-[var(--foreground)]">{s.name}</p>
                {s.description && <p className="font-['Space_Mono'] text-xs text-[var(--muted-text)]">{s.description}</p>}
              </div>
              <div className="text-right">
                {s.duration_minutes && <p className="font-['Space_Mono'] text-xs text-[var(--muted-text)]">{s.duration_minutes} min</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
