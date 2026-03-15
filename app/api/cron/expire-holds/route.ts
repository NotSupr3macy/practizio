import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// ---------------------------------------------------------------------------
// Reservation Hold Auto-Cancel
// Checks for bookings with booking_status = 'pending_payment' where
// payment_deadline has passed, and cancels them.
//
// Call via: GET /api/cron/expire-holds
// Secured by CRON_SECRET header to prevent unauthorized access.
// Run every minute via Vercel Cron, external cron, or similar.
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Find all expired pending-payment bookings
  const { data: expiredBookings, error } = await supabase
    .from('appointments')
    .select('id, confirmation_number, practice_id')
    .eq('booking_status', 'pending_payment')
    .lt('payment_deadline', new Date().toISOString())

  if (error) {
    console.error('[expire-holds] Query error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!expiredBookings || expiredBookings.length === 0) {
    return NextResponse.json({ expired: 0 })
  }

  let expiredCount = 0

  for (const booking of expiredBookings) {
    // Update booking status
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        booking_status: 'payment_expired',
        status: 'cancelled',
        payment_status: 'expired',
      })
      .eq('id', booking.id)

    if (updateError) {
      console.error(`[expire-holds] Failed to expire ${booking.confirmation_number}:`, updateError)
      continue
    }

    // Log the auto-cancellation
    await supabase.from('ai_queries').insert({
      practice_id: booking.practice_id,
      tool_called: 'system_auto_cancel',
      query_payload: { reason: 'payment_deadline_expired', confirmation_number: booking.confirmation_number },
      response_payload: { status: 'cancelled', booking_status: 'payment_expired' },
    })

    expiredCount++
  }

  console.log(`[expire-holds] Expired ${expiredCount} bookings`)
  return NextResponse.json({ expired: expiredCount })
}
