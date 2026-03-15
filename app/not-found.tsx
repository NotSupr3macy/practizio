import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="text-center">
        <span className="font-display font-black text-[200px] md:text-[300px] leading-none tracking-tightest opacity-[0.04] block">
          404
        </span>
        <div className="-mt-20 md:-mt-32 relative">
          <span className="mono-label-sm opacity-40 block mb-4">ERROR NOT FOUND</span>
          <h1 className="font-display font-black uppercase text-3xl md:text-4xl tracking-tightest">
            PAGE NOT FOUND
          </h1>
          <p className="font-sans text-sm font-light opacity-40 mt-3">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/" className="inline-block mt-8 btn-solid">
            RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  )
}
