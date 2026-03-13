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
      from: 'Practizio <noreply@practizio.com>',
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
        <p style="color: #8888A0; font-size: 12px;">Booked via Practizio AI Agent Network</p>
      </div>
    </body>
    </html>
  `
}
