'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PLANS } from '@/lib/stripe/config'
import type { Practice } from '@/types/database'
import { CreditCard, Check, Zap } from 'lucide-react'

export default function BillingPage() {
  const supabase = createClient()
  const [practice, setPractice] = useState<Practice | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingsThisMonth, setBookingsThisMonth] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase.from('practices').select('*').eq('user_id', user.id).single()
    setPractice(data)

    if (data) {
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const { count } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('practice_id', data.id)
        .gte('created_at', monthStart)

      setBookingsThisMonth(count ?? 0)
    }
    setLoading(false)
  }

  async function handleManageBilling() {
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  async function handleUpgrade(plan: string) {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)]">LOADING BILLING</div></div>
  }

  const currentPlan = (practice?.plan as string) || 'free'
  const currentPlanConfig = PLANS[currentPlan as keyof typeof PLANS]
  const bookingLimit = currentPlanConfig?.bookingLimit ?? 10

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[var(--muted-text)] block mb-3">SUBSCRIPTION MANAGEMENT</span>
        <h1 className="font-['Playfair_Display'] font-light text-3xl text-[var(--foreground)]">BILLING</h1>
      </div>

      {/* Current Plan */}
      <div className="bg-white border border-[var(--border-light)] rounded-[2px]">
        <div className="p-6 border-b border-[var(--border-light)]">
          <h3 className="font-['Playfair_Display'] font-light text-lg text-[var(--foreground)] flex items-center gap-2"><CreditCard className="w-5 h-5 text-[var(--primary-accent)]" />Current Plan</h3>
          <p className="font-['Space_Mono'] text-sm text-[var(--muted-text)] mt-1">
            You are on the <span className="text-[var(--primary-accent)] font-medium">{currentPlanConfig?.name || 'Free'}</span> plan
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-[var(--cream)] border border-[var(--border-light)] rounded-[2px]">
            <div>
              <p className="font-['Space_Mono'] text-sm text-[var(--foreground)]">AI Bookings This Month</p>
              <p className="font-['Space_Mono'] text-2xl font-bold text-[var(--primary-accent)] mt-1">{bookingsThisMonth}</p>
            </div>
            <div className="text-right">
              <p className="font-['Space_Mono'] text-xs text-[var(--muted-text)]">Limit</p>
              <p className="font-['Space_Mono'] text-lg text-[var(--muted-text)]">{bookingLimit === Infinity ? 'Unlimited' : bookingLimit}</p>
            </div>
          </div>
          {bookingLimit !== Infinity && (
            <div className="w-full bg-[var(--cream)] border border-[var(--border-light)] h-2 overflow-hidden rounded-[2px]">
              <div className="h-full bg-[var(--primary-accent)] transition-all" style={{ width: `${Math.min(100, (bookingsThisMonth / bookingLimit) * 100)}%` }} />
            </div>
          )}
          {practice?.stripe_subscription_id && (
            <Button variant="outline" onClick={handleManageBilling}>Manage Billing</Button>
          )}
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-0">
        {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => {
          const isCurrent = key === currentPlan
          const isPopular = 'popular' in plan && plan.popular
          return (
            <div key={key} className={`p-8 border border-[var(--border-light)] ${isCurrent ? 'bg-[rgba(61,112,104,0.05)] border-[var(--primary-accent)]/30' : 'bg-white'}`}>
              <div className="flex items-center gap-2 mb-4">
                {isPopular && <Badge variant="accent">POPULAR</Badge>}
                {isCurrent && <Badge variant="success">CURRENT</Badge>}
              </div>
              <h3 className="font-['Playfair_Display'] font-light text-xl text-[var(--foreground)]">{plan.name}</h3>
              <div className="mt-2 mb-6">
                <span className="font-['Playfair_Display'] font-light text-3xl text-[var(--foreground)]">${plan.price}</span>
                {plan.price > 0 && <span className="font-['Space_Mono'] text-xs text-[var(--muted-text)]">/MO</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[var(--primary-accent)] shrink-0 mt-0.5" />
                    <span className="font-['Space_Mono'] text-sm text-[var(--foreground)] opacity-70">{feature}</span>
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <Button variant="outline" disabled className="w-full">Current Plan</Button>
              ) : plan.price === 0 ? (
                <Button variant="outline" disabled className="w-full">Free Tier</Button>
              ) : (
                <Button variant={isPopular ? 'accent' : 'outline'} onClick={() => handleUpgrade(key)} className="w-full">
                  <Zap className="w-4 h-4 mr-1" />Upgrade
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
