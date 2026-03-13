export default function Loading() {
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="h-4 w-32 bg-card rounded animate-pulse mb-8" />
        <div className="bg-card border border-border rounded-xl p-8 mb-8">
          <div className="h-8 w-64 bg-muted rounded animate-pulse mb-4" />
          <div className="h-4 w-24 bg-muted rounded animate-pulse mb-6" />
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-36 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-xl p-6 h-64 animate-pulse" />
          <div className="bg-card border border-border rounded-xl p-6 h-64 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
