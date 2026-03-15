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
    <footer className="relative">
      {/* Marquee divider */}
      <div className="divider-chrome" />
      <div className="py-3 overflow-hidden">
        <div className="marquee-track">
          <div className="marquee-content-reverse">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="flex items-center gap-4 mx-4">
                <span className="mono-label-sm text-white/[0.06]">SPADECHAT</span>
                <span className="w-0.5 h-0.5 rounded-full bg-white/10" />
                <span className="mono-label-sm text-white/[0.06]">AI FIRST</span>
                <span className="w-0.5 h-0.5 rounded-full bg-white/10" />
                <span className="mono-label-sm text-white/[0.06]">AI POWERED</span>
                <span className="w-0.5 h-0.5 rounded-full bg-white/10" />
              </span>
            ))}
          </div>
          <div className="marquee-content-reverse" aria-hidden>
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="flex items-center gap-4 mx-4">
                <span className="mono-label-sm text-white/[0.06]">SPADECHAT</span>
                <span className="w-0.5 h-0.5 rounded-full bg-white/10" />
                <span className="mono-label-sm text-white/[0.06]">AI FIRST</span>
                <span className="w-0.5 h-0.5 rounded-full bg-white/10" />
                <span className="mono-label-sm text-white/[0.06]">AI POWERED</span>
                <span className="w-0.5 h-0.5 rounded-full bg-white/10" />
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="divider-chrome" />

      <div className="max-w-6xl mx-auto py-16 px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <span className="font-display font-extrabold uppercase tracking-tightest text-xl block mb-4 text-chrome">
              SPADECHAT
            </span>
            <p className="font-sans text-xs text-white/20 leading-relaxed">
              Making every business discoverable by AI agents worldwide.
            </p>
          </div>

          {/* Product */}
          <div>
            <span className="mono-label text-white/30 block mb-5">PRODUCT</span>
            <div className="space-y-3">
              {productLinks.map((link) => (
                <Link key={link.label} href={link.href} className="block font-sans text-sm font-light text-white/25 hover:text-accent transition-colors duration-300">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <span className="mono-label text-white/30 block mb-5">COMPANY</span>
            <div className="space-y-3">
              {companyLinks.map((link) => (
                <Link key={link.label} href={link.href} className="block font-sans text-sm font-light text-white/25 hover:text-accent transition-colors duration-300">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <span className="mono-label text-white/30 block mb-5">LEGAL</span>
            <div className="space-y-3">
              {legalLinks.map((link) => (
                <Link key={link.label} href={link.href} className="block font-sans text-sm font-light text-white/25 hover:text-accent transition-colors duration-300">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="divider-chrome" />
      <div className="max-w-6xl mx-auto py-6 px-6 md:px-10 flex justify-between items-center">
        <span className="mono-label-sm text-white/15">2026 SPADECHAT INC</span>
        <span className="mono-label-sm text-white/20 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
          OPERATIONAL
        </span>
      </div>
    </footer>
  )
}
