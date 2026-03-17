import { createAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/badge'
import { LeadStatusUpdater } from './lead-status-updater'

export default async function AdminLeadsPage() {
  const supabase = createAdminClient()

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  const statusVariant = (status: string): 'default' | 'accent' | 'success' | 'warning' | 'destructive' => {
    switch (status) {
      case 'new':
        return 'accent'
      case 'contacted':
        return 'default'
      case 'setup_in_progress':
        return 'warning'
      case 'setup_complete':
        return 'success'
      case 'not_interested':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl text-[var(--foreground)]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
          Leads
        </h1>
        <p className="mt-2 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
          {leads?.length ?? 0} TOTAL LEADS
        </p>
      </div>

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
                  BUSINESS
                </th>
                <th className="text-left px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                  OWNER
                </th>
                <th className="text-left px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                  EMAIL
                </th>
                <th className="text-left px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                  PHONE
                </th>
                <th className="text-left px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                  BOOKING SYSTEM
                </th>
                <th className="text-left px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                  STATUS
                </th>
                <th className="text-left px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                  REFERRED BY
                </th>
                <th className="text-left px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                  CREATED
                </th>
              </tr>
            </thead>
            <tbody>
              {leads?.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-[var(--cream)] transition-colors duration-200"
                  style={{
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <td className="px-6 py-4 text-sm text-[var(--foreground)]" style={{ fontFamily: "'Space Mono', monospace" }}>
                    {lead.business_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--foreground)]" style={{ fontFamily: "'Space Mono', monospace", opacity: 0.7 }}>
                    {lead.owner_name}
                  </td>
                  <td className="px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    {lead.email}
                  </td>
                  <td className="px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    {lead.phone || '—'}
                  </td>
                  <td className="px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    {lead.booking_system || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <LeadStatusUpdater
                      leadId={lead.id}
                      currentStatus={lead.status}
                    />
                  </td>
                  <td className="px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    {lead.referred_by_slug || lead.referral_source || '—'}
                  </td>
                  <td className="px-6 py-4 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    {new Date(lead.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
              {(!leads || leads.length === 0) && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-sm text-[var(--muted-text)]"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    No leads yet.
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
