"use client"
import { useEffect, useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Shield, Eye, EyeOff, Key, Smartphone, AlertTriangle, CheckCircle, Lock } from 'lucide-react'
import Link from 'next/link'

interface SecuritySettings {
  twoFactorEnabled: boolean
  loginNotifications: boolean
  deviceManagement: boolean
  passwordStrength: 'weak' | 'medium' | 'strong'
  lastPasswordChange: string
}

interface LoginSession {
  id: string
  device: string
  location: string
  browser: string
  lastActive: string
  current: boolean
}

export default function SecurityPage() {
  const [user, setUser] = useState<any>(null)
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginNotifications: true,
    deviceManagement: true,
    passwordStrength: 'medium',
    lastPasswordChange: new Date().toISOString()
  })
  const [sessions] = useState<LoginSession[]>([
    {
      id: '1',
      device: 'Windows PC',
      location: 'Mumbai, Maharashtra',
      browser: 'Chrome 120',
      lastActive: new Date().toISOString(),
      current: true
    },
    {
      id: '2',
      device: 'iPhone 14',
      location: 'Mumbai, Maharashtra',
      browser: 'Safari Mobile',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      current: false
    }
  ])
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'password' | 'security' | 'sessions'>('password')

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      if (raw) {
        setUser(JSON.parse(raw))
        
        // Load security settings
        const settingsRaw = localStorage.getItem('securitySettings')
        if (settingsRaw) {
          setSecuritySettings(JSON.parse(settingsRaw))
        }
      }
    } catch {}
  }, [])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('New passwords do not match!')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long!')
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage('Password changed successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      
      // Update security settings
      const updatedSettings = {
        ...securitySettings,
        lastPasswordChange: new Date().toISOString(),
        passwordStrength: getPasswordStrength(passwordForm.newPassword)
      }
      setSecuritySettings(updatedSettings)
      localStorage.setItem('securitySettings', JSON.stringify(updatedSettings))
    } catch {
      setMessage('Failed to change password!')
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    if (password.length < 6) return 'weak'
    if (password.length < 10 && !/[A-Z]/.test(password) && !/[0-9]/.test(password)) return 'weak'
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) return 'strong'
    return 'medium'
  }

  const getPasswordStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'strong': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const saveSecuritySettings = () => {
    localStorage.setItem('securitySettings', JSON.stringify(securitySettings))
    setMessage('Security settings saved successfully!')
    setTimeout(() => setMessage(null), 3000)
  }

  const terminateSession = (sessionId: string) => {
    setMessage(`Session terminated successfully!`)
    setTimeout(() => setMessage(null), 3000)
  }

  const terminateAllSessions = () => {
    setMessage('All other sessions terminated successfully!')
    setTimeout(() => setMessage(null), 3000)
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
                <Shield className="w-8 h-8 text-brand-green" />
                <div>
                  <h1 className="text-3xl font-bold text-brand-navy">Security</h1>
                  <p className="text-gray-600">Manage your account security and privacy</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setActiveTab('password')}
                  className={activeTab === 'password' ? 'bg-brand-green' : 'bg-gray-200 text-gray-700'}
                >
                  <Key className="w-4 h-4 mr-2" />
                  Password
                </Button>
                <Button
                  onClick={() => setActiveTab('security')}
                  className={activeTab === 'security' ? 'bg-brand-green' : 'bg-gray-200 text-gray-700'}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Security
                </Button>
                <Button
                  onClick={() => setActiveTab('sessions')}
                  className={activeTab === 'sessions' ? 'bg-brand-green' : 'bg-gray-200 text-gray-700'}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Sessions
                </Button>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 border-b ${message.includes('success') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {message}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {activeTab === 'password' && (
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-semibold text-brand-navy mb-6">Change Password</h2>
                  
                  {/* Password Strength Indicator */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Current Password Strength</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPasswordStrengthColor(securitySettings.passwordStrength)}`}>
                        {securitySettings.passwordStrength.charAt(0).toUpperCase() + securitySettings.passwordStrength.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Last changed: {new Date(securitySettings.lastPasswordChange).toLocaleDateString()}
                    </p>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute right-3 top-2.5 text-gray-500"
                        >
                          {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-2.5 text-gray-500"
                        >
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordForm.newPassword && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <div className={`h-1 flex-1 rounded ${getPasswordStrength(passwordForm.newPassword) === 'weak' ? 'bg-red-400' : 'bg-gray-200'}`}></div>
                            <div className={`h-1 flex-1 rounded ${['medium', 'strong'].includes(getPasswordStrength(passwordForm.newPassword)) ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
                            <div className={`h-1 flex-1 rounded ${getPasswordStrength(passwordForm.newPassword) === 'strong' ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                          </div>
                          <p className={`text-xs mt-1 ${getPasswordStrengthColor(getPasswordStrength(passwordForm.newPassword)).split(' ')[0]}`}>
                            Password strength: {getPasswordStrength(passwordForm.newPassword)}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-2.5 text-gray-500"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-1">Password Requirements</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• At least 8 characters long</li>
                            <li>• Include uppercase and lowercase letters</li>
                            <li>• Include at least one number</li>
                            <li>• Include at least one special character (!@#$%^&*)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-green hover:bg-brand-green/90"
                    >
                      {loading ? 'Changing Password...' : 'Change Password'}
                    </Button>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-semibold text-brand-navy mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Two-Factor Authentication */}
                    <div className="border rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center">
                            <Lock className="w-6 h-6 text-brand-green" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">Two-Factor Authentication</h3>
                            <p className="text-gray-600">Add an extra layer of security to your account</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${securitySettings.twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                          <Button
                            onClick={() => {
                              const updated = { ...securitySettings, twoFactorEnabled: !securitySettings.twoFactorEnabled }
                              setSecuritySettings(updated)
                              setMessage(updated.twoFactorEnabled ? '2FA enabled!' : '2FA disabled!')
                              setTimeout(() => setMessage(null), 3000)
                            }}
                            variant={securitySettings.twoFactorEnabled ? "outline" : "default"}
                            className={securitySettings.twoFactorEnabled ? "" : "bg-brand-green"}
                          >
                            {securitySettings.twoFactorEnabled ? 'Disable' : 'Enable'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Login Notifications */}
                    <div className="border rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Login Notifications</h3>
                          <p className="text-gray-600">Get notified when someone logs into your account</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.loginNotifications}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, loginNotifications: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                        </label>
                      </div>
                    </div>

                    {/* Device Management */}
                    <div className="border rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Device Management</h3>
                          <p className="text-gray-600">Track and manage devices that access your account</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.deviceManagement}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, deviceManagement: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                        </label>
                      </div>
                    </div>

                    <Button 
                      onClick={saveSecuritySettings}
                      className="bg-brand-green hover:bg-brand-green/90"
                    >
                      Save Security Settings
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'sessions' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-brand-navy">Active Sessions</h2>
                      <p className="text-gray-600">Manage devices and sessions that are logged into your account</p>
                    </div>
                    <Button
                      onClick={terminateAllSessions}
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Terminate All Other Sessions
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${session.current ? 'bg-green-100' : 'bg-gray-100'}`}>
                              <Smartphone className={`w-6 h-6 ${session.current ? 'text-green-600' : 'text-gray-600'}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{session.device}</h3>
                                {session.current && (
                                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                                    Current Session
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p><span className="font-medium">Location:</span> {session.location}</p>
                                <p><span className="font-medium">Browser:</span> {session.browser}</p>
                                <p><span className="font-medium">Last active:</span> {new Date(session.lastActive).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                          
                          {!session.current && (
                            <Button
                              onClick={() => terminateSession(session.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              Terminate
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 mb-1">Security Tip</h4>
                        <p className="text-sm text-yellow-700">
                          If you notice any suspicious activity or unrecognized devices, 
                          terminate those sessions immediately and change your password.
                        </p>
                      </div>
                    </div>
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
