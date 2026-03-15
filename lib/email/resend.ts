import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    const { data, error } = await getResend().emails.send({
      from: 'SpadeChat <noreply@spadechat.com>',
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email send exception:', error)
    return { success: false, error }
  }
}

export function welcomeEmail({
  businessName,
  industry,
  dashboardUrl,
  profileUrl,
}: {
  businessName: string
  industry: string
  dashboardUrl: string
  profileUrl: string
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0A0A0A; color: #E5E5E5; padding: 40px 20px;">
      <div style="max-width: 520px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="font-family: monospace; font-weight: 800; font-size: 24px; letter-spacing: -0.03em; color: #fff;">SPADECHAT</span>
        </div>
        <div style="background: #111; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 32px;">
          <h1 style="font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: #2869A9;">Your AI booking is live!</h1>
          <p style="color: #999; font-size: 14px; margin: 0 0 24px 0;">${businessName} is now discoverable by AI assistants.</p>

          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 16px;">Customers can now find and book with you through AI assistants like ChatGPT and Claude. Here's what you can do:</p>

          <div style="background: #0A0A0A; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 12px 0; font-size: 13px;"><strong style="color: #2869A9;">1.</strong> <a href="${dashboardUrl}" style="color: #2869A9; text-decoration: none;">View your dashboard</a> to track bookings and AI activity</p>
            <p style="margin: 0 0 12px 0; font-size: 13px;"><strong style="color: #2869A9;">2.</strong> <a href="${profileUrl}" style="color: #2869A9; text-decoration: none;">Check your profile page</a> and share it with customers</p>
            <p style="margin: 0; font-size: 13px;"><strong style="color: #2869A9;">3.</strong> Try it: ask an AI assistant "Find a ${industry} near me"</p>
          </div>

          <a href="${dashboardUrl}" style="display: inline-block; background: #2869A9; color: #FFFFFF; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 8px;">GO TO DASHBOARD</a>
        </div>
        <p style="text-align: center; color: #444; font-size: 11px; margin-top: 24px;">SpadeChat — Making every business AI-bookable</p>
      </div>
    </body>
    </html>
  `
}

export function leadConfirmationEmail({
  ownerName,
  businessName,
}: {
  ownerName: string
  businessName: string
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0A0A0A; color: #E5E5E5; padding: 40px 20px;">
      <div style="max-width: 520px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="font-family: monospace; font-weight: 800; font-size: 24px; letter-spacing: -0.03em; color: #fff;">SPADECHAT</span>
        </div>
        <div style="background: #111; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 32px;">
          <h1 style="font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: #2869A9;">Thanks, ${ownerName}!</h1>
          <p style="color: #999; font-size: 14px; margin: 0 0 24px 0;">We'll have ${businessName}'s AI booking set up within 24 hours.</p>

          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 16px;">Here's what happens next:</p>

          <div style="background: #0A0A0A; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 12px 0; font-size: 13px;"><strong style="color: #2869A9;">1.</strong> We'll set up your business profile, services, and hours</p>
            <p style="margin: 0 0 12px 0; font-size: 13px;"><strong style="color: #2869A9;">2.</strong> You'll get an email with your dashboard login</p>
            <p style="margin: 0; font-size: 13px;"><strong style="color: #2869A9;">3.</strong> Customers can start booking through AI immediately</p>
          </div>

          <p style="color: #666; font-size: 13px;">No action needed from you — we'll take it from here. If you have any questions, just reply to this email.</p>
        </div>
        <p style="text-align: center; color: #444; font-size: 11px; margin-top: 24px;">SpadeChat — Making every business AI-bookable</p>
      </div>
    </body>
    </html>
  `
}

export function adminSetupInviteEmail({
  businessName,
  dashboardUrl,
  resetPasswordUrl,
}: {
  businessName: string
  dashboardUrl: string
  resetPasswordUrl: string
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0A0A0A; color: #E5E5E5; padding: 40px 20px;">
      <div style="max-width: 520px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="font-family: monospace; font-weight: 800; font-size: 24px; letter-spacing: -0.03em; color: #fff;">SPADECHAT</span>
        </div>
        <div style="background: #111; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 32px;">
          <h1 style="font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: #2869A9;">${businessName} is now AI-bookable!</h1>
          <p style="color: #999; font-size: 14px; margin: 0 0 24px 0;">Your business has been set up on SpadeChat. Customers can now book with you through AI assistants.</p>

          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 16px;">To access your dashboard:</p>

          <div style="background: #0A0A0A; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 12px 0; font-size: 13px;"><strong style="color: #2869A9;">1.</strong> <a href="${resetPasswordUrl}" style="color: #2869A9; text-decoration: none;">Set your password</a></p>
            <p style="margin: 0; font-size: 13px;"><strong style="color: #2869A9;">2.</strong> <a href="${dashboardUrl}" style="color: #2869A9; text-decoration: none;">Log in to your dashboard</a></p>
          </div>

          <a href="${resetPasswordUrl}" style="display: inline-block; background: #2869A9; color: #FFFFFF; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 8px;">SET YOUR PASSWORD</a>
        </div>
        <p style="text-align: center; color: #444; font-size: 11px; margin-top: 24px;">SpadeChat — Making every business AI-bookable</p>
      </div>
    </body>
    </html>
  `
}

export function appointmentConfirmationEmail({
  patientName,
  practiceName,
  service,
  date,
  time,
  confirmationNumber,
}: {
  patientName: string
  practiceName: string
  service: string
  date: string
  time: string
  confirmationNumber: string
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: monospace; background: #0A0A0F; color: #fff; padding: 40px;">
      <div style="max-width: 500px; margin: 0 auto; background: #12121A; border: 1px solid #2A2A3E; border-radius: 12px; padding: 32px;">
        <h1 style="color: #00D4FF; font-size: 20px; margin-bottom: 24px;">Appointment Confirmed</h1>
        <p>Hi ${patientName},</p>
        <p>Your appointment has been booked successfully.</p>
        <div style="background: #0A0A0F; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>Practice:</strong> ${practiceName}</p>
          <p style="margin: 4px 0;"><strong>Service:</strong> ${service}</p>
          <p style="margin: 4px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 4px 0;"><strong>Time:</strong> ${time}</p>
          <p style="margin: 4px 0; color: #00D4FF;"><strong>Confirmation #:</strong> ${confirmationNumber}</p>
        </div>
        <p style="color: #8888A0; font-size: 12px;">Booked via SpadeChat AI Agent Network</p>
      </div>
    </body>
    </html>
  `
}
