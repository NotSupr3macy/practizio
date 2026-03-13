import { NextResponse } from 'next/server'
import { stripe as getStripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST() {
  try {
    // Get the current authenticated user
    const supabase = createClient()
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

    // Use admin client to look up the practice's Stripe customer ID
    const adminClient = createAdminClient()

    const { data: practice, error: practiceError } = await adminClient
      .from('practices')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (practiceError || !practice) {
      return NextResponse.json(
        { error: 'Practice not found' },
        { status: 404 }
      )
    }

    if (!practice.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No billing account found. Please subscribe to a plan first.' },
        { status: 400 }
      )
    }

    // Create a Stripe billing portal session
    const session = await getStripe().billingPortal.sessions.create({
      customer: practice.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    )
  }
}
