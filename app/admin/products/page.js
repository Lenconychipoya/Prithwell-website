'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminProductsPage() {
  const router   = useRouter()
  const [products, setProducts] = useState([])
  const [search,   setSearch]   = useState('')
  const [loading,  setLoading]  = useState(true)
  const [query,    setQuery]    = useState('')

  const fetchProducts = useCallback(async (q) => {
    setLoading(true)
    const qs  = q ? `?search=${encodeURIComponent(q)}` : ''
    const res = await fetch(`/api/admin/products${qs}`)
    if (res.status === 401) { router.push('/admin/login'); return }
    const { products } = await res.json()
    setProducts(products ?? [])
    setLoading(false)
  }, [router])

  useEffect(() => { fetchProducts('') }, [fetchProducts])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => fetchProducts(query), 350)
    return () => clearTimeout(t)
  }, [query, fetchProducts])

  const withImages    = products.filter(p => p.images?.length > 0).length
  const withoutImages = products.length - withImages

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <header style={{ background: '#0a1628', borderBottom: '1px solid #1a2a44' }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <span style={{ color: '#c9a227', fontFamily: 'Arial Black, sans-serif', fontWeight: 900, fontSize: '1rem' }}>PRITHWELL</span>
            <span style={{ color: '#445566' }}>|</span>
            <Link href="/admin" className="hover:text-white transition-colors" style={{ color: '#8899bb', minHeight: 0 }}>Orders</Link>
            <span style={{ color: '#c9a227', fontWeight: 600 }}>Products</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs" style={{ color: '#8899bb', minHeight: 0 }}>← View site</Link>
            <button onClick={logout} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', color: '#8899bb', minHeight: 0 }}>Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-gray-900 text-2xl">Products</h1>
          <div className="flex gap-3 text-sm">
            <span className="card px-3 py-2 text-xs text-gray-500">{withImages} <span className="font-medium text-green-600">with images</span></span>
            <span className="card px-3 py-2 text-xs text-gray-500">{withoutImages} <span className="font-medium text-amber-600">need images</span></span>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="input max-w-sm"
            placeholder="Search by name or SKU…"
          />
        </div>

        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading products…</div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">No products found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    {['Image', 'Name', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Action'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => {
                    const hasImg = p.images?.length > 0
                    const price  = p.online_price ?? p.selling_price
                    return (
                      <tr key={p.id} style={{ borderBottom: i < products.length - 1 ? '1px solid #f3f4f6' : 'none' }} className="hover:bg-gray-50">
                        {/* Thumbnail */}
                        <td className="px-4 py-2">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                            {hasImg ? (
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain" />
                            ) : (
                              <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-300" fill="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="font-medium text-gray-900 text-xs leading-snug max-w-[200px]">{p.name}</div>
                          {p.brand && <div className="text-gray-400 text-xs">{p.brand}</div>}
                        </td>
                        <td className="px-4 py-2 font-mono text-xs text-gray-500">{p.sku}</td>
                        <td className="px-4 py-2 text-xs text-gray-500">{p.categories?.name ?? '—'}</td>
                        <td className="px-4 py-2 text-xs font-bold text-gray-900">${Number(price).toFixed(2)}</td>
                        <td className="px-4 py-2 text-xs text-center">
                          <span className={p.quantity > 0 ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                            {p.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span className="badge" style={{ background: p.is_active ? '#d1fae5' : '#fee2e2', color: p.is_active ? '#065f46' : '#991b1b' }}>
                            {p.is_active ? 'Active' : 'Hidden'}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors"
                            style={{
                              minHeight: 0,
                              background: hasImg ? '#fff' : '#c9a227',
                              color: hasImg ? '#374151' : '#0a1628',
                              borderColor: hasImg ? '#e5e7eb' : '#c9a227',
                              fontWeight: hasImg ? 400 : 700,
                            }}
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/></svg>
                            {hasImg ? `${p.images.length} photo${p.images.length > 1 ? 's' : ''}` : 'Add images'}
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
