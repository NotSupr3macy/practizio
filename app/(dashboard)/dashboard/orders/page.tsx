import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency } from '@/lib/utils'
import { ShoppingCart, DollarSign, Clock, Package } from 'lucide-react'

interface Order {
  id: string
  order_number: string
  customer_name: string
  status: string
  total: number
  created_at: string
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'accent' | 'success' | 'warning' | 'destructive'; className?: string }> = {
  pending: { label: 'PENDING', variant: 'warning' },
  confirmed: { label: 'CONFIRMED', variant: 'accent' },
  preparing: { label: 'PREPARING', variant: 'default', className: 'bg-orange-500/10 text-orange-500' },
  ready: { label: 'READY', variant: 'success' },
  completed: { label: 'COMPLETED', variant: 'default' },
  cancelled: { label: 'CANCELLED', variant: 'destructive' },
}

export default async function OrdersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: practice } = await supabase
    .from('practices')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!practice) redirect('/onboarding')

  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('practice_id', practice.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const orders = (data as Order[]) || []

  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <div className="space-y-8">
      <div>
        <span className="mono-label-sm opacity-40 block mb-3">ORDER MANAGEMENT</span>
        <h1 className="font-display font-black uppercase text-3xl tracking-tightest">ORDERS</h1>
        <p className="font-sans text-sm font-light opacity-50 mt-2">All orders placed through AI agents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="px-6 py-4">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-accent" />
            <div>
              <span className="mono-label-sm opacity-40 block">TOTAL ORDERS</span>
              <span className="font-display font-black text-2xl tracking-tightest">{totalOrders}</span>
            </div>
          </div>
        </Card>
        <Card className="px-6 py-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-500" />
            <div>
              <span className="mono-label-sm opacity-40 block">PENDING</span>
              <span className="font-display font-black text-2xl tracking-tightest">{pendingOrders}</span>
            </div>
          </div>
        </Card>
        <Card className="px-6 py-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-green-500" />
            <div>
              <span className="mono-label-sm opacity-40 block">TOTAL REVENUE</span>
              <span className="font-display font-black text-2xl tracking-tightest">{formatCurrency(totalRevenue)}</span>
            </div>
          </div>
        </Card>
      </div>

      {orders.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="hairline-b">
                  <th className="text-left mono-label-sm opacity-40 py-3 px-4">ORDER NUMBER</th>
                  <th className="text-left mono-label-sm opacity-40 py-3 px-4">CUSTOMER</th>
                  <th className="text-left mono-label-sm opacity-40 py-3 px-4">STATUS</th>
                  <th className="text-left mono-label-sm opacity-40 py-3 px-4">TOTAL</th>
                  <th className="text-left mono-label-sm opacity-40 py-3 px-4">CREATED</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const config = statusConfig[order.status] || statusConfig.pending
                  return (
                    <tr key={order.id} className="hairline-b hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10px] text-accent">{order.order_number}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">{order.customer_name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={config.variant} className={config.className}>
                          {config.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">{formatCurrency(order.total)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm opacity-60">{formatDate(order.created_at)}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="text-center py-16">
          <ShoppingCart className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="font-mono text-sm opacity-30">No orders placed yet via AI agents.</p>
        </Card>
      )}
    </div>
  )
}
