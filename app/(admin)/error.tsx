'use client'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--cream)' }}>
      <div className="max-w-md text-center">
        <h1
          className="text-2xl mb-4"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300, color: 'var(--foreground)' }}
        >
          Admin Error
        </h1>
        <p
          className="mb-2"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.2em', color: 'var(--muted-text)' }}
        >
          {error.message}
        </p>
        {error.digest && (
          <p
            className="mb-6"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: 'var(--muted-text)' }}
          >
            Digest: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="font-mono text-[10px] uppercase"
          style={{
            letterSpacing: '0.25em',
            padding: '12px 24px',
            borderRadius: '2px',
            background: 'var(--navy)',
            color: 'var(--white)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          RETRY
        </button>
      </div>
    </div>
  )
}
