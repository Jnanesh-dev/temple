import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import EventsTable from '@/components/admin/EventsTable'

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { eventDate: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
            Events Management
          </h1>
          <p className="text-gray-600">Manage temple events and festivals</p>
        </div>
        <Link href="/admin/events/new">
          <Button>
            <Plus size={20} className="mr-2" />
            Add New Event
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent>
          <EventsTable events={events} />
        </CardContent>
      </Card>
    </div>
  )
}

