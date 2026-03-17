import Link from 'next/link'

const productLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Directory', href: '/directory' },
  { label: 'Documentation', href: '/docs' },
]

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
]

export function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: 'var(--white)' }}>
      <div className="max-w-6xl mx-auto py-16 px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <span className="font-display uppercase tracking-widest text-xl block mb-4" style={{ color: 'var(--white)' }}>
              PRACTIZIO
            </span>
            <p
              className="text-xs leading-relaxed"
              style={{
                fontFamily: '"Space Mono", monospace',
                color: 'rgba(255,255,255,0.25)',
              }}
            >
              Making every business discoverable by AI agents worldwide.
            </p>
          </div>

          {/* Product */}
          <div>
            <span
              className="mono-label block mb-5"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              PRODUCT
            </span>
            <div className="space-y-3">
              {productLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block font-mono text-[12px] transition-colors duration-300"
                  style={{ color: 'rgba(255,255,255,0.25)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <span
              className="mono-label block mb-5"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              COMPANY
            </span>
            <div className="space-y-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block font-mono text-[12px] transition-colors duration-300"
                  style={{ color: 'rgba(255,255,255,0.25)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <span
              className="mono-label block mb-5"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              LEGAL
            </span>
            <div className="space-y-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block font-mono text-[12px] transition-colors duration-300"
                  style={{ color: 'rgba(255,255,255,0.25)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="max-w-6xl mx-auto py-6 px-6 md:px-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span
            className="font-mono text-[12px] uppercase"
            style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}
          >
            &copy; 2026 PRACTIZIO
          </span>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-mono text-[12px] uppercase transition-colors duration-300"
                style={{ letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
