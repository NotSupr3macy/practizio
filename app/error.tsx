'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="text-center">
        <span className="font-display font-black text-[200px] leading-none tracking-tightest opacity-[0.04] block">
          ERR
        </span>
        <div className="-mt-24 relative">
          <span className="mono-label-sm opacity-40 block mb-4">SYSTEM ERROR</span>
          <h1 className="font-display font-black uppercase text-3xl tracking-tightest">
            SOMETHING WENT WRONG
          </h1>
          <p className="font-sans text-sm font-light opacity-40 mt-3">
            An unexpected error occurred. Please try again.
          </p>
          <button onClick={() => reset()} className="mt-8 btn-solid">
            RETRY OPERATION
          </button>
        </div>
      </div>
    </div>
  )
}
