import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | SpadeChat',
  description: 'SpadeChat privacy policy — how we collect, use, and protect your data.',
}

const sectionLabel = {
  fontFamily: 'monospace',
  fontSize: '10px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.3em',
  color: 'rgba(255,255,255,0.25)',
  marginBottom: '16px',
  display: 'block',
}

const sectionHeading = {
  fontFamily: "'Playfair Display', serif",
  fontWeight: 300,
  fontSize: '22px',
  color: 'var(--white)',
  lineHeight: 1.2,
  marginBottom: '16px',
}

const bodyText = {
  fontFamily: "'Playfair Display', serif",
  fontWeight: 300,
  fontSize: '15px',
  color: 'rgba(255,255,255,0.4)',
  lineHeight: 1.8,
  marginBottom: '12px',
}

const listStyle = {
  ...bodyText,
  paddingLeft: '20px',
  marginBottom: '12px',
}

export default function PrivacyPolicyPage() {
  return (
    <section
      className="min-h-screen py-32 px-6 md:px-10"
      style={{ background: 'var(--navy)' }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <span
          className="font-mono text-[10px] uppercase block mb-6"
          style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}
        >
          LEGAL
        </span>

        <h1
          className="editorial-heading mb-6"
          style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            color: 'var(--white)',
            lineHeight: 1.1,
          }}
        >
          Privacy{' '}
          <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.35)' }}>
            Policy.
          </span>
        </h1>

        <p style={{ ...bodyText, marginBottom: '48px', maxWidth: 480 }}>
          Last updated: March 2026
        </p>

        {/* Introduction */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>OVERVIEW</span>
          <h2 style={sectionHeading}>Introduction</h2>
          <p style={bodyText}>
            SpadeChat (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates an AI booking platform
            that makes businesses discoverable by AI assistants. This Privacy Policy explains how
            we collect, use, disclose, and safeguard your information when you use our platform
            at spadechat.com.
          </p>
          <p style={bodyText}>
            By using SpadeChat, you agree to the collection and use of information in accordance
            with this policy. If you do not agree, please discontinue use of the platform.
          </p>
        </div>

        {/* Information We Collect */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>DATA COLLECTION</span>
          <h2 style={sectionHeading}>Information We Collect</h2>
          <p style={bodyText}>
            We collect information that you provide directly and information generated through
            your use of the platform:
          </p>
          <p style={{ ...bodyText, color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>
            Business Information
          </p>
          <ul style={listStyle}>
            <li>Business name, description, and category</li>
            <li>Services offered, pricing, and availability</li>
            <li>Business address and operating hours</li>
            <li>Contact information (email, phone number)</li>
          </ul>
          <p style={{ ...bodyText, color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>
            Account Information
          </p>
          <ul style={listStyle}>
            <li>Name and email address</li>
            <li>Authentication credentials (managed securely via Supabase)</li>
            <li>Google Calendar connection data (via OAuth, for scheduling)</li>
          </ul>
          <p style={{ ...bodyText, color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>
            Booking Data
          </p>
          <ul style={listStyle}>
            <li>Customer name and contact details submitted during bookings</li>
            <li>Appointment dates, times, and service selections</li>
            <li>Booking status and history</li>
          </ul>
          <p style={{ ...bodyText, color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>
            Usage Data
          </p>
          <ul style={listStyle}>
            <li>Pages visited and features used</li>
            <li>Device and browser information</li>
            <li>Referral sources</li>
          </ul>
        </div>

        {/* How We Use Your Information */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>DATA USAGE</span>
          <h2 style={sectionHeading}>How We Use Your Information</h2>
          <p style={bodyText}>We use the information we collect to:</p>
          <ul style={listStyle}>
            <li>Make your business discoverable by AI assistants such as ChatGPT, Claude, and Gemini</li>
            <li>Facilitate bookings between customers and your business</li>
            <li>Generate your AI booking link and directory listing</li>
            <li>Sync appointments with your Google Calendar</li>
            <li>Process payments through Stripe</li>
            <li>Send transactional emails (booking confirmations, notifications)</li>
            <li>Improve and maintain the platform</li>
            <li>Respond to inquiries and provide support</li>
          </ul>
        </div>

        {/* Third-Party Services */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>THIRD PARTIES</span>
          <h2 style={sectionHeading}>Third-Party Services</h2>
          <p style={bodyText}>
            SpadeChat integrates with the following third-party services to operate the platform.
            Each has its own privacy policy governing how they handle data:
          </p>
          <ul style={listStyle}>
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Supabase</strong> — Authentication
              and database hosting. Manages user accounts and stores platform data securely.
            </li>
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Stripe</strong> — Payment processing.
              Handles subscription billing and payment information. We do not store credit card
              details on our servers.
            </li>
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Google Calendar</strong> — Calendar
              integration via OAuth. We request only the permissions needed to read and write
              calendar events for booking synchronization.
            </li>
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Resend</strong> — Transactional
              email delivery. Used to send booking confirmations, notifications, and other
              platform communications.
            </li>
          </ul>
          <p style={bodyText}>
            We do not sell your personal information to third parties.
          </p>
        </div>

        {/* Cookies */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>COOKIES</span>
          <h2 style={sectionHeading}>Cookies and Tracking</h2>
          <p style={bodyText}>
            SpadeChat uses minimal cookies. We use authentication cookies managed by Supabase
            to keep you logged in and maintain your session. We do not use third-party advertising
            or tracking cookies.
          </p>
        </div>

        {/* Data Retention */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>RETENTION</span>
          <h2 style={sectionHeading}>Data Retention and Deletion</h2>
          <p style={bodyText}>
            We retain your data for as long as your account is active or as needed to provide
            the services. Booking records are retained to maintain appointment history for both
            businesses and customers.
          </p>
          <p style={bodyText}>
            You may request deletion of your account and associated data at any time by contacting
            us through the contact form on our website. We will process deletion requests within
            30 days, except where we are required to retain certain information by law.
          </p>
        </div>

        {/* Data Security */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>SECURITY</span>
          <h2 style={sectionHeading}>Data Security</h2>
          <p style={bodyText}>
            We implement reasonable security measures to protect your information, including
            encryption in transit (HTTPS), secure authentication via Supabase, and secure
            payment processing via Stripe. However, no method of electronic transmission or
            storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </div>

        {/* Your Rights */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>YOUR RIGHTS</span>
          <h2 style={sectionHeading}>Privacy Rights</h2>
          <p style={bodyText}>
            Depending on your location, you may have certain rights regarding your personal
            information:
          </p>
          <ul style={listStyle}>
            <li>The right to know what personal information we collect about you</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to opt out of the sale of personal information (we do not sell your data)</li>
            <li>The right to non-discrimination for exercising your privacy rights</li>
            <li>The right to access and receive a copy of your personal information</li>
          </ul>
          <p style={bodyText}>
            California residents have additional rights under the California Consumer Privacy
            Act (CCPA). To exercise any of these rights, please contact us through the contact
            form on our website.
          </p>
        </div>

        {/* Children's Privacy */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>AGE REQUIREMENTS</span>
          <h2 style={sectionHeading}>Children&apos;s Privacy</h2>
          <p style={bodyText}>
            SpadeChat is not intended for use by individuals under the age of 18. We do not
            knowingly collect personal information from children. If we become aware that we
            have collected data from a child, we will take steps to delete it promptly.
          </p>
        </div>

        {/* Changes */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>UPDATES</span>
          <h2 style={sectionHeading}>Changes to This Policy</h2>
          <p style={bodyText}>
            We may update this Privacy Policy from time to time. We will notify you of any
            changes by posting the new policy on this page and updating the &quot;Last
            updated&quot; date. Continued use of SpadeChat after changes constitutes acceptance
            of the updated policy.
          </p>
        </div>

        {/* Contact */}
        <div style={{ marginBottom: '24px' }}>
          <span style={sectionLabel}>QUESTIONS</span>
          <h2 style={sectionHeading}>Contact Us</h2>
          <p style={bodyText}>
            If you have any questions about this Privacy Policy or our data practices, please
            reach out through the{' '}
            <a
              href="/contact"
              style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'underline' }}
            >
              contact form
            </a>{' '}
            on our website.
          </p>
        </div>
      </div>
    </section>
  )
}
