import SettingsForm from './SettingsForm'

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-temple-maroon mb-2">
          Settings
        </h1>
        <p className="text-gray-600">Manage website settings and configuration</p>
      </div>

      <SettingsForm />
    </div>
  )
}

