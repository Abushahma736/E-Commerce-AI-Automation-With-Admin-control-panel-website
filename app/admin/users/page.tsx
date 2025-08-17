'use client'

import { useState, useEffect } from 'react'
import { Search, Eye, Edit, Trash2, UserPlus, Mail, Phone, MapPin, Calendar, Shield, Ban } from 'lucide-react'

interface User {
  _id: string
  name: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  orderCount: number
  totalSpent: number
  registeredAt: string
  lastOrderAt: string
  status: 'active' | 'inactive' | 'banned'
  isVerified: boolean
  role: 'customer' | 'admin'
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockUsers: User[] = [
      {
        _id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        orderCount: 15,
        totalSpent: 1250.50,
        registeredAt: '2023-06-15T10:30:00Z',
        lastOrderAt: '2024-01-10T14:20:00Z',
        status: 'active',
        isVerified: true,
        role: 'customer'
      },
      {
        _id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1987654321',
        address: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        orderCount: 8,
        totalSpent: 567.25,
        registeredAt: '2023-08-20T09:15:00Z',
        lastOrderAt: '2024-01-05T11:45:00Z',
        status: 'active',
        isVerified: false,
        role: 'customer'
      },
      {
        _id: '3',
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '+1555000123',
        address: {
          street: '789 Admin Blvd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        orderCount: 0,
        totalSpent: 0,
        registeredAt: '2023-01-01T00:00:00Z',
        lastOrderAt: '',
        status: 'active',
        isVerified: true,
        role: 'admin'
      }
    ]
    
    setTimeout(() => {
      setUsers(mockUsers)
      setLoading(false)
    }, 1000)
  }, [])

  const updateUserStatus = (userId: string, newStatus: User['status']) => {
    setUsers(users.map(user => 
      user._id === userId ? { ...user, status: newStatus } : user
    ))
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800'
      case 'banned':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    return role === 'admin' ? <Shield className="h-4 w-4 text-blue-600" /> : null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="mt-2 text-lg text-gray-600">Manage customer accounts and permissions</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">
            {users.length}
          </div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">
            {users.filter(u => u.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.isVerified).length}
          </div>
          <div className="text-sm text-gray-600">Verified Users</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-emerald-600">
            ₹{users.reduce((sum, user) => sum + user.totalSpent, 0).toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          {getRoleIcon(user.role)}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.isVerified && (
                          <div className="text-xs text-green-600">✓ Verified</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-1" />
                      {user.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {user.address.city}, {user.address.state}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.orderCount}</div>
                    <div className="text-sm text-gray-500">
                      {user.lastOrderAt ? new Date(user.lastOrderAt).toLocaleDateString() : 'Never'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{user.totalSpent.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.registeredAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <select
                        value={user.status}
                        onChange={(e) => updateUserStatus(user._id, e.target.value as User['status'])}
                        className="text-xs border rounded px-1 py-1"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="banned">Banned</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">User Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Personal Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedUser.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedUser.phone}</p>
                    <p><span className="font-medium">Role:</span> {selectedUser.role}</p>
                    <p><span className="font-medium">Verified:</span> {selectedUser.isVerified ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Order Statistics</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Total Orders:</span> {selectedUser.orderCount}</p>
                    <p><span className="font-medium">Total Spent:</span> ₹{selectedUser.totalSpent.toFixed(2)}</p>
                    <p><span className="font-medium">Avg Order:</span> ₹{selectedUser.orderCount > 0 ? (selectedUser.totalSpent / selectedUser.orderCount).toFixed(2) : '0.00'}</p>
                    <p><span className="font-medium">Last Order:</span> {selectedUser.lastOrderAt ? new Date(selectedUser.lastOrderAt).toLocaleDateString() : 'Never'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold">Address</h4>
                <div className="text-sm">
                  <p>{selectedUser.address.street}</p>
                  <p>{selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.zipCode}</p>
                  <p>{selectedUser.address.country}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold">Account Information</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </p>
                  <p><span className="font-medium">Registered:</span> {new Date(selectedUser.registeredAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                  Send Email
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                  View Orders
                </button>
                <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm">
                  Edit User
                </button>
                {selectedUser.status !== 'banned' && (
                  <button 
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    onClick={() => updateUserStatus(selectedUser._id, 'banned')}
                  >
                    Ban User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
