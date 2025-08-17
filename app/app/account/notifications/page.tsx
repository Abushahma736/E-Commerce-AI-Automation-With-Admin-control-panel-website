"use client"
import { useEffect, useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Bell, BellOff, Check, X, Mail, Smartphone, Settings, Trash2, Archive } from 'lucide-react'
import Link from 'next/link'

interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
  orderUpdates: boolean
  promotions: boolean
  newProducts: boolean
  priceAlerts: boolean
}

interface Notification {
  id: string
  type: 'order' | 'promotion' | 'product' | 'price' | 'system'
  title: string
  message: string
  timestamp: string
  read: boolean
  action?: {
    text: string
    url: string
  }
}

export default function NotificationsPage() {
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
    orderUpdates: true,
    promotions: true,
    newProducts: false,
    priceAlerts: true
  })
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications')

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      if (raw) {
        setUser(JSON.parse(raw))
        
        // Load notification settings
        const settingsRaw = localStorage.getItem('notificationSettings')
        if (settingsRaw) {
          setSettings(JSON.parse(settingsRaw))
        }

        // Load notifications (sample data)
        setNotifications([
          {
            id: '1',
            type: 'order',
            title: 'Order Confirmed',
            message: 'Your order #ESS001 has been confirmed and will be shipped soon.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            read: false,
            action: { text: 'Track Order', url: '/account/orders' }
          },
          {
            id: '2',
            type: 'promotion',
            title: 'Flash Sale Alert!',
            message: 'Get 25% off on all Essential Oils. Limited time offer!',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            read: true,
            action: { text: 'Shop Now', url: '/shop' }
          },
          {
            id: '3',
            type: 'product',
            title: 'New Product Launch',
            message: 'Introducing our new Organic Turmeric Extract with enhanced benefits.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            read: true,
            action: { text: 'View Product', url: '/product/turmeric-extract' }
          },
          {
            id: '4',
            type: 'price',
            title: 'Price Drop Alert',
            message: 'The Clove Oil in your wishlist is now 20% cheaper!',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            read: false,
            action: { text: 'Buy Now', url: '/product/clove-oil' }
          }
        ])
      }
    } catch {}
  }, [])

  const saveSettings = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings))
    setMessage('Notification settings saved successfully!')
    setTimeout(() => setMessage(null), 3000)
  }

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    )
    setNotifications(updatedNotifications)
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }))
    setNotifications(updatedNotifications)
    setMessage('All notifications marked as read!')
    setTimeout(() => setMessage(null), 3000)
  }

  const deleteNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== notificationId)
    setNotifications(updatedNotifications)
    setMessage('Notification deleted!')
    setTimeout(() => setMessage(null), 3000)
  }

  const clearAllNotifications = () => {
    setNotifications([])
    setMessage('All notifications cleared!')
    setTimeout(() => setMessage(null), 3000)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return '📦'
      case 'promotion': return '🎯'
      case 'product': return '✨'
      case 'price': return '💰'
      case 'system': return '⚙️'
      default: return '📢'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order': return 'text-blue-600 bg-blue-50'
      case 'promotion': return 'text-green-600 bg-green-50'
      case 'product': return 'text-purple-600 bg-purple-50'
      case 'price': return 'text-orange-600 bg-orange-50'
      case 'system': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (!user) {
    return (
      <div className="py-8 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <Link href="/account">
              <Button>Go to Login</Button>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="py-8 bg-gray-50">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link href="/account" className="text-brand-green hover:text-brand-navy">
              ← Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow border">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <Bell className="w-8 h-8 text-brand-green" />
                <div>
                  <h1 className="text-3xl font-bold text-brand-navy">Notifications</h1>
                  <p className="text-gray-600">
                    {unreadCount > 0 ? `${unreadCount} unread notification(s)` : 'All notifications read'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setActiveTab('notifications')}
                  className={activeTab === 'notifications' ? 'bg-brand-green' : 'bg-gray-200 text-gray-700'}
                >
                  Notifications
                </Button>
                <Button
                  onClick={() => setActiveTab('settings')}
                  className={activeTab === 'settings' ? 'bg-brand-green' : 'bg-gray-200 text-gray-700'}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className="p-4 border-b bg-green-50 text-green-700 border-green-200">
                {message}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {activeTab === 'notifications' ? (
                <div>
                  {/* Actions Bar */}
                  {notifications.length > 0 && (
                    <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">
                        {notifications.length} total notifications
                      </span>
                      <div className="flex gap-3">
                        {unreadCount > 0 && (
                          <Button
                            onClick={markAllAsRead}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Mark All Read
                          </Button>
                        )}
                        <Button
                          onClick={clearAllNotifications}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Clear All
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Notifications List */}
                  {notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <BellOff className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                      <h2 className="text-2xl font-semibold text-gray-600 mb-4">No notifications</h2>
                      <p className="text-gray-500">
                        You're all caught up! New notifications will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 border rounded-lg transition-all ${
                            !notification.read 
                              ? 'bg-blue-50 border-blue-200 shadow-sm' 
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${getNotificationColor(notification.type)}`}>
                              {getNotificationIcon(notification.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className={`font-semibold ${!notification.read ? 'text-brand-navy' : 'text-gray-700'}`}>
                                    {notification.title}
                                    {!notification.read && (
                                      <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
                                    )}
                                  </h3>
                                  <p className="text-gray-600 mt-1">{notification.message}</p>
                                  <p className="text-sm text-gray-500 mt-2">
                                    {new Date(notification.timestamp).toLocaleDateString()} at{' '}
                                    {new Date(notification.timestamp).toLocaleTimeString()}
                                  </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 ml-4">
                                  {!notification.read && (
                                    <button
                                      onClick={() => markAsRead(notification.id)}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Mark as read"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteNotification(notification.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Action Button */}
                              {notification.action && (
                                <div className="mt-3">
                                  <Link href={notification.action.url}>
                                    <Button
                                      size="sm"
                                      className="bg-brand-green hover:bg-brand-green/90"
                                    >
                                      {notification.action.text}
                                    </Button>
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Settings Tab */
                <div>
                  <h2 className="text-2xl font-semibold text-brand-navy mb-6">Notification Settings</h2>
                  
                  <div className="grid gap-8 md:grid-cols-2">
                    {/* Delivery Methods */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Methods</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Email Notifications</p>
                              <p className="text-sm text-gray-600">Receive notifications via email</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.email}
                              onChange={(e) => setSettings({ ...settings, email: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-medium">SMS Notifications</p>
                              <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.sms}
                              onChange={(e) => setSettings({ ...settings, sms: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Push Notifications</p>
                              <p className="text-sm text-gray-600">Receive browser notifications</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.push}
                              onChange={(e) => setSettings({ ...settings, push: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Notification Types */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Types</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Order Updates</p>
                            <p className="text-sm text-gray-600">Status updates for your orders</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.orderUpdates}
                              onChange={(e) => setSettings({ ...settings, orderUpdates: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Promotions & Offers</p>
                            <p className="text-sm text-gray-600">Special deals and discounts</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.promotions}
                              onChange={(e) => setSettings({ ...settings, promotions: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">New Products</p>
                            <p className="text-sm text-gray-600">Alerts for new product launches</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.newProducts}
                              onChange={(e) => setSettings({ ...settings, newProducts: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Price Alerts</p>
                            <p className="text-sm text-gray-600">Notifications for wishlist price drops</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.priceAlerts}
                              onChange={(e) => setSettings({ ...settings, priceAlerts: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end mt-8">
                    <Button 
                      onClick={saveSettings}
                      className="bg-brand-green hover:bg-brand-green/90"
                    >
                      Save Settings
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
