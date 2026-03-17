import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[var(--cream)]">
      <div className="text-center">
        <span className="text-[200px] md:text-[300px] leading-none tracking-tight text-[var(--border-light)] block" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
          404
        </span>
        <div className="-mt-20 md:-mt-32 relative">
          <span className="mono-label-sm text-[var(--muted-text)] block mb-4">ERROR NOT FOUND</span>
          <h1 className="text-3xl md:text-4xl tracking-tight text-[var(--foreground)]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
            Page Not Found
          </h1>
          <p className="font-mono text-sm text-[var(--muted-text)] mt-3">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/" className="inline-block mt-8 btn-primary">
            RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  )
}
