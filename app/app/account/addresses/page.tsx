"use client"
import { useEffect, useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { MapPin, Plus, Trash2, Edit3, Home, Building, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Address {
  id: string
  type: 'home' | 'office' | 'other'
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export default function AddressesPage() {
  const [user, setUser] = useState<any>(null)
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      name: 'John Doe',
      phone: '+91 9876543210',
      addressLine1: '123 Green Street',
      addressLine2: 'Near Central Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isDefault: true
    }
  ])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: 'home',
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  })

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      if (raw) {
        setUser(JSON.parse(raw))
        // Load saved addresses
        const addressesRaw = localStorage.getItem('addresses')
        if (addressesRaw) {
          setAddresses(JSON.parse(addressesRaw))
        }
      }
    } catch {}
  }, [])

  const saveAddresses = (addressList: Address[]) => {
    setAddresses(addressList)
    localStorage.setItem('addresses', JSON.stringify(addressList))
  }

  const validateAddress = (address: Partial<Address>) => {
    if (!address.name || !address.phone || !address.addressLine1 || 
        !address.city || !address.state || !address.pincode) {
      return 'Please fill in all required fields!'
    }
    if (address.pincode && address.pincode.length !== 6) {
      return 'Please enter a valid 6-digit PIN code!'
    }
    if (address.phone && !/^[+]?[0-9]{10,12}$/.test(address.phone.replace(/\s/g, ''))) {
      return 'Please enter a valid phone number!'
    }
    return null
  }

  const addAddress = () => {
    const validation = validateAddress(newAddress)
    if (validation) {
      setMessage(validation)
      return
    }

    const address: Address = {
      id: Date.now().toString(),
      type: newAddress.type as any,
      name: newAddress.name!,
      phone: newAddress.phone!,
      addressLine1: newAddress.addressLine1!,
      addressLine2: newAddress.addressLine2,
      city: newAddress.city!,
      state: newAddress.state!,
      pincode: newAddress.pincode!,
      isDefault: addresses.length === 0
    }

    const updatedAddresses = [...addresses, address]
    saveAddresses(updatedAddresses)
    setShowAddForm(false)
    setNewAddress({
      type: 'home',
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: ''
    })
    setMessage('Address added successfully!')
    setTimeout(() => setMessage(null), 3000)
  }

  const updateAddress = () => {
    if (!editingAddress) return
    
    const validation = validateAddress(editingAddress)
    if (validation) {
      setMessage(validation)
      return
    }

    const updatedAddresses = addresses.map(addr => 
      addr.id === editingAddress.id ? editingAddress : addr
    )
    saveAddresses(updatedAddresses)
    setEditingAddress(null)
    setMessage('Address updated successfully!')
    setTimeout(() => setMessage(null), 3000)
  }

  const removeAddress = (id: string) => {
    const address = addresses.find(a => a.id === id)
    if (address?.isDefault && addresses.length > 1) {
      // Set another address as default
      const updatedAddresses = addresses.filter(a => a.id !== id)
      updatedAddresses[0].isDefault = true
      saveAddresses(updatedAddresses)
    } else {
      const updatedAddresses = addresses.filter(a => a.id !== id)
      saveAddresses(updatedAddresses)
    }
    setMessage('Address removed successfully!')
    setTimeout(() => setMessage(null), 3000)
  }

  const setDefaultAddress = (id: string) => {
    const updatedAddresses = addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    }))
    saveAddresses(updatedAddresses)
    setMessage('Default address updated!')
    setTimeout(() => setMessage(null), 3000)
  }

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="w-5 h-5" />
      case 'office': return <Building className="w-5 h-5" />
      default: return <MapPin className="w-5 h-5" />
    }
  }

  const getAddressColor = (type: string) => {
    switch (type) {
      case 'home': return 'text-green-600 bg-green-50'
      case 'office': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh', 'Puducherry'
  ]

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

  const currentForm = editingAddress || newAddress

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
                <MapPin className="w-8 h-8 text-brand-green" />
                <div>
                  <h1 className="text-3xl font-bold text-brand-navy">My Addresses</h1>
                  <p className="text-gray-600">{addresses.length} saved address(es)</p>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-brand-green hover:bg-brand-green/90"
              >
                <Plus className="w-4 h-4" />
                Add New Address
              </Button>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 border-b ${message.includes('success') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {message}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Add/Edit Address Form */}
              {(showAddForm || editingAddress) && (
                <div className="mb-8 p-6 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-brand-navy">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <Button 
                      onClick={() => {
                        setShowAddForm(false)
                        setEditingAddress(null)
                        setMessage(null)
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                      <select
                        value={currentForm.type}
                        onChange={(e) => editingAddress 
                          ? setEditingAddress({ ...editingAddress, type: e.target.value as any })
                          : setNewAddress({ ...newAddress, type: e.target.value as any })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      >
                        <option value="home">Home</option>
                        <option value="office">Office</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={currentForm.name}
                        onChange={(e) => editingAddress 
                          ? setEditingAddress({ ...editingAddress, name: e.target.value })
                          : setNewAddress({ ...newAddress, name: e.target.value })
                        }
                        placeholder="Enter full name"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={currentForm.phone}
                        onChange={(e) => editingAddress 
                          ? setEditingAddress({ ...editingAddress, phone: e.target.value })
                          : setNewAddress({ ...newAddress, phone: e.target.value })
                        }
                        placeholder="+91 9876543210"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                      <input
                        type="text"
                        value={currentForm.pincode}
                        onChange={(e) => editingAddress 
                          ? setEditingAddress({ ...editingAddress, pincode: e.target.value })
                          : setNewAddress({ ...newAddress, pincode: e.target.value })
                        }
                        placeholder="400001"
                        maxLength={6}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                      <input
                        type="text"
                        value={currentForm.addressLine1}
                        onChange={(e) => editingAddress 
                          ? setEditingAddress({ ...editingAddress, addressLine1: e.target.value })
                          : setNewAddress({ ...newAddress, addressLine1: e.target.value })
                        }
                        placeholder="House/Flat No., Street Name"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                      <input
                        type="text"
                        value={currentForm.addressLine2}
                        onChange={(e) => editingAddress 
                          ? setEditingAddress({ ...editingAddress, addressLine2: e.target.value })
                          : setNewAddress({ ...newAddress, addressLine2: e.target.value })
                        }
                        placeholder="Landmark, Area (Optional)"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        value={currentForm.city}
                        onChange={(e) => editingAddress 
                          ? setEditingAddress({ ...editingAddress, city: e.target.value })
                          : setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        placeholder="Mumbai"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <select
                        value={currentForm.state}
                        onChange={(e) => editingAddress 
                          ? setEditingAddress({ ...editingAddress, state: e.target.value })
                          : setNewAddress({ ...newAddress, state: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      >
                        <option value="">Select State</option>
                        {indianStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button 
                      onClick={editingAddress ? updateAddress : addAddress}
                      className="bg-brand-green hover:bg-brand-green/90"
                    >
                      {editingAddress ? 'Update Address' : 'Add Address'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Addresses List */}
              {addresses.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                  <h2 className="text-2xl font-semibold text-gray-600 mb-4">No addresses saved</h2>
                  <p className="text-gray-500 mb-6">
                    Add your delivery addresses to make checkout faster
                  </p>
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-brand-green hover:bg-brand-green/90"
                  >
                    Add Your First Address
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAddressColor(address.type)}`}>
                            {getAddressIcon(address.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg capitalize">{address.type}</h3>
                              {address.isDefault && (
                                <span className="bg-brand-green/10 text-brand-green text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{address.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => setEditingAddress(address)}
                            variant="outline"
                            size="sm"
                            className="text-brand-green border-brand-green hover:bg-brand-green hover:text-white"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => removeAddress(address.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        <p className="font-medium text-brand-navy">{address.name}</p>
                        <p>{address.phone}</p>
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>{address.city}, {address.state} - {address.pincode}</p>
                      </div>

                      {!address.isDefault && (
                        <Button
                          onClick={() => setDefaultAddress(address.id)}
                          variant="outline"
                          size="sm"
                          className="w-full text-brand-green border-brand-green hover:bg-brand-green hover:text-white"
                        >
                          Set as Default
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
