import Image from 'next/image'
import Link from 'next/link'

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

        {/* Row 3: What is MCP? */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-0"
        >
          {/* Left: MCP Diagram */}
          <div
            className="relative px-6 md:px-10 py-16 md:py-24 flex items-center"
            style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="relative w-full max-w-[480px] mx-auto">
              <div
                className="rounded-lg overflow-hidden p-6"
                style={{ background: 'var(--white)' }}
              >
                <Image
                  src="/mcp-diagram.png"
                  alt="How MCP connects businesses to AI assistants"
                  width={480}
                  height={360}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Right: MCP Explanation */}
          <div className="px-6 md:px-10 py-16 md:py-24 flex flex-col justify-center">
            <span
              className="font-mono text-[10px] uppercase block mb-6"
              style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}
            >
              THE TECHNOLOGY
            </span>

            <h3
              className="editorial-heading mb-8"
              style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                color: 'var(--white)',
                lineHeight: 1.1,
              }}
            >
              What is{' '}
              <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.35)' }}>
                MCP?
              </span>
            </h3>

            <p
              className="leading-relaxed mb-5"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 300,
                fontSize: '16px',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.8,
                maxWidth: 440,
              }}
            >
              Think of MCP like a universal translator between your business
              and AI assistants. Right now, when someone asks ChatGPT or Claude
              to book a haircut, the AI has no way to actually do it. MCP
              changes that.
            </p>
            <p
              className="leading-relaxed mb-5"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 300,
                fontSize: '16px',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.8,
                maxWidth: 440,
              }}
            >
              SpadeChat gives your business an MCP connection. That means every
              AI assistant in the world &mdash; ChatGPT, Claude, Gemini, Siri,
              and whatever comes next &mdash; can find you, recommend you, and
              send you real customers. Automatically. 24/7.
            </p>
            <p
              className="leading-relaxed"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 300,
                fontSize: '16px',
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.8,
                maxWidth: 440,
                fontStyle: 'italic',
              }}
            >
              No app to download. No code to write. Just your business,
              now speaking the language every AI understands.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
