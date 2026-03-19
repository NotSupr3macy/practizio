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
    <div className="min-h-screen flex items-center justify-center px-6 bg-[var(--cream)]">
      <div className="text-center">
        <span className="text-[200px] leading-none tracking-tight text-[var(--border-light)] block" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
          ERR
        </span>
        <div className="-mt-24 relative">
          <span className="mono-label-sm text-[var(--muted-text)] block mb-4">SYSTEM ERROR</span>
          <h1 className="text-3xl tracking-tight text-[var(--foreground)]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
            Something Went Wrong
          </h1>
          <p className="font-mono text-sm text-[var(--muted-text)] mt-3">
            An unexpected error occurred. Please try again.
          </p>
          {error?.digest && (
            <p className="font-mono text-[10px] text-[var(--muted-text)] mt-2">
              Digest: {error.digest}
            </p>
          )}
          {error?.message && (
            <p className="font-mono text-[10px] text-[var(--muted-text)] mt-1 max-w-md mx-auto break-all">
              {error.message}
            </p>
          )}
          <button onClick={() => reset()} className="mt-8 btn-primary">
            RETRY OPERATION
          </button>
        </div>
      </div>
    </div>
  )
}
