'use client'
import { useState } from 'react'

export default function AddToCartButton({ product }) {
  const [qty, setQty]         = useState(1)
  const [added, setAdded]     = useState(false)

  const add = () => {
    try {
      const cart = JSON.parse(sessionStorage.getItem('cart') ?? '[]')
      const idx  = cart.findIndex(i => i.id === product.id)
      if (idx >= 0) cart[idx].quantity += qty
      else cart.push({ id: product.id, sku: product.sku, name: product.name, price: product.price, quantity: qty })
      sessionStorage.setItem('cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('cartUpdated'))
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch {}
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600 font-medium">Qty:</label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100 min-h-0 text-lg">−</button>
          <span className="px-4 py-2 text-gray-900 font-medium min-w-[3rem] text-center">{qty}</span>
          <button onClick={() => setQty(q => Math.min(product.stock_qty, q + 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100 min-h-0 text-lg">+</button>
        </div>
      </div>
      <button
        onClick={add}
        className={`btn-primary w-full flex items-center justify-center gap-2 transition-all ${added ? 'bg-green-500' : ''}`}
      >
        {added ? (
          <><svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Added to Cart!</>
        ) : (
          <><svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> Add to Cart — ${(product.price * qty).toFixed(2)}</>
        )}
      </button>
    </div>
  )
}
