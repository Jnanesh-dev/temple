import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
          Settings
        </h1>
        <p className="text-gray-600">Manage website settings and configuration</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">General settings coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Email settings coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Gateway</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Payment gateway settings coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

