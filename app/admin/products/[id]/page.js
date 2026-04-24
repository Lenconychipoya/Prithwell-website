'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

export default function ProductImagesPage() {
  const { id }   = useParams()
  const router   = useRouter()
  const inputRef = useRef(null)

  const [product,   setProduct]   = useState(null)
  const [images,    setImages]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragOver,  setDragOver]  = useState(false)
  const [error,     setError]     = useState('')
  const [deleting,  setDeleting]  = useState(null)
  const [previews,  setPreviews]  = useState([]) // local previews before upload

  const fetchProduct = useCallback(async () => {
    const res = await fetch(`/api/admin/products?search=`)
    if (res.status === 401) { router.push('/admin/login'); return }
    // Use direct product fetch via images endpoint GET
    const r2 = await fetch(`/api/admin/products/${id}/images`)
    if (r2.ok) {
      const data = await r2.json()
      setProduct(data)
      setImages(data.images ?? [])
    }
    setLoading(false)
  }, [id, router])

  useEffect(() => { fetchProduct() }, [fetchProduct])

  async function uploadFiles(files) {
    setError('')
    const fileArr = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!fileArr.length) return

    // Show local previews immediately
    const newPreviews = fileArr.map(f => ({ file: f, url: URL.createObjectURL(f), uploading: true }))
    setPreviews(prev => [...prev, ...newPreviews])

    setUploading(true)
    for (const file of fileArr) {
      const form = new FormData()
      form.append('image', file)
      const res = await fetch(`/api/admin/products/${id}/images`, { method: 'POST', body: form })
      const data = await res.json()
      if (res.ok) {
        setImages(data.images)
      } else {
        setError(data.error ?? 'Upload failed')
      }
    }
    setPreviews([])
    setUploading(false)
  }

  async function deleteImage(url) {
    setDeleting(url)
    const res  = await fetch(`/api/admin/products/${id}/images`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    const data = await res.json()
    if (res.ok) setImages(data.images)
    else setError(data.error ?? 'Delete failed')
    setDeleting(null)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    uploadFiles(e.dataTransfer.files)
  }

  if (loading) {
    return <div style={{ background: '#f9fafb', minHeight: '100vh' }} className="flex items-center justify-center text-gray-400">Loading…</div>
  }

  const productName = product?.name ?? 'Product'
  const productSku  = product?.sku  ?? id

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <header style={{ background: '#0a1628', borderBottom: '1px solid #1a2a44' }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/products" className="text-sm flex items-center gap-1.5 transition-colors" style={{ color: '#8899bb', minHeight: 0 }}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"/></svg>
              All Products
            </Link>
            <span style={{ color: '#445566' }}>·</span>
            <span className="font-mono text-sm" style={{ color: '#c9a227' }}>{productSku}</span>
          </div>
          <Link href="/" className="text-xs" style={{ color: '#8899bb', minHeight: 0 }}>← View site</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-display font-bold text-gray-900 text-xl leading-tight">{productName}</h1>
          <p className="text-gray-400 text-sm mt-0.5">SKU: {productSku} · {images.length} image{images.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload zone */}
          <div>
            <h2 className="font-display font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">Upload Images</h2>

            {/* Drag-drop zone */}
            <div
              onDrop={onDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => inputRef.current?.click()}
              className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all p-10"
              style={{
                borderColor:  dragOver ? '#c9a227' : '#d1d5db',
                background:   dragOver ? 'rgba(201,162,39,0.05)' : '#fff',
                minHeight:    '180px',
              }}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={e => uploadFiles(e.target.files)}
              />
              {uploading ? (
                <div className="text-center">
                  <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: '#c9a227', borderTopColor: 'transparent' }}/>
                  <p className="text-sm text-gray-500">Uploading…</p>
                </div>
              ) : (
                <div className="text-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 mx-auto mb-3 text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                  </svg>
                  <p className="text-sm font-medium text-gray-700">Drop images here or click to browse</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP · max 5MB each · multiple allowed</p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
                <button onClick={() => setError('')} className="float-right text-red-400 hover:text-red-600" style={{ minHeight: 0 }}>✕</button>
              </div>
            )}

            {/* Local previews while uploading */}
            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {previews.map((p, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <img src={p.url} alt="" className="w-full h-full object-contain p-2 opacity-50"/>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#c9a227', borderTopColor: 'transparent' }}/>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 p-4 rounded-xl text-xs space-y-1" style={{ background: '#f0f7ff', color: '#3b5bdb' }}>
              <p className="font-medium">First time setup — Supabase bucket required:</p>
              <p style={{ color: '#555' }}>1. Go to Supabase → Storage → Create bucket</p>
              <p style={{ color: '#555' }}>2. Name it <code className="bg-white px-1 rounded font-mono">product-images</code></p>
              <p style={{ color: '#555' }}>3. Set it to <strong>Public</strong></p>
            </div>
          </div>

          {/* Existing images */}
          <div>
            <h2 className="font-display font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">
              Current Images {images.length > 0 && <span className="text-gray-400 font-normal">({images.length})</span>}
            </h2>

            {images.length === 0 ? (
              <div className="card flex flex-col items-center justify-center py-12 text-center">
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-gray-200 mb-3" fill="currentColor">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p className="text-sm text-gray-400">No images yet</p>
                <p className="text-xs text-gray-300 mt-1">Upload images on the left</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {images.map((url, i) => (
                  <div key={url} className="relative group card overflow-hidden">
                    {i === 0 && (
                      <span className="absolute top-2 left-2 z-10 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#c9a227', color: '#0a1628' }}>
                        Main
                      </span>
                    )}
                    <div className="aspect-square bg-gray-50 p-2">
                      <img src={url} alt={`Product image ${i + 1}`} className="w-full h-full object-contain"/>
                    </div>
                    <div className="p-2 flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-400 truncate">Photo {i + 1}</span>
                      <button
                        onClick={() => deleteImage(url)}
                        disabled={deleting === url}
                        className="flex-shrink-0 text-xs px-2 py-1 rounded-lg transition-colors"
                        style={{ background: '#fee2e2', color: '#991b1b', minHeight: 0 }}
                      >
                        {deleting === url ? '…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {images.length > 0 && (
              <p className="text-xs text-gray-400 mt-3">The first image is used as the main product photo on the website.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
