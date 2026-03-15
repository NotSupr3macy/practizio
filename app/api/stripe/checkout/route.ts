import { NextResponse } from 'next/server'
import { stripe as getStripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { priceId, practiceId } = await request.json()

    if (!priceId || !practiceId) {
      return NextResponse.json(
        { error: 'Missing required fields: priceId and practiceId' },
        { status: 400 }
      )
    }

    // Get the current authenticated user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Use admin client for DB operations to bypass RLS
    const adminClient = createAdminClient()

    // Look up the practice and check for existing Stripe customer
    const { data: practice, error: practiceError } = await adminClient
      .from('practices')
      .select('id, stripe_customer_id, name')
      .eq('id', practiceId)
      .eq('user_id', user.id)
      .single()

    if (practiceError || !practice) {
      return NextResponse.json(
        { error: 'Practice not found' },
        { status: 404 }
      )
    }

    let customerId = practice.stripe_customer_id

    // Create a new Stripe customer if one doesn't exist
    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: user.email,
        name: practice.name,
        metadata: {
          practice_id: practiceId,
          user_id: user.id,
        },
      })

      customerId = customer.id

      // Store the Stripe customer ID on the practice
      await adminClient
        .from('practices')
        .update({ stripe_customer_id: customerId })
        .eq('id', practiceId)
    }

    // Create the Checkout Session
    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
      metadata: {
        practice_id: practiceId,
      },
      subscription_data: {
        metadata: {
          practice_id: practiceId,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
