'use client'

import { useEffect, useState } from 'react'

function getTargetDate(): Date {
  const target = new Date()
  target.setDate(target.getDate() + 30)
  target.setHours(0, 0, 0, 0)
  return target
}

function computeTimeLeft(target: Date) {
  const now = new Date()
  const diff = Math.max(0, target.getTime() - now.getTime())

  const totalSeconds = Math.floor(diff / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  }
}

export function CommandBar() {
  const [targetDate] = useState<Date>(getTargetDate)
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(computeTimeLeft(targetDate))
    const interval = setInterval(() => {
      setTimeLeft(computeTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="w-full hairline-t hairline-b">
      <div className="grid grid-cols-1 md:grid-cols-4">
        {/* Cell 1: Email input */}
        <div className="h-20">
          <input
            type="email"
            placeholder="ENTER_EMAIL"
            className="w-full h-full bg-transparent font-mono text-sm text-foreground px-6 placeholder:font-mono placeholder:text-[10px] placeholder:font-medium placeholder:uppercase placeholder:tracking-[0.3em] placeholder:text-foreground/40 focus-ring"
          />
        </div>

        {/* Cell 2: Join Beta button */}
        <div className="relative h-20">
          <span
            className="absolute top-0 left-0 h-full hidden md:block"
            style={{ borderLeft: '0.5px solid rgba(255, 255, 255, 0.15)' }}
            aria-hidden="true"
          />
          <span
            className="absolute top-0 left-0 w-full md:hidden"
            style={{ borderTop: '0.5px solid rgba(255, 255, 255, 0.15)' }}
            aria-hidden="true"
          />
          <button
            type="button"
            className="w-full h-full bg-white text-black font-mono text-[10px] font-medium uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all duration-300"
          >
            JOIN BETA
          </button>
        </div>

        {/* Cell 3: Countdown timer */}
        <div className="relative h-20 flex items-center justify-center">
          <span
            className="absolute top-0 left-0 h-full hidden md:block"
            style={{ borderLeft: '0.5px solid rgba(255, 255, 255, 0.15)' }}
            aria-hidden="true"
          />
          <span
            className="absolute top-0 left-0 w-full md:hidden"
            style={{ borderTop: '0.5px solid rgba(255, 255, 255, 0.15)' }}
            aria-hidden="true"
          />
          <div className="font-mono text-2xl tabular-nums flex items-center gap-1">
            <span className="text-foreground">{timeLeft.hours}</span>
            <span className="text-foreground/20 mx-1">:</span>
            <span className="text-foreground">{timeLeft.minutes}</span>
            <span className="text-foreground/20 mx-1">:</span>
            <span className="text-foreground">{timeLeft.seconds}</span>
          </div>
        </div>

        {/* Cell 4: System labels */}
        <div className="relative h-20 flex flex-col items-start justify-center gap-2 px-6">
          <span
            className="absolute top-0 left-0 h-full hidden md:block"
            style={{ borderLeft: '0.5px solid rgba(255, 255, 255, 0.15)' }}
            aria-hidden="true"
          />
          <span
            className="absolute top-0 left-0 w-full md:hidden"
            style={{ borderTop: '0.5px solid rgba(255, 255, 255, 0.15)' }}
            aria-hidden="true"
          />
          <span className="mono-label-sm opacity-60">FREE_PRIVATE_ACCESS</span>
          <span className="mono-label-sm opacity-60">LIMITED_BETA_COHORT</span>
          <span className="mono-label-sm opacity-60">NO_CREDIT_CARD_REQ</span>
        </div>
      </div>
    </div>
  )
}
