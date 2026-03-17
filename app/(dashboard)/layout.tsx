export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {children}
    </div>
  )
}
