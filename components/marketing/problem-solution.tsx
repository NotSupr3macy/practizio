'use client'

import { useEffect, useState } from 'react'

const metrics = [
  { value: 2847, label: 'PRACTICES_LISTED', suffix: '+' },
  { value: 200, label: 'RESPONSE_TIME_MS', suffix: 'ms' },
  { value: 40, label: 'AI_BOOKED_APPOINTMENTS', suffix: '%' },
  { value: 99.9, label: 'UPTIME_GUARANTEE', suffix: '%' },
]

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      if (step >= steps) {
        setCurrent(target)
        clearInterval(timer)
      } else {
        setCurrent(Number((increment * step).toFixed(1)))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [target])

  return (
    <span className="font-display font-black text-4xl md:text-5xl tracking-tightest">
      {target % 1 !== 0 ? current.toFixed(1) : Math.floor(current)}
      <span className="text-accent">{suffix}</span>
    </span>
  )
}

export function ProblemSolution() {
  return (
    <section id="features" className="hairline-t hairline-b">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {metrics.map((metric, i) => (
          <div
            key={metric.label}
            className={`p-8 md:p-12 flex flex-col justify-between min-h-[200px] ${
              i < metrics.length - 1 ? 'hairline-r' : ''
            } ${i < 2 ? 'hairline-b md:border-b-0' : ''}`}
          >
            <span className="mono-label-sm opacity-40">{metric.label}</span>
            <div className="mt-6">
              <AnimatedNumber target={metric.value} suffix={metric.suffix} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
