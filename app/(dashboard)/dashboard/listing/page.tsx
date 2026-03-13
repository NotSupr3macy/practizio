import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Globe,
  Phone,
  MapPin,
  Shield,
  Copy,
  ExternalLink,
  Code,
} from 'lucide-react'
import { CopyButton } from './copy-button'

export const metadata = {
  title: 'My Listing',
}

export default async function ListingPage() {
  const supabase = createClient()

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

  // Fetch related data for the JSON preview
  const [{ data: services }, { data: providers }, { data: availability }] =
    await Promise.all([
      supabase
        .from('services')
        .select('name, price_min, price_max, duration_minutes, description')
        .eq('practice_id', practice.id),
      supabase
        .from('providers')
        .select('name, title, specialties, accepting_new_patients')
        .eq('practice_id', practice.id),
      supabase
        .from('availability')
        .select('day_of_week, open_time, close_time, is_open')
        .eq('practice_id', practice.id)
        .order('day_of_week'),
    ])

  const mcpEndpoint = `${process.env.NEXT_PUBLIC_APP_URL || 'https://practizio.com'}/api/mcp/${practice.slug}`

  const practiceJson = {
    name: practice.name,
    type: practice.practice_type,
    address: practice.address,
    phone: practice.phone,
    website: practice.website,
    accepted_insurance: practice.accepted_insurance,
    timezone: practice.timezone,
    services: services || [],
    providers: providers || [],
    availability: availability || [],
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="mono-label-sm opacity-40 block mb-3">PRACTICE_LISTING</span>
          <h1 className="font-display font-black uppercase text-3xl tracking-tightest">MY LISTING</h1>
          <p className="font-sans text-sm font-light opacity-50 mt-2">
            How AI agents see your practice
          </p>
        </div>
        <Badge variant={practice.is_active ? 'success' : 'warning'}>
          {practice.is_active ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      {/* MCP Endpoint */}
      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-accent" />
            MCP Endpoint
          </CardTitle>
          <CardDescription>
            AI agents use this endpoint to discover and interact with your practice
          </CardDescription>
        </CardHeader>
        <div className="flex items-center gap-3 bg-background p-4 hairline">
          <code className="flex-1 text-sm font-mono text-accent break-all">
            {mcpEndpoint}
          </code>
          <CopyButton text={mcpEndpoint} />
        </div>
      </Card>

      {/* Practice Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Practice Information</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                PRACTICE_NAME
              </label>
              <p className="text-sm font-mono text-foreground mt-1">{practice.name}</p>
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                TYPE
              </label>
              <p className="text-sm font-mono text-foreground mt-1 capitalize">
                {practice.practice_type}
              </p>
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                SLUG
              </label>
              <p className="text-sm font-mono text-muted-foreground mt-1">{practice.slug}</p>
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                PLAN
              </label>
              <div className="mt-1">
                <Badge variant="accent">{practice.plan}</Badge>
              </div>
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                TIMEZONE
              </label>
              <p className="text-sm font-mono text-foreground mt-1">{practice.timezone}</p>
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-accent mt-0.5" />
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  PHONE
                </label>
                <p className="text-sm font-mono text-foreground mt-1">
                  {practice.phone || 'Not set'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="w-4 h-4 text-accent mt-0.5" />
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  WEBSITE
                </label>
                <p className="text-sm font-mono text-foreground mt-1">
                  {practice.website ? (
                    <a
                      href={practice.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline inline-flex items-center gap-1"
                    >
                      {practice.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    'Not set'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-accent mt-0.5" />
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  ADDRESS
                </label>
                {practice.address ? (
                  <p className="text-sm font-mono text-foreground mt-1">
                    {practice.address.street}
                    <br />
                    {practice.address.city}, {practice.address.state}{' '}
                    {practice.address.zip}
                  </p>
                ) : (
                  <p className="text-sm font-mono text-muted-foreground mt-1">Not set</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-accent mt-0.5" />
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  ACCEPTED_INSURANCE
                </label>
                {practice.accepted_insurance && practice.accepted_insurance.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {practice.accepted_insurance.map((ins: string) => (
                      <Badge key={ins} variant="default">
                        {ins}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-mono text-muted-foreground mt-1">
                    None listed
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* JSON Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-accent" />
            AI Agent View
          </CardTitle>
          <CardDescription>
            This is the JSON representation AI agents receive when querying your practice
          </CardDescription>
        </CardHeader>
        <div className="relative">
          <pre className="bg-background p-4 hairline overflow-x-auto text-xs font-mono text-muted-foreground leading-relaxed max-h-[500px] overflow-y-auto">
            {JSON.stringify(practiceJson, null, 2)}
          </pre>
          <div className="absolute top-2 right-2">
            <CopyButton text={JSON.stringify(practiceJson, null, 2)} />
          </div>
        </div>
      </Card>
    </div>
  )
}
