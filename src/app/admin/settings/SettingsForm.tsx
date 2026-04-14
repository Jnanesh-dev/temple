'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { savePaymentSettings, getPaymentPublicSettings } from '@/app/actions/paymentActions'

export default function SettingsForm() {
  const [keyId, setKeyId] = useState('')
  const [keySecret, setKeySecret] = useState('')
  const [webhookSecret, setWebhookSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    async function loadSettings() {
      const settings = await getPaymentPublicSettings()
      if (settings.keyId) {
        setKeyId(settings.keyId)
      }
      setFetching(false)
    }
    loadSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const result = await savePaymentSettings({ keyId, keySecret, webhookSecret })

    if (result.success) {
      setMessage({ type: 'success', text: 'Settings saved successfully!' })
      setKeySecret('') // Clear secret for security
      setWebhookSecret('') // Clear secret for security
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to save settings' })
    }
    setLoading(false)
  }

  if (fetching) return <div className="p-4">Loading settings...</div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Gateway (Razorpay)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Razorpay Key ID
              </label>
              <Input
                value={keyId}
                onChange={(e) => setKeyId(e.target.value)}
                placeholder="rzp_test_..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Razorpay Key Secret
              </label>
              <Input
                type="password"
                value={keySecret}
                onChange={(e) => setKeySecret(e.target.value)}
                placeholder="Enter new secret to update..."
                required={!keyId}
              />
              <p className="text-xs text-gray-500 mt-1">
                For security, the secret is not displayed after saving. Leave blank to keep existing.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Razorpay Webhook Secret
              </label>
              <Input
                type="password"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder="Enter new webhook secret..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Set this to the secret you configured in your Razorpay Webhook dashboard.
              </p>
            </div>

            {message.text && (
              <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message.text}
              </div>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Payment Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Other settings will appear here in the future.</p>
        </CardContent>
      </Card>
    </div>
  )
}
