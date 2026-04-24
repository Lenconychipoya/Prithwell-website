'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState([])

  useEffect(() => {
    try { setCart(JSON.parse(sessionStorage.getItem('cart') ?? '[]')) } catch {}
  }, [])

  const save = (updated) => {
    setCart(updated)
    sessionStorage.setItem('cart', JSON.stringify(updated))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const updateQty = (id, qty) => {
    if (qty < 1) return remove(id)
    save(cart.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  const remove = (id) => save(cart.filter(i => i.id !== id))

  const subtotal    = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const deliveryFee = 3
  const total       = subtotal + deliveryFee

  if (cart.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-7xl mb-6">🛒</div>
      <h1 className="font-display font-bold text-2xl text-gray-900 mb-3">Your cart is empty</h1>
      <p className="text-gray-500 mb-8">Find the parts you need and add them to your cart.</p>
      <Link href="/catalogue" className="btn-primary inline-block">Browse Parts</Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-2xl text-gray-900 mb-6">Your Cart ({cart.length} item{cart.length !== 1 ? 's' : ''})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map(item => (
            <div key={item.id} className="card p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 40 40" className="w-8 h-8 text-gray-300" fill="currentColor">
                  <rect x="5" y="15" width="30" height="4" rx="2"/>
                  <rect x="8" y="10" width="24" height="6" rx="2"/>
                  <circle cx="13" cy="28" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="27" cy="28" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm truncate">{item.name}</div>
                <div className="text-gray-400 text-xs">{item.sku}</div>
                <div className="font-display font-bold text-brand-700 mt-1">${item.price.toFixed(2)} each</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 min-h-0 text-base">−</button>
                  <span className="px-3 py-1.5 text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 min-h-0 text-base">+</button>
                </div>
                <button onClick={() => remove(item.id)} className="text-red-400 hover:text-red-600 p-1 min-h-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
              <div className="font-display font-bold text-gray-900 w-20 text-right flex-shrink-0">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit">
          <h2 className="font-display font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery (est.)</span>
              <span>${deliveryFee.toFixed(2)}+</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-display font-bold text-gray-900 text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}+</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Final delivery fee calculated at checkout</p>

          <button
            onClick={() => router.push('/checkout')}
            className="btn-primary w-full mt-5 flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          <Link href="/catalogue" className="block text-center text-sm text-brand-600 hover:text-brand-700 mt-3">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
