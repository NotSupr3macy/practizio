import Image from 'next/image'

export function Founders() {
  return (
    <section
      className="py-32 px-6 md:px-10"
      style={{ background: 'var(--navy)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <span
          className="font-mono text-[10px] uppercase block mb-6 text-center"
          style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}
        >
          MEET THE FOUNDERS
        </span>

        {/* Heading */}
        <h2
          className="editorial-heading text-center mb-20"
          style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            color: 'var(--white)',
            lineHeight: 1.1,
          }}
        >
          Built by students,{' '}
          <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.35)' }}>
            for everyone.
          </span>
        </h2>

        {/* Content: photo + message */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Photo */}
          <div className="relative">
            <div
              className="absolute -top-4 -left-4 w-1/3 h-1/3"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            />
            <div
              className="relative overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Image
                src="/team.jpg"
                alt="SpadeChat founders at their booth"
                width={600}
                height={450}
                className="object-cover w-full"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <p
              className="leading-relaxed mb-6"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 300,
                fontSize: '17px',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.8,
              }}
            >
              SpadeChat started with a simple question in a dorm room at the
              University of Oregon: why can&apos;t AI assistants just book an
              appointment for you?
            </p>
            <p
              className="leading-relaxed mb-6"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 300,
                fontSize: '17px',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.8,
              }}
            >
              We&apos;re two full-time students balancing classes, late nights,
              and the belief that every local business deserves to be
              discoverable by the AI tools people are already using every day.
              We built SpadeChat because we saw a gap that nobody was filling —
              and we couldn&apos;t wait for someone else to do it.
            </p>
            <p
              className="leading-relaxed"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 300,
                fontSize: '17px',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.8,
              }}
            >
              This isn&apos;t backed by a big team or a venture fund. It&apos;s
              two guys who care deeply about helping small businesses thrive in
              the age of AI — one booking link at a time.
            </p>

            {/* Signature */}
            <div className="mt-10 flex items-center gap-6">
              <div
                style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.1)' }}
              />
              <span
                className="font-mono text-[10px] uppercase"
                style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)' }}
              >
                UNIVERSITY OF OREGON &middot; CLASS OF 2027
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
