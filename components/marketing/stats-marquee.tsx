'use client'

const stats = [
  { value: '10 MIN', label: 'SETUP TIME' },
  { value: '24/7', label: 'AI AVAILABILITY' },
  { value: 'FREE', label: 'TO START' },
  { value: '50+', label: 'AIS SUPPORTED' },
]

function StatItems() {
  return (
    <>
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="flex items-center gap-6 px-10 shrink-0"
        >
          <span
            className="font-display"
            style={{
              fontSize: '28px',
              color: 'var(--white)',
              lineHeight: 1,
            }}
          >
            {stat.value}
          </span>
          <span
            className="font-mono text-[9px] uppercase"
            style={{
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            {stat.label}
          </span>
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              flexShrink: 0,
            }}
          />
        </div>
      ))}
    </>
  )
}

export function StatsMarquee() {
  return (
    <section
      className="overflow-hidden py-6"
      style={{ background: 'var(--navy)' }}
    >
      <div
        className="flex animate-marquee"
        style={{ width: 'max-content' }}
      >
        <StatItems />
        <StatItems />
        <StatItems />
        <StatItems />
      </div>
    </section>
  )
}
