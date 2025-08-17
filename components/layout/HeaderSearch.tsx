"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import Link from 'next/link'

type Product = { id: string; title: string; price: number; image: string }

export function HeaderSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const debouncedQuery = useDebounce(query, 200)

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([])
      setOpen(false)
      return
    }
    setLoading(true)
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&pageSize=5`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => { setResults(d.items || []); setOpen(true) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [debouncedQuery])

  // Ctrl/Cmd+K to focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="relative w-full max-w-lg">
      <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-brand-green shadow-sm">
        <Search className="h-4 w-4 text-slate-500 flex-shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search products..."
          className="w-full outline-none text-sm placeholder:text-slate-400"
        />
      </div>
      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white border rounded-md shadow-lg overflow-hidden animate-slide-up" role="listbox">
          {loading ? (
            <div className="px-3 py-2 text-sm text-slate-500">Searching…</div>
          ) : results.length === 0 ? (
            <div className="px-3 py-2 text-sm text-slate-500">No results</div>
          ) : (
            <ul className="max-h-80 overflow-auto">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.id}`}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    <img src={p.image} alt="" className="h-8 w-8 rounded object-cover" />
                    <span className="text-sm flex-1 truncate">{p.title}</span>
                    <span className="text-sm text-brand-green">₹{p.price}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/shop`} className="block text-center text-sm px-3 py-2 border-t hover:bg-slate-50" onClick={() => setOpen(false)}>
                  View all results
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}


