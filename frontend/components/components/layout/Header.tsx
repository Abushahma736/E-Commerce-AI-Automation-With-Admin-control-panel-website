"use client"
import Link from 'next/link'
import { ShoppingCart, Menu, Package, Home, Info, Phone, ChevronDown, Bot, BookOpen, User, LogOut, Settings, Heart, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/cn'
import { SmartHeaderSearch } from './SmartHeaderSearch'
import { QuickAISearch } from './QuickAISearch'

function NavLink({ href, children, icon, iconRight = false }: { href: string; children: React.ReactNode; icon?: React.ReactNode; iconRight?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-2 px-3 py-3 text-sm hover:text-brand-green transition-all duration-200 hover:bg-slate-50 rounded-lg ${
      iconRight ? 'justify-between' : ''
    }`}>
      {!iconRight && icon}
      <span className="font-medium">{children}</span>
      {iconRight && icon}
    </Link>
  )
}

type Category = { slug: string; name: string; type: string }

export function Header() {
  const itemCount = useCartStore((s) => s.items.reduce((a, i) => a + i.quantity, 0))
  const [isMegaOpen, setMegaOpen] = useState(false)
  const [isMobileOpen, setMobileOpen] = useState(false)
  const [isUserMenuOpen, setUserMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [user, setUser] = useState<{id: string, name: string, email: string} | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    // Fetch categories
    fetch('/api/categories', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data: Category[]) => { if (mounted) setCategories(data) })
      .catch(() => { /* ignore */ })

    // Check authentication status
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (mounted) { setUser(data); setIsLoading(false) }})
      .catch(() => { if (mounted) { setUser(null); setIsLoading(false) }})

    return () => { mounted = false }
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      setUser(null)
      setUserMenuOpen(false)
      // Optionally redirect to home page
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const b2b = categories.filter((c) => c.type === 'B2B')
  const b2c = categories.filter((c) => c.type === 'B2C')

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b supports-[backdrop-filter]:backdrop-blur animate-slide-down shadow-sm">
      <div className="container-base h-16 flex items-center gap-3 md:gap-6">
        {/* Logo */}
        <Link href="/" className="font-serif text-lg md:text-xl lg:text-2xl text-brand-navy flex-none flex items-center gap-2">
          <Package className="h-5 w-5 md:h-6 md:w-6 text-brand-green" />
          <span className="inline text-sm md:text-base lg:text-xl">ESSE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavLink href="/" icon={<Home className="h-4 w-4" />}>Home</NavLink>
          
          {/* Categories Navigation */}
          <div className="relative group" onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)} onFocus={() => setMegaOpen(true)} onBlur={() => setMegaOpen(false)}>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm hover:text-brand-green transition-all duration-200 rounded-lg hover:bg-brand-green/5 font-medium" aria-haspopup="menu" aria-expanded={isMegaOpen}>
              <Package className="h-4 w-4" />
              <span>Categories</span>
              <ChevronDown className={cn('h-3 w-3 transition-transform duration-200', isMegaOpen ? 'rotate-180' : '')} />
            </button>
            <div className={cn('absolute left-0 mt-2 w-[500px] bg-white shadow-2xl border border-gray-200 rounded-2xl p-6 grid grid-cols-2 gap-6 animate-fade-in', isMegaOpen ? 'block' : 'hidden')}
                 role="menu">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">B2B</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Business Solutions</h4>
                    <p className="text-xs text-gray-600">Wholesale & Bulk Orders</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {b2b.slice(0, 6).map((c) => (
                    <li key={c.slug}>
                      <Link className="group flex items-center gap-3 p-2 hover:bg-white/60 rounded-lg transition-all duration-200" href={`/category/${c.slug}`}>
                        <div className="w-2 h-2 bg-brand-green rounded-full group-hover:scale-125 transition-transform"></div>
                        <span className="text-sm text-gray-700 group-hover:text-brand-green font-medium transition-colors">{c.name}</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/categories/b2b" className="flex items-center gap-2 text-xs text-brand-green hover:text-brand-green/80 font-medium mt-2">
                      <span>View All B2B</span>
                      <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">B2C</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Retail Products</h4>
                    <p className="text-xs text-gray-600">Individual & Family Care</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {b2c.slice(0, 6).map((c) => (
                    <li key={c.slug}>
                      <Link className="group flex items-center gap-3 p-2 hover:bg-white/60 rounded-lg transition-all duration-200" href={`/category/${c.slug}`}>
                        <div className="w-2 h-2 bg-brand-green rounded-full group-hover:scale-125 transition-transform"></div>
                        <span className="text-sm text-gray-700 group-hover:text-brand-green font-medium transition-colors">{c.name}</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/categories/b2c" className="flex items-center gap-2 text-xs text-brand-green hover:text-brand-green/80 font-medium mt-2">
                      <span>View All B2C</span>
                      <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Direct Shop Link */}
          <NavLink href="/shop" icon={<Package className="h-4 w-4" />}>Shop</NavLink>
          <NavLink href="/about" icon={<Info className="h-4 w-4" />}>About</NavLink>
          <NavLink href="/blog" icon={<BookOpen className="h-4 w-4" />}>Blog</NavLink>
          <NavLink href="/contact" icon={<Phone className="h-4 w-4" />}>Contact</NavLink>
          <Link 
            href="/ai-dashboard" 
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-brand-green to-emerald-600 text-white rounded-lg hover:from-brand-green/90 hover:to-emerald-600/90 transition-all font-medium shadow-lg hover:shadow-xl text-sm"
          >
            <Bot className="h-4 w-4" />
            AI Hub
          </Link>
        </nav>

        {/* AI-Powered Search Bar */}
        <div className="hidden sm:flex flex-1 justify-center max-w-2xl">
          <SmartHeaderSearch />
        </div>
        
        {/* Mobile Quick AI Search */}
        <div className="flex sm:hidden">
          <QuickAISearch />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* User Authentication */}
          {!isLoading && (
            <div className="hidden lg:block">
              {user ? (
                <div className="relative" onMouseLeave={() => setUserMenuOpen(false)}>
                  <button 
                    onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                    onMouseEnter={() => setUserMenuOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 rounded-lg transition-all font-medium hover:text-brand-green"
                    aria-haspopup="menu"
                    aria-expanded={isUserMenuOpen}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-brand-green to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden xl:inline max-w-24 truncate">{user.name}</span>
                    <ChevronDown className={cn('h-3 w-3 transition-transform duration-200', isUserMenuOpen ? 'rotate-180' : '')} />
                  </button>
                  
                  <div className={cn('absolute right-0 mt-2 w-64 bg-white shadow-xl border border-gray-200 rounded-xl py-2 animate-fade-in', isUserMenuOpen ? 'block' : 'hidden')}
                       role="menu">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-brand-green to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                          <div className="text-xs text-gray-500 truncate">{user.email}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 transition-colors text-gray-700 hover:text-brand-green">
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                      <Link href="/orders" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 transition-colors text-gray-700 hover:text-brand-green">
                        <ShoppingBag className="h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                      <Link href="/wishlist" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 transition-colors text-gray-700 hover:text-brand-green">
                        <Heart className="h-4 w-4" />
                        <span>Wishlist</span>
                      </Link>
                      <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 transition-colors text-gray-700 hover:text-brand-green">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-2">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-red-50 transition-colors text-red-600 hover:text-red-700"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link 
                    href="/login?mode=login" 
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-brand-green transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/login?mode=signup" 
                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-brand-green to-emerald-600 text-white rounded-lg hover:from-brand-green/90 hover:to-emerald-600/90 transition-all shadow-lg hover:shadow-xl"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}
          
          <Link href="/cart" className="relative flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 text-sm hover:text-brand-green transition-colors">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] rounded-full bg-brand-green text-white text-xs grid place-items-center px-1 font-medium">{itemCount}</span>
            <span className="hidden lg:inline">Cart</span>
          </Link>
          <button 
            className="lg:hidden p-2 hover:bg-slate-100 rounded-md transition-colors" 
            onClick={() => setMobileOpen((o) => !o)} 
            aria-label="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn('lg:hidden border-t bg-white shadow-lg', isMobileOpen ? 'block' : 'hidden')}>
        <div className="container-base py-4 space-y-4">
          {/* Mobile Authentication */}
          {!isLoading && (
            <div className="border-b pb-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <div className="w-10 h-10 bg-gradient-to-r from-brand-green to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 rounded-lg transition-colors">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <Link href="/orders" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 rounded-lg transition-colors">
                      <ShoppingBag className="h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                    <Link href="/wishlist" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 rounded-lg transition-colors">
                      <Heart className="h-4 w-4" />
                      <span>Wishlist</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 rounded-lg transition-colors text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link 
                    href="/login?mode=login" 
                    className="flex-1 px-4 py-2 text-sm font-medium text-center text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/login?mode=signup" 
                    className="flex-1 px-4 py-2 text-sm font-medium text-center bg-gradient-to-r from-brand-green to-emerald-600 text-white rounded-lg hover:from-brand-green/90 hover:to-emerald-600/90 transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-2">
            <NavLink href="/" icon={<Home className="h-4 w-4" />} iconRight={true}>Home</NavLink>
            <NavLink href="/about" icon={<Info className="h-4 w-4" />} iconRight={true}>About</NavLink>
            <NavLink href="/blog" icon={<BookOpen className="h-4 w-4" />} iconRight={true}>Blog</NavLink>
            <NavLink href="/contact" icon={<Phone className="h-4 w-4" />} iconRight={true}>Contact</NavLink>
            <Link 
              href="/ai-dashboard" 
              className="flex items-center justify-between gap-2 px-3 py-3 bg-gradient-to-r from-brand-green to-emerald-600 text-white rounded-lg font-medium shadow-lg text-sm"
            >
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <span className="font-medium">AI Hub</span>
              </div>
            </Link>
          </div>
          <div className="border-t pt-4">
            <div className="text-sm text-slate-600 mb-2 font-medium">Categories</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-500 mb-2">B2B</div>
                <div className="space-y-1">
                  {b2b.map((c) => (
                    <Link key={c.slug} className="block text-sm py-1 hover:text-brand-green transition-colors" href={`/category/${c.slug}`}>
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-2">B2C</div>
                <div className="space-y-1">
                  {b2c.map((c) => (
                    <Link key={c.slug} className="block text-sm py-1 hover:text-brand-green transition-colors" href={`/category/${c.slug}`}>
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}


