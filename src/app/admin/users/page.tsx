import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import UsersTable from '@/components/admin/UsersTable'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
            User Management
          </h1>
          <p className="text-gray-600">Manage admin users</p>
        </div>
        <Link href="/admin/users/new">
          <Button>
            <Plus size={20} className="mr-2" />
            Add New User
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable users={users} />
        </CardContent>
      </Card>
    </div>
  )
}

