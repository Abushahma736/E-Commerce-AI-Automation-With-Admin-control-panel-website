'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Settings, Clock, AlertCircle, Save, RefreshCw } from 'lucide-react'

interface AutoConfirmSettings {
  enabled: boolean
  maxAmount: number
  excludedPaymentMethods: string[]
  requireVerification: boolean
  delayMinutes: number
  emailNotification: boolean
  smsNotification: boolean
  excludedCountries: string[]
  minOrderCount: number
  trustedCustomersOnly: boolean
}

export default function AutoConfirmPage() {
  const [settings, setSettings] = useState<AutoConfirmSettings>({
    enabled: true,
    maxAmount: 500,
    excludedPaymentMethods: ['cod'],
    requireVerification: false,
    delayMinutes: 5,
    emailNotification: true,
    smsNotification: false,
    excludedCountries: [],
    minOrderCount: 0,
    trustedCustomersOnly: false
  })
  
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [stats, setStats] = useState({
    totalOrders: 1234,
    autoConfirmed: 1210,
    manualReview: 24,
    rejected: 0,
    successRate: 98.1
  })

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card' },
    { id: 'upi', name: 'UPI' },
    { id: 'netbanking', name: 'Net Banking' },
    { id: 'wallet', name: 'Digital Wallet' },
    { id: 'cod', name: 'Cash on Delivery' },
  ]

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'IN', name: 'India' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
  ]

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Saving settings:', settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePaymentMethod = (methodId: string) => {
    setSettings(prev => ({
      ...prev,
      excludedPaymentMethods: prev.excludedPaymentMethods.includes(methodId)
        ? prev.excludedPaymentMethods.filter(id => id !== methodId)
        : [...prev.excludedPaymentMethods, methodId]
    }))
  }

  const toggleCountry = (countryCode: string) => {
    setSettings(prev => ({
      ...prev,
      excludedCountries: prev.excludedCountries.includes(countryCode)
        ? prev.excludedCountries.filter(code => code !== countryCode)
        : [...prev.excludedCountries, countryCode]
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Auto Order Confirmation</h1>
        <p className="mt-2 text-lg text-gray-600">Configure automatic order processing settings</p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">{stats.autoConfirmed}</div>
          <div className="text-sm text-gray-600">Auto Confirmed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-yellow-600">{stats.manualReview}</div>
          <div className="text-sm text-gray-600">Manual Review</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-emerald-600">{stats.successRate}%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Auto Confirmation Settings</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Enable/Disable Auto Confirmation */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Enable Auto Confirmation</h3>
              <p className="text-sm text-gray-600">Automatically confirm orders that meet the criteria</p>
            </div>
            <button
              onClick={() => setSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enabled ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {settings.enabled && (
            <>
              {/* Maximum Order Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Order Amount ($)
                </label>
                <input
                  type="number"
                  value={settings.maxAmount}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxAmount: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="500"
                />
                <p className="mt-1 text-sm text-gray-600">Orders above this amount will require manual review</p>
              </div>

              {/* Confirmation Delay */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmation Delay (minutes)
                </label>
                <input
                  type="number"
                  value={settings.delayMinutes}
                  onChange={(e) => setSettings(prev => ({ ...prev, delayMinutes: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5"
                />
                <p className="mt-1 text-sm text-gray-600">Wait time before auto-confirming orders</p>
              </div>

              {/* Minimum Order Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Previous Orders
                </label>
                <input
                  type="number"
                  value={settings.minOrderCount}
                  onChange={(e) => setSettings(prev => ({ ...prev, minOrderCount: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
                <p className="mt-1 text-sm text-gray-600">Required number of previous successful orders</p>
              </div>

              {/* Additional Options */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireVerification"
                    checked={settings.requireVerification}
                    onChange={(e) => setSettings(prev => ({ ...prev, requireVerification: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireVerification" className="ml-2 text-sm text-gray-700">
                    Require phone/email verification before auto-confirmation
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="trustedCustomersOnly"
                    checked={settings.trustedCustomersOnly}
                    onChange={(e) => setSettings(prev => ({ ...prev, trustedCustomersOnly: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="trustedCustomersOnly" className="ml-2 text-sm text-gray-700">
                    Auto-confirm only for trusted customers
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotification"
                    checked={settings.emailNotification}
                    onChange={(e) => setSettings(prev => ({ ...prev, emailNotification: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotification" className="ml-2 text-sm text-gray-700">
                    Send email notifications for auto-confirmed orders
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="smsNotification"
                    checked={settings.smsNotification}
                    onChange={(e) => setSettings(prev => ({ ...prev, smsNotification: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="smsNotification" className="ml-2 text-sm text-gray-700">
                    Send SMS notifications for auto-confirmed orders
                  </label>
                </div>
              </div>

              {/* Excluded Payment Methods */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Excluded Payment Methods
                </label>
                <div className="space-y-2">
                  {paymentMethods.map(method => (
                    <div key={method.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={method.id}
                        checked={settings.excludedPaymentMethods.includes(method.id)}
                        onChange={() => togglePaymentMethod(method.id)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor={method.id} className="ml-2 text-sm text-gray-700">
                        Exclude {method.name}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-sm text-gray-600">Selected payment methods will require manual review</p>
              </div>

              {/* Excluded Countries */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Excluded Countries
                </label>
                <div className="space-y-2">
                  {countries.map(country => (
                    <div key={country.code} className="flex items-center">
                      <input
                        type="checkbox"
                        id={country.code}
                        checked={settings.excludedCountries.includes(country.code)}
                        onChange={() => toggleCountry(country.code)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor={country.code} className="ml-2 text-sm text-gray-700">
                        Exclude {country.name}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-sm text-gray-600">Orders from selected countries will require manual review</p>
              </div>
            </>
          )}
        </div>

        {/* Save Button */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : saved ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-3">
            {settings.enabled ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <AlertCircle className="h-8 w-8 text-red-500" />
            )}
            <div>
              <div className="text-lg font-medium text-gray-900">
                {settings.enabled ? 'Auto Confirmation Active' : 'Auto Confirmation Disabled'}
              </div>
              <div className="text-sm text-gray-600">
                {settings.enabled ? 
                  `Orders up to $${settings.maxAmount} will be automatically confirmed after ${settings.delayMinutes} minutes` :
                  'All orders require manual review'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Rules Summary */}
      {settings.enabled && (
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Active Processing Rules</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">
                  Orders ≤ ${settings.maxAmount} will be auto-confirmed
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-700">
                  {settings.delayMinutes} minute delay before confirmation
                </span>
              </div>
              {settings.excludedPaymentMethods.length > 0 && (
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-700">
                    Excluding: {settings.excludedPaymentMethods.join(', ')} payments
                  </span>
                </div>
              )}
              {settings.minOrderCount > 0 && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">
                    Minimum {settings.minOrderCount} previous orders required
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
