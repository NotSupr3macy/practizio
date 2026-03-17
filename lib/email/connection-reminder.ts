// Connection reminder email templates (Day 3, Day 7, Day 14)

const WRAPPER_START = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"></head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0A0A0A; color: #E5E5E5; padding: 40px 20px;">
    <div style="max-width: 520px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 32px;">
        <span style="font-family: monospace; font-weight: 800; font-size: 24px; letter-spacing: -0.03em; color: #fff;">SPADECHAT</span>
      </div>
      <div style="background: #111; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 32px;">
`

const WRAPPER_END = `
      </div>
      <p style="text-align: center; color: #444; font-size: 11px; margin-top: 24px;">SpadeChat — Making every business AI-bookable</p>
    </div>
  </body>
  </html>
`

function connectButton(dashboardUrl: string) {
  return `<a href="${dashboardUrl}" style="display: inline-block; background: #2869A9; color: #FFFFFF; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">CONNECT YOUR BOOKING SYSTEM</a>`
}

export function connectionReminderDay3({
  ownerName,
  businessName,
  profileUrl,
  dashboardUrl,
}: {
  ownerName: string
  businessName: string
  profileUrl: string
  dashboardUrl: string
}) {
  return `${WRAPPER_START}
    <h1 style="font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: #2869A9;">30 seconds to finish your setup</h1>
    <p style="color: #999; font-size: 14px; margin: 0 0 24px 0;">Hi ${ownerName},</p>
    <p style="font-size: 14px; line-height: 1.6; margin-bottom: 16px;">Your SpadeChat profile for <strong>${businessName}</strong> is live and looking great:</p>
    <div style="background: #0A0A0A; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <a href="${profileUrl}" style="color: #2869A9; text-decoration: none; font-size: 13px;">View your profile →</a>
    </div>
    <p style="font-size: 14px; line-height: 1.6; margin-bottom: 8px;">You're just one step away from receiving AI bookings — connect your booking system:</p>
    ${connectButton(dashboardUrl)}
    <p style="color: #666; font-size: 13px; margin-top: 20px;">Most business owners finish this in under a minute.</p>
    <p style="color: #666; font-size: 13px; margin-top: 16px;">— Jackson</p>
  ${WRAPPER_END}`
}

export function connectionReminderDay3Subject() {
  return '30 seconds to finish your SpadeChat setup'
}

export function connectionReminderDay7({
  ownerName,
  dashboardUrl,
}: {
  ownerName: string
  dashboardUrl: string
}) {
  return `${WRAPPER_START}
    <h1 style="font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: #2869A9;">Quick reminder</h1>
    <p style="color: #999; font-size: 14px; margin: 0 0 24px 0;">Hi ${ownerName},</p>
    <p style="font-size: 14px; line-height: 1.6; margin-bottom: 16px;">Wanted to follow up — your SpadeChat profile is live but you're not receiving AI bookings yet because your booking system isn't connected.</p>
    ${connectButton(dashboardUrl)}
    <p style="color: #666; font-size: 13px; margin-top: 20px;">If you're having trouble or have questions, just reply to this email and I'll help you out personally.</p>
    <p style="color: #666; font-size: 13px; margin-top: 16px;">— Jackson</p>
  ${WRAPPER_END}`
}

export function connectionReminderDay7Subject() {
  return 'Quick reminder from SpadeChat'
}

export function connectionReminderDay14({
  ownerName,
  dashboardUrl,
}: {
  ownerName: string
  dashboardUrl: string
}) {
  return `${WRAPPER_START}
    <h1 style="font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: #2869A9;">Need help connecting?</h1>
    <p style="color: #999; font-size: 14px; margin: 0 0 24px 0;">Hi ${ownerName},</p>
    <p style="font-size: 14px; line-height: 1.6; margin-bottom: 16px;">I noticed you haven't connected your booking system yet. If something's not working or you're not sure how, I'm happy to walk you through it.</p>
    <p style="font-size: 14px; line-height: 1.6; margin-bottom: 8px;">Just reply with a good time to call, or connect on your own here:</p>
    ${connectButton(dashboardUrl)}
    <p style="color: #666; font-size: 13px; margin-top: 16px;">— Jackson</p>
  ${WRAPPER_END}`
}

export function connectionReminderDay14Subject() {
  return 'Need help connecting your booking system?'
}
