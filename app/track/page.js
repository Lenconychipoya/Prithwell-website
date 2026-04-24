'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const STATUS_STEPS = [
  { key: 'pending',           label: 'Order Placed',    icon: '📋' },
  { key: 'awaiting_payment',  label: 'Awaiting Payment',icon: '💳' },
  { key: 'paid',              label: 'Payment Received', icon: '✅' },
  { key: 'processing',        label: 'Being Packed',     icon: '📦' },
  { key: 'dispatched',        label: 'On the Way',       icon: '🚚' },
  { key: 'delivered',         label: 'Delivered',        icon: '🎉' },
]

const STATUS_INDEX = Object.fromEntries(STATUS_STEPS.map((s, i) => [s.key, i]))

function TrackContent() {
  const params = useSearchParams()
  const [orderNum, setOrderNum] = useState(params.get('order') ?? '')
  const [order, setOrder]       = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    if (params.get('order')) search(params.get('order'))
  }, [])

  const search = async (num) => {
    const n = (num ?? orderNum).trim()
    if (!n) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const res  = await fetch(`/api/orders/track?order=${encodeURIComponent(n)}`)
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Order not found')
      setOrder(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const currentStep = order ? (STATUS_INDEX[order.status] ?? 0) : -1
  const subtotal    = order?.online_order_items?.reduce((s, i) => s + parseFloat(i.subtotal), 0) ?? 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-2xl text-gray-900 mb-2">Track Your Order</h1>
      <p className="text-gray-500 text-sm mb-6">Enter your order number to see the latest status.</p>

      {/* Search */}
      <div className="flex gap-3 mb-8">
        <input
          className="input flex-1"
          placeholder="e.g. ORD-AB12CD34"
          value={orderNum}
          onChange={e => setOrderNum(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
        />
        <button onClick={() => search()} disabled={loading} className="btn-primary px-6">
          {loading ? '…' : 'Track'}
        </button>
      </div>

      {error && (
        <div className="card p-5 text-center mb-6">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-display font-bold text-gray-900 mb-1">Order not found</h3>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2637XXXXXXXXX'}?text=Hi, I can't find my order ${orderNum}. Can you help?`}
            target="_blank" rel="noopener noreferrer"
            className="text-brand-600 text-sm font-medium hover:underline"
          >
            Contact us on WhatsApp
          </a>
        </div>
      )}

      {order && (
        <div className="space-y-5">
          {/* Status progress */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display font-bold text-gray-900">Order #{order.order_number}</h2>
              <span className={`badge ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-brand-100 text-brand-700'}`}>
                {STATUS_STEPS[currentStep]?.label ?? order.status}
              </span>
            </div>
            <p className="text-gray-400 text-xs mb-6">Placed {new Date(order.created_at).toLocaleDateString('en-ZW', { dateStyle: 'medium' })}</p>

            {/* Progress bar */}
            <div className="relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0"/>
              <div
                className="absolute top-4 left-0 h-0.5 bg-brand-600 z-0 transition-all duration-500"
                style={{ width: `${Math.max(0, (currentStep / (STATUS_STEPS.length - 1)) * 100)}%` }}
              />
              <div className="relative z-10 flex justify-between">
                {STATUS_STEPS.map((s, i) => (
                  <div key={s.key} className="flex flex-col items-center gap-1.5" style={{ width: `${100 / STATUS_STEPS.length}%` }}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${i <= currentStep ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                      {i <= currentStep ? s.icon : <div className="w-2 h-2 bg-gray-300 rounded-full"/>}
                    </div>
                    <span className="text-xs text-center text-gray-500 leading-tight hidden sm:block" style={{ maxWidth: 60 }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order items */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-gray-900 mb-4">Items Ordered</h3>
            <div className="divide-y divide-gray-100">
              {order.online_order_items?.map((item, i) => (
                <div key={i} className="py-3 flex justify-between items-start text-sm">
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-gray-400 text-xs">{item.sku} · Qty: {item.quantity}</div>
                  </div>
                  <div className="font-medium text-gray-900">${parseFloat(item.subtotal).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-gray-100 space-y-1 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Delivery</span><span>${parseFloat(order.delivery_fee).toFixed(2)}</span></div>
              <div className="flex justify-between font-display font-bold text-gray-900"><span>Total</span><span>${parseFloat(order.total).toFixed(2)}</span></div>
            </div>
          </div>

          {/* Delivery info */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-gray-900 mb-3">Delivery Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div><span className="font-medium text-gray-900">Name:</span> {order.online_customers?.full_name}</div>
              <div><span className="font-medium text-gray-900">City:</span> {order.delivery_city}</div>
              {order.delivery_address && <div><span className="font-medium text-gray-900">Address:</span> {order.delivery_address}</div>}
              <div><span className="font-medium text-gray-900">Payment:</span> {order.payment_method}</div>
            </div>
          </div>

          {/* WhatsApp support */}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2637XXXXXXXXX'}?text=Hi, I have a question about order ${order.order_number}`}
            target="_blank" rel="noopener noreferrer"
            className="btn-outline w-full flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-green-600"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Questions? Chat on WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}

export default function TrackPage() {
  return <Suspense fallback={<div className="p-16 text-center text-gray-400">Loading…</div>}><TrackContent /></Suspense>
}
