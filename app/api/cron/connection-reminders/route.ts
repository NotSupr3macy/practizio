import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/resend'
import {
  connectionReminderDay3, connectionReminderDay3Subject,
  connectionReminderDay7, connectionReminderDay7Subject,
  connectionReminderDay14, connectionReminderDay14Subject,
} from '@/lib/email/connection-reminder'

const SEQUENCE_NAME = 'booking_connection_reminder'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://spadechat.com'

export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const now = new Date()
  let sent = 0
  let skipped = 0

  // Get all practices that haven't connected their booking system
  const { data: unconnected } = await supabase
    .from('practices')
    .select('id, name, slug, industry, user_id, created_at')
    .eq('booking_system_connected', false)
    .eq('is_active', true)

  if (!unconnected?.length) {
    return NextResponse.json({ message: 'No unconnected practices', sent: 0 })
  }

  for (const practice of unconnected) {
    try {
      // Get user email
      const { data: userData } = await supabase.auth.admin.getUserById(practice.user_id)
      if (!userData?.user?.email) { skipped++; continue }

      const email = userData.user.email
      const ownerName = userData.user.user_metadata?.name || email.split('@')[0]
      const profileUrl = `${APP_URL}/directory/${practice.slug}`
      const dashboardUrl = `${APP_URL}/dashboard`
      const createdAt = new Date(practice.created_at)
      const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

      // Get or create email sequence
      let { data: sequence } = await supabase
        .from('email_sequences')
        .select('*')
        .eq('practice_id', practice.id)
        .eq('sequence_name', SEQUENCE_NAME)
        .single()

      if (!sequence) {
        const { data: newSeq } = await supabase
          .from('email_sequences')
          .insert({
            practice_id: practice.id,
            sequence_name: SEQUENCE_NAME,
            current_step: 0,
          })
          .select()
          .single()
        sequence = newSeq
      }

      if (!sequence || sequence.completed) { skipped++; continue }

      // Determine which email to send
      let shouldSend = false
      let emailSubject = ''
      let emailHtml = ''
      let nextStep = sequence.current_step

      if (sequence.current_step === 0 && daysSinceCreation >= 3) {
        shouldSend = true
        emailSubject = connectionReminderDay3Subject()
        emailHtml = connectionReminderDay3({ ownerName, businessName: practice.name, profileUrl, dashboardUrl })
        nextStep = 1
      } else if (sequence.current_step === 1 && daysSinceCreation >= 7) {
        const lastSent = sequence.last_sent_at ? new Date(sequence.last_sent_at) : createdAt
        const daysSinceLastEmail = Math.floor((now.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24))
        if (daysSinceLastEmail >= 4) {
          shouldSend = true
          emailSubject = connectionReminderDay7Subject()
          emailHtml = connectionReminderDay7({ ownerName, dashboardUrl })
          nextStep = 2
        }
      } else if (sequence.current_step === 2 && daysSinceCreation >= 14) {
        const lastSent = sequence.last_sent_at ? new Date(sequence.last_sent_at) : createdAt
        const daysSinceLastEmail = Math.floor((now.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24))
        if (daysSinceLastEmail >= 7) {
          shouldSend = true
          emailSubject = connectionReminderDay14Subject()
          emailHtml = connectionReminderDay14({ ownerName, dashboardUrl })
          nextStep = 3
        }
      }

      if (!shouldSend) { skipped++; continue }

      // Send email
      const result = await sendEmail({ to: email, subject: emailSubject, html: emailHtml })

      if (result.success) {
        await supabase
          .from('email_sequences')
          .update({
            current_step: nextStep,
            last_sent_at: now.toISOString(),
            completed: nextStep >= 3,
          })
          .eq('id', sequence.id)
        sent++
      } else {
        skipped++
      }
    } catch (err) {
      console.error(`[Cron] Error processing practice ${practice.id}:`, err)
      skipped++
    }
  }

  return NextResponse.json({ message: 'Connection reminders processed', sent, skipped })
}
