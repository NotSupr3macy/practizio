import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/resend'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, business, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Send notification to SpadeChat team
    const contactEmail = process.env.CONTACT_EMAIL || process.env.ADMIN_EMAILS?.split(',')[0] || ''
    const result = await sendEmail({
      to: contactEmail,
      subject: `New Inquiry from ${name}${business ? ` — ${business}` : ''}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0A0A0A; color: #E5E5E5; padding: 40px 20px;">
          <div style="max-width: 520px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 32px;">
              <span style="font-family: monospace; font-weight: 800; font-size: 24px; letter-spacing: -0.03em; color: #fff;">SPADECHAT</span>
            </div>
            <div style="background: #111; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 32px;">
              <h1 style="font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: #2869A9;">New Contact Inquiry</h1>
              <p style="color: #999; font-size: 14px; margin: 0 0 24px 0;">Someone reached out through the website.</p>

              <div style="background: #0A0A0A; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0 0 12px 0; font-size: 13px;"><strong style="color: #2869A9;">Name:</strong> ${name}</p>
                <p style="margin: 0 0 12px 0; font-size: 13px;"><strong style="color: #2869A9;">Email:</strong> ${email}</p>
                ${business ? `<p style="margin: 0 0 12px 0; font-size: 13px;"><strong style="color: #2869A9;">Business:</strong> ${business}</p>` : ''}
                <p style="margin: 0; font-size: 13px;"><strong style="color: #2869A9;">Message:</strong></p>
                <p style="margin: 8px 0 0 0; font-size: 13px; color: #ccc; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (!result.success) {
      console.error('Failed to send contact email:', result.error)
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
