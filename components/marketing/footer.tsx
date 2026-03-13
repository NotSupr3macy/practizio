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
    <footer className="hairline-t">
      <div className="max-w-6xl mx-auto py-16 px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <span className="font-display font-black uppercase tracking-tightest text-lg block mb-4">
              PRACTIZIO
            </span>
            <span className="mono-label-sm opacity-40 block">MAKING_PRACTICES_DISCOVERABLE</span>
            <span className="mono-label-sm opacity-40 block">BY_AI_AGENTS</span>
          </div>

          {/* Product */}
          <div>
            <span className="mono-label opacity-60 block mb-4">PRODUCT</span>
            <div className="space-y-3">
              {productLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block font-sans text-sm font-light opacity-40 hover:opacity-100 transition-opacity duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <span className="mono-label opacity-60 block mb-4">COMPANY</span>
            <div className="space-y-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block font-sans text-sm font-light opacity-40 hover:opacity-100 transition-opacity duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <span className="mono-label opacity-60 block mb-4">LEGAL</span>
            <div className="space-y-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block font-sans text-sm font-light opacity-40 hover:opacity-100 transition-opacity duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="hairline-t">
        <div className="max-w-6xl mx-auto py-6 px-6 flex justify-between items-center">
          <span className="mono-label-sm opacity-30">2025_PRACTIZIO_INC</span>
          <span className="mono-label-sm opacity-40 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block mr-2" />
            STATUS: OPERATIONAL
          </span>
        </div>
      </div>
    </footer>
  )
}
