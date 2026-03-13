import { NextResponse } from 'next/server'
import { stripe as getStripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { PLANS } from '@/lib/stripe/config'
import type Stripe from 'stripe'

// Determine plan key from a Stripe price ID
function getPlanFromPriceId(priceId: string): 'starter' | 'professional' | 'enterprise' | null {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.priceId === priceId) {
      return key as 'starter' | 'professional' | 'enterprise'
    }
  }
  return null
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    )
  }

  const adminClient = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode !== 'subscription') {
          break
        }

        const practiceId = session.metadata?.practice_id
        if (!practiceId) {
          console.error('No practice_id in checkout session metadata')
          break
        }

        // Retrieve the subscription to get the price ID
        const subscription = await getStripe().subscriptions.retrieve(
          session.subscription as string
        )
        const priceId = subscription.items.data[0]?.price.id
        const plan = priceId ? getPlanFromPriceId(priceId) : null

        const { error: updateError } = await adminClient
          .from('practices')
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            plan: plan || 'starter',
            is_active: true,
          })
          .eq('id', practiceId)

        if (updateError) {
          console.error('Failed to update practice after checkout:', updateError)
        }

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const practiceId = subscription.metadata?.practice_id

        if (!practiceId) {
          // Fall back to looking up by subscription ID
          const { data: practice } = await adminClient
            .from('practices')
            .select('id')
            .eq('stripe_subscription_id', subscription.id)
            .single()

          if (!practice) {
            console.error('No practice found for subscription:', subscription.id)
            break
          }

          const priceId = subscription.items.data[0]?.price.id
          const plan = priceId ? getPlanFromPriceId(priceId) : null
          const isActive = subscription.status === 'active' || subscription.status === 'trialing'

          const { error: updateError } = await adminClient
            .from('practices')
            .update({
              plan: plan || 'starter',
              is_active: isActive,
            })
            .eq('id', practice.id)

          if (updateError) {
            console.error('Failed to update practice subscription:', updateError)
          }

          break
        }

        const priceId = subscription.items.data[0]?.price.id
        const plan = priceId ? getPlanFromPriceId(priceId) : null
        const isActive = subscription.status === 'active' || subscription.status === 'trialing'

        const { error: updateError } = await adminClient
          .from('practices')
          .update({
            plan: plan || 'starter',
            is_active: isActive,
          })
          .eq('id', practiceId)

        if (updateError) {
          console.error('Failed to update practice subscription:', updateError)
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const practiceId = subscription.metadata?.practice_id

        if (practiceId) {
          const { error: updateError } = await adminClient
            .from('practices')
            .update({ is_active: false })
            .eq('id', practiceId)

          if (updateError) {
            console.error('Failed to deactivate practice:', updateError)
          }
        } else {
          // Fall back to looking up by subscription ID
          const { error: updateError } = await adminClient
            .from('practices')
            .update({ is_active: false })
            .eq('stripe_subscription_id', subscription.id)

          if (updateError) {
            console.error('Failed to deactivate practice by subscription ID:', updateError)
          }
        }

        break
      }

      default:
        // Unhandled event type - log but don't error
        console.log(`Unhandled Stripe event type: ${event.type}`)
    }
  } catch (error) {
    console.error('Error processing webhook event:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}
