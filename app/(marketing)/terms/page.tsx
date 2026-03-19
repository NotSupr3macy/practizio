import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | SpadeChat',
  description: 'SpadeChat terms of service — the rules and guidelines for using our AI booking platform.',
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

export default function TermsOfServicePage() {
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
          Terms of{' '}
          <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.35)' }}>
            Service.
          </span>
        </h1>

        <p style={{ ...bodyText, marginBottom: '48px', maxWidth: 480 }}>
          Last updated: March 2026
        </p>

        {/* Agreement */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>AGREEMENT</span>
          <h2 style={sectionHeading}>Agreement to Terms</h2>
          <p style={bodyText}>
            By accessing or using SpadeChat (&quot;the Service&quot;), operated by SpadeChat
            (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by
            these Terms of Service. If you do not agree to these terms, please do not use the
            Service.
          </p>
          <p style={bodyText}>
            SpadeChat is a University of Oregon student startup. These terms constitute a legally
            binding agreement between you and SpadeChat.
          </p>
        </div>

        {/* Service Description */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>THE PLATFORM</span>
          <h2 style={sectionHeading}>Service Description</h2>
          <p style={bodyText}>
            SpadeChat is an AI booking platform that makes businesses discoverable by AI
            assistants including ChatGPT, Claude, and Gemini. The Service provides:
          </p>
          <ul style={listStyle}>
            <li>AI booking links that allow customers to book through AI assistants</li>
            <li>An AI-optimized business directory</li>
            <li>Calendar integration for appointment management</li>
            <li>Business profile pages for AI discovery</li>
            <li>Booking management tools</li>
          </ul>
          <p style={bodyText}>
            We reserve the right to modify, suspend, or discontinue any aspect of the Service
            at any time without prior notice.
          </p>
        </div>

        {/* Account Responsibilities */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>ACCOUNTS</span>
          <h2 style={sectionHeading}>Account Responsibilities</h2>
          <p style={bodyText}>
            When you create an account on SpadeChat, you agree to:
          </p>
          <ul style={listStyle}>
            <li>Provide accurate, current, and complete information about yourself and your business</li>
            <li>Maintain the security of your account credentials</li>
            <li>Promptly update your information if it changes</li>
            <li>Accept responsibility for all activity that occurs under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
          <p style={bodyText}>
            You must be at least 18 years old to create an account. We reserve the right to
            suspend or terminate accounts that violate these terms.
          </p>
        </div>

        {/* Acceptable Use */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>CONDUCT</span>
          <h2 style={sectionHeading}>Acceptable Use</h2>
          <p style={bodyText}>
            You agree not to use SpadeChat to:
          </p>
          <ul style={listStyle}>
            <li>Submit false, misleading, or fraudulent business information</li>
            <li>Impersonate another person or business</li>
            <li>Violate any applicable local, state, national, or international law</li>
            <li>Interfere with or disrupt the Service or its infrastructure</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Use automated means to scrape, crawl, or extract data from the platform</li>
            <li>Transmit malware, viruses, or other harmful code</li>
            <li>Harass, abuse, or harm other users</li>
            <li>List services or products that are illegal or violate third-party rights</li>
          </ul>
        </div>

        {/* Bookings */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>BOOKINGS</span>
          <h2 style={sectionHeading}>Booking Terms</h2>
          <p style={bodyText}>
            SpadeChat facilitates bookings between businesses and customers through AI assistants.
            Businesses are responsible for honoring confirmed bookings and maintaining accurate
            availability information. SpadeChat is not a party to the transaction between
            businesses and their customers.
          </p>
          <p style={bodyText}>
            We do not guarantee that AI assistants will recommend or surface any particular
            business. AI discovery depends on the quality and completeness of your business
            profile and external factors outside our control.
          </p>
        </div>

        {/* Payment Terms */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>PAYMENTS</span>
          <h2 style={sectionHeading}>Payment Terms</h2>
          <p style={bodyText}>
            Certain features of SpadeChat may require a paid subscription. Payment is processed
            securely through Stripe. By subscribing, you agree to pay the applicable fees and
            authorize us to charge your payment method on a recurring basis.
          </p>
          <p style={bodyText}>
            You may cancel your subscription at any time. Cancellation takes effect at the end
            of the current billing period. We do not provide refunds for partial billing periods
            unless required by law.
          </p>
        </div>

        {/* Intellectual Property */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>IP RIGHTS</span>
          <h2 style={sectionHeading}>Intellectual Property</h2>
          <p style={bodyText}>
            The SpadeChat platform, including its design, code, features, and branding, is
            owned by SpadeChat and protected by intellectual property laws. You may not copy,
            modify, distribute, or create derivative works based on the Service without our
            written permission.
          </p>
          <p style={bodyText}>
            You retain ownership of the content you submit to SpadeChat (business descriptions,
            images, service listings, etc.). By submitting content, you grant SpadeChat a
            non-exclusive, worldwide license to use, display, and distribute that content
            in connection with operating the Service, including making it available to AI
            assistants for discovery purposes.
          </p>
        </div>

        {/* Limitation of Liability */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>LIABILITY</span>
          <h2 style={sectionHeading}>Limitation of Liability</h2>
          <p style={bodyText}>
            To the maximum extent permitted by law, SpadeChat and its founders, team members,
            and affiliates shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages, including but not limited to loss of profits,
            data, business opportunities, or goodwill, arising out of or related to your use
            of the Service.
          </p>
          <p style={bodyText}>
            SpadeChat is provided &quot;as is&quot; and &quot;as available&quot; without
            warranties of any kind, whether express or implied. We do not guarantee that the
            Service will be uninterrupted, error-free, or secure.
          </p>
          <p style={bodyText}>
            Our total liability to you for any claims arising from or related to the Service
            shall not exceed the amount you paid to SpadeChat in the twelve months preceding
            the claim.
          </p>
        </div>

        {/* Indemnification */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>INDEMNIFICATION</span>
          <h2 style={sectionHeading}>Indemnification</h2>
          <p style={bodyText}>
            You agree to indemnify and hold harmless SpadeChat and its team members from any
            claims, damages, losses, or expenses (including reasonable legal fees) arising
            from your use of the Service, your violation of these terms, or your violation of
            any rights of a third party.
          </p>
        </div>

        {/* Termination */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>TERMINATION</span>
          <h2 style={sectionHeading}>Termination</h2>
          <p style={bodyText}>
            You may terminate your account at any time by contacting us through the contact
            form on our website. We may suspend or terminate your account at any time, with
            or without cause, and with or without notice.
          </p>
          <p style={bodyText}>
            Upon termination, your right to use the Service ceases immediately. We may retain
            certain data as required by law or for legitimate business purposes. Provisions
            that by their nature should survive termination will remain in effect.
          </p>
        </div>

        {/* Modifications */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>CHANGES</span>
          <h2 style={sectionHeading}>Modifications to Terms</h2>
          <p style={bodyText}>
            We reserve the right to modify these Terms of Service at any time. Changes will
            be posted on this page with an updated &quot;Last updated&quot; date. Your continued
            use of SpadeChat after any modifications constitutes acceptance of the revised terms.
          </p>
          <p style={bodyText}>
            For significant changes, we will make reasonable efforts to notify you via email
            or through the platform.
          </p>
        </div>

        {/* Governing Law */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>JURISDICTION</span>
          <h2 style={sectionHeading}>Governing Law</h2>
          <p style={bodyText}>
            These Terms of Service shall be governed by and construed in accordance with the
            laws of the State of Oregon, United States, without regard to its conflict of
            law provisions. Any disputes arising from these terms or the Service shall be
            resolved in the courts located in the State of Oregon.
          </p>
        </div>

        {/* Severability */}
        <div style={{ marginBottom: '48px' }}>
          <span style={sectionLabel}>GENERAL</span>
          <h2 style={sectionHeading}>Severability</h2>
          <p style={bodyText}>
            If any provision of these Terms of Service is found to be unenforceable or invalid,
            that provision will be limited or eliminated to the minimum extent necessary, and
            the remaining provisions will remain in full force and effect.
          </p>
        </div>

        {/* Contact */}
        <div style={{ marginBottom: '24px' }}>
          <span style={sectionLabel}>QUESTIONS</span>
          <h2 style={sectionHeading}>Contact Us</h2>
          <p style={bodyText}>
            If you have any questions about these Terms of Service, please reach out through
            the{' '}
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
