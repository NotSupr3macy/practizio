import Image from 'next/image'
import Link from 'next/link'

const cards = [
  {
    tag: 'SYSTEM 02',
    title: 'AI\nDISCOVERY',
    sub: 'Automatically listed in the AI business directory, found by Claude, ChatGPT, Gemini, and every agent that follows.',
  },
  {
    tag: 'SYSTEM 03',
    title: 'INSTANT\nACTION',
    sub: 'AI agents book appointments, place orders, and interact with your business without human intervention.',
  },
] as const

export function BentoGrid() {
  return (
    <section
      className="w-full"
      style={{ background: 'var(--navy)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Row 1: Founders */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Left: Team photo */}
          <div
            className="relative px-6 md:px-10 py-16 md:py-24 flex items-center"
            style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="relative w-full aspect-[4/3] max-w-[400px] mx-auto">
              <div
                className="absolute -top-3 -left-3 w-2/5 h-2/5"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <Image
                  src="/team.jpg"
                  alt="SpadeChat founders at their booth"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            </div>
          </div>

          {/* Right: Founders message */}
          <div className="px-6 md:px-10 py-16 md:py-24 flex flex-col justify-center">
            <span
              className="font-mono text-[10px] uppercase block mb-6"
              style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}
            >
              MEET THE FOUNDERS
            </span>

            <h3
              className="editorial-heading mb-8"
              style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                color: 'var(--white)',
                lineHeight: 1.1,
              }}
            >
              Built by students,{' '}
              <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.35)' }}>
                for everyone.
              </span>
            </h3>

            <p
              className="leading-relaxed mb-5"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 300,
                fontSize: '15px',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.8,
                maxWidth: 420,
              }}
            >
              SpadeChat started with a simple idea at the basketball court at
              the University of Oregon: and it&apos;s taken many twists and turns
              to get where it&apos;s at today.
            </p>
            <p
              className="leading-relaxed mb-5"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 300,
                fontSize: '15px',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.8,
                maxWidth: 420,
              }}
            >
              We&apos;re two full-time students balancing classes, late nights,
              and the belief that every local business deserves to be
              discoverable by the AI tools people use every day.
            </p>
            <p
              className="leading-relaxed"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 300,
                fontSize: '15px',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.8,
                maxWidth: 420,
              }}
            >
              This isn&apos;t backed by a big team or a venture fund. It&apos;s
              two guys who care deeply about helping small businesses thrive in
              the age of AI... one booking link at a time.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3" style={{ maxWidth: 420 }}>
              <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.1)' }} />
              <span
                className="font-mono text-[10px] uppercase text-center"
                style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)' }}
              >
                JACKSON AND WILL &middot; UNIVERSITY OF OREGON &middot; CLASS OF 2028
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: How SpadeChat Can Help */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Left: Text content */}
          <div className="px-6 md:px-10 py-16 md:py-24 flex flex-col justify-center">
            <span
              className="font-mono text-[10px] uppercase block mb-6"
              style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}
            >
              OUR SERVICES
            </span>

            <h3
              className="editorial-heading mb-8"
              style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                color: 'var(--white)',
                lineHeight: 1.1,
              }}
            >
              How SpadeChat Can{' '}
              <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.35)' }}>
                Help Your Business?
              </span>
            </h3>

            <p
              className="leading-relaxed mb-5"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 300,
                fontSize: '15px',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.8,
                maxWidth: 420,
              }}
            >
              We offer a wide range of technological business assistance that
              increases your businesses capability and efficiency.
            </p>
            <p
              className="leading-relaxed mb-5"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 300,
                fontSize: '15px',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.8,
                maxWidth: 420,
              }}
            >
              We make solutions based on your problems. Whether that&apos;s
              automatic appointment booking, a 24/7 receptionist, automatic
              appointment reminders, and even automatic data analyzation.
            </p>
            <p
              className="leading-relaxed mb-8"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 300,
                fontSize: '15px',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.8,
                maxWidth: 420,
              }}
            >
              Your technological issues are ours to discover and solve, contact
              the SpadeChat team today.
            </p>

            <Link
              href="/contact"
              className="font-mono text-[10px] uppercase text-center transition-all duration-300 self-start"
              style={{
                letterSpacing: '0.25em',
                padding: '14px 32px',
                borderRadius: '2px',
                background: 'var(--white)',
                color: 'var(--navy)',
                fontWeight: 700,
              }}
            >
              CONTACT US
            </Link>
          </div>

          {/* Right: Branded banner visual */}
          <div
            className="relative px-6 md:px-10 py-16 md:py-24 flex items-center"
            style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="relative w-full aspect-[4/3] max-w-[400px] mx-auto">
              <div
                className="absolute -top-3 -left-3 w-2/5 h-2/5"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              />
              <div
                className="absolute inset-0 overflow-hidden flex flex-col items-center justify-center px-8"
                style={{
                  background: 'linear-gradient(135deg, #1a3a6e 0%, #0f2341 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Logo */}
                <div className="relative w-20 h-20 mb-4">
                  <Image
                    src="/logo.png"
                    alt="SpadeChat logo"
                    fill
                    className="object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                {/* Brand name */}
                <span
                  className="font-display text-2xl mb-6"
                  style={{ color: 'var(--white)', letterSpacing: '0.05em' }}
                >
                  SpadeChat
                </span>
                {/* Tagline */}
                <span
                  className="font-display uppercase text-center"
                  style={{
                    fontSize: 'clamp(16px, 2vw, 22px)',
                    color: 'var(--white)',
                    letterSpacing: '0.05em',
                  }}
                >
                  HERE TO SOLVE YOUR PROBLEMS
                </span>
                {/* Divider */}
                <div className="my-3" style={{ width: '80%', height: 1, background: 'rgba(255,255,255,0.2)' }} />
                {/* Sub */}
                <span
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 300,
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.6)',
                    letterSpacing: '0.1em',
                  }}
                >
                  Personalized AI Solutions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Remaining system cards */}
        {cards.map((card, idx) => (
          <div
            key={card.tag}
            className="grid grid-cols-1 md:grid-cols-2 gap-0"
            style={{
              borderBottom: idx < cards.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}
          >
            {/* Visual area */}
            <div
              className={`relative px-6 md:px-10 py-16 md:py-24 flex items-center ${idx % 2 === 0 ? 'md:order-2' : ''}`}
              style={{
                borderRight: idx % 2 === 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                borderLeft: idx % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              <div className="relative w-full aspect-[4/3] max-w-[400px] mx-auto">
                <div
                  className="absolute -top-3 -left-3 w-2/5 h-2/5"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center overflow-hidden"
                  style={{
                    background: 'var(--charcoal)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <span
                    className="font-display uppercase select-none"
                    style={{
                      fontSize: 'clamp(120px, 15vw, 200px)',
                      lineHeight: 1,
                      color: 'rgba(255,255,255,0.03)',
                    }}
                  >
                    {card.tag.slice(-2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div
              className={`px-6 md:px-10 py-16 md:py-24 flex flex-col justify-center ${idx % 2 === 0 ? 'md:order-1' : ''}`}
            >
              <span
                className="font-mono text-[10px] uppercase block mb-6"
                style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}
              >
                {card.tag}
              </span>

              <h3
                className="font-display uppercase"
                style={{
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  lineHeight: 0.95,
                  color: 'var(--white)',
                  whiteSpace: 'pre-line',
                }}
              >
                {card.title}
              </h3>

              <p
                className="mt-6 leading-relaxed"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 300,
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.35)',
                  maxWidth: 420,
                  lineHeight: 1.7,
                }}
              >
                {card.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
