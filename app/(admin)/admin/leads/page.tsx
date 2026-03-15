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
        <h1 className="font-display font-extrabold text-4xl tracking-tightest text-chrome-3d">
          LEADS
        </h1>
        <p className="mono-label-sm text-white/20 mt-2">
          {leads?.length ?? 0} TOTAL LEADS
        </p>
      </div>

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
                  BUSINESS
                </th>
                <th className="text-left px-6 py-4 mono-label-sm text-white/20">
                  OWNER
                </th>
                <th className="text-left px-6 py-4 mono-label-sm text-white/20">
                  EMAIL
                </th>
                <th className="text-left px-6 py-4 mono-label-sm text-white/20">
                  PHONE
                </th>
                <th className="text-left px-6 py-4 mono-label-sm text-white/20">
                  BOOKING SYSTEM
                </th>
                <th className="text-left px-6 py-4 mono-label-sm text-white/20">
                  STATUS
                </th>
                <th className="text-left px-6 py-4 mono-label-sm text-white/20">
                  REFERRED BY
                </th>
                <th className="text-left px-6 py-4 mono-label-sm text-white/20">
                  CREATED
                </th>
              </tr>
            </thead>
            <tbody>
              {leads?.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-white/[0.02] transition-colors duration-200"
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
                  }}
                >
                  <td className="px-6 py-4 font-mono text-sm text-white/80">
                    {lead.business_name}
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-white/60">
                    {lead.owner_name}
                  </td>
                  <td className="px-6 py-4 mono-label-sm text-white/40">
                    {lead.email}
                  </td>
                  <td className="px-6 py-4 mono-label-sm text-white/40">
                    {lead.phone || '—'}
                  </td>
                  <td className="px-6 py-4 mono-label-sm text-white/40">
                    {lead.booking_system || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <LeadStatusUpdater
                      leadId={lead.id}
                      currentStatus={lead.status}
                    />
                  </td>
                  <td className="px-6 py-4 mono-label-sm text-white/30">
                    {lead.referred_by_slug || lead.referral_source || '—'}
                  </td>
                  <td className="px-6 py-4 mono-label-sm text-white/20">
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
                    className="px-6 py-12 text-center font-mono text-sm text-white/20"
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
