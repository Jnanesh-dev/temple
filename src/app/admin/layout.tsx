import AdminLayoutShell from './AdminLayoutShell'

export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>
}
