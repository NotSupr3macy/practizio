'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PLANS, type PlanKey } from '@/lib/stripe/config'
import { formatCurrency } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Practice } from '@/types/database'
import { CreditCard, Check, Zap, Crown, Building2 } from 'lucide-react'

const planIcons: Record<PlanKey, typeof Zap> = {
  starter: Zap,
  professional: Crown,
  enterprise: Building2,
}

export default function BillingPage() {
  const supabase = createClient()
  const [practice, setPractice] = useState<Practice | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState<PlanKey | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('practices')
      .select('*')
      .eq('user_id', user.id)
      .single()

    setPractice(data)
    setLoading(false)
  }

  async function handleManageBilling() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      // Handle error silently
    }
    setPortalLoading(false)
  }

  async function handleChangePlan(plan: PlanKey) {
    setCheckoutLoading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      // Handle error silently
    }
    setCheckoutLoading(null)
  }

  if (loading || !practice) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="mono-label-sm opacity-40">LOADING_BILLING</div>
      </div>
    )
  }

  const currentPlan = practice.plan as PlanKey

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <span className="mono-label-sm opacity-40 block mb-3">SUBSCRIPTION_MANAGEMENT</span>
        <h1 className="font-display font-black uppercase text-3xl tracking-tightest">BILLING</h1>
        <p className="font-sans text-sm font-light opacity-50 mt-2">
          Manage your subscription and billing details
        </p>
      </div>

      {/* Current Plan */}
      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-accent" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10">
              {(() => {
                const Icon = planIcons[currentPlan]
                return <Icon className="w-6 h-6 text-accent" />
              })()}
            </div>
            <div>
              <p className="text-lg font-display text-foreground">
                {PLANS[currentPlan].name}
              </p>
              <p className="text-2xl font-display text-accent">
                ${PLANS[currentPlan].price}
                <span className="text-sm font-mono text-muted-foreground">/month</span>
              </p>
            </div>
          </div>
          {practice.stripe_subscription_id && (
            <Button
              variant="outline"
              onClick={handleManageBilling}
              loading={portalLoading}
            >
              Manage Billing
            </Button>
          )}
        </div>
      </Card>

      {/* Plan Comparison */}
      <div>
        <h2 className="text-xl font-display text-foreground mb-4">All Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.entries(PLANS) as [PlanKey, (typeof PLANS)[PlanKey]][]).map(
            ([key, plan]) => {
              const isCurrentPlan = key === currentPlan
              const Icon = planIcons[key]
              const isPopular = 'popular' in plan && plan.popular

              return (
                <Card
                  key={key}
                  className={
                    isCurrentPlan
                      ? 'border-accent/50 relative'
                      : isPopular
                        ? 'border-accent/20 relative'
                        : undefined
                  }
                >
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-4">
                      <Badge variant="accent">Current Plan</Badge>
                    </div>
                  )}
                  {isPopular && !isCurrentPlan && (
                    <div className="absolute -top-3 left-4">
                      <Badge variant="success">Most Popular</Badge>
                    </div>
                  )}

                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-5 h-5 text-accent" />
                      <h3 className="text-lg font-display text-foreground">
                        {plan.name}
                      </h3>
                    </div>

                    <p className="text-3xl font-display text-foreground mb-6">
                      ${plan.price}
                      <span className="text-sm font-mono text-muted-foreground">
                        /mo
                      </span>
                    </p>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm font-mono text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {isCurrentPlan ? (
                      <Button variant="outline" disabled className="w-full">
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        variant={isPopular ? 'accent' : 'outline'}
                        className="w-full"
                        onClick={() => handleChangePlan(key)}
                        loading={checkoutLoading === key}
                      >
                        {key === 'enterprise'
                          ? 'Contact Sales'
                          : currentPlan === 'enterprise' ||
                              (currentPlan === 'professional' && key === 'starter')
                            ? 'Downgrade'
                            : 'Upgrade'}
                      </Button>
                    )}
                  </div>
                </Card>
              )
            }
          )}
        </div>
      </div>
    </div>
  )
}
