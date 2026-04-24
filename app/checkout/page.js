'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const CITIES = ['Harare', 'Chitungwiza', 'Bulawayo', 'Mutare', 'Gweru', 'Kwekwe', 'Masvingo', 'Other']

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart]       = useState([])
  const [step, setStep]       = useState(1) // 1=details, 2=payment, 3=processing
  const [form, setForm]       = useState({ name: '', phone: '', city: 'Harare', address: '' })
  const [payMethod, setPay]   = useState('ecocash')
  const [error, setError]     = useState('')

  useEffect(() => {
    try {
      const c = JSON.parse(sessionStorage.getItem('cart') ?? '[]')
      if (c.length === 0) router.replace('/cart')
      setCart(c)
    } catch { router.replace('/cart') }
  }, [])

  const subtotal    = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const deliveryFee = ['Harare', 'Chitungwiza'].includes(form.city) ? 3 : 6
  const total       = subtotal + deliveryFee

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.city) { setError('Please fill in all required fields'); return }
    if (form.phone.length < 9) { setError('Please enter a valid phone number'); return }
    setError('')
    setStep(3)

    try {
      // Create order in database
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: form, items: cart, deliveryCity: form.city, deliveryAddress: form.address, paymentMethod: payMethod })
      })
      const { orderId, orderNumber, error: orderError } = await orderRes.json()
      if (orderError) throw new Error(orderError)

      if (payMethod === 'cod') {
        // Cash on delivery — go straight to confirmation
        sessionStorage.removeItem('cart')
        window.dispatchEvent(new Event('cartUpdated'))
        router.push(`/order/complete?order=${orderNumber}&method=cod`)
        return
      }

      // Initiate Paynow payment
      const payRes = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, orderNumber, amount: total, customerPhone: form.phone, items: cart, method: payMethod })
      })
      const { redirectUrl, paynowRef, error: payError } = await payRes.json()
      if (payError) throw new Error(payError)

      // Save order number for return page
      sessionStorage.setItem('pendingOrder', orderNumber)
      sessionStorage.removeItem('cart')
      window.dispatchEvent(new Event('cartUpdated'))

      // Redirect to Paynow (card) or show EcoCash instructions
      if (payMethod === 'card' && redirectUrl) {
        window.location.href = redirectUrl
      } else {
        // EcoCash / OneMoney — USSD push sent, go to waiting page
        router.push(`/order/complete?order=${orderNumber}&method=${payMethod}`)
      }
    } catch (err) {
      setStep(2)
      setError(err.message || 'Something went wrong. Please try again or contact us on WhatsApp.')
    }
  }

  if (cart.length === 0) return <div className="p-8 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-2xl text-gray-900 mb-6">Checkout</h1>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {['Your Details', 'Payment', step === 3 ? 'Processing…' : 'Confirm'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step > i + 1 ? 'bg-brand-600 text-white' : step === i + 1 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-sm ${step === i + 1 ? 'text-gray-900 font-medium' : 'text-gray-400'} hidden sm:block`}>{s}</span>
            {i < 2 && <div className="w-8 h-px bg-gray-200 mx-1"/>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">

          {/* Step 1 — Details */}
          {step === 1 && (
            <div className="card p-6 space-y-4">
              <h2 className="font-display font-bold text-gray-900">Delivery Details</h2>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                <input className="input" placeholder="Tendai Moyo" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Phone / WhatsApp *</label>
                <input className="input" placeholder="077 123 4567" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                <p className="text-xs text-gray-400 mt-1">We'll send your order confirmation here</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">City *</label>
                <select className="input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Delivery Address</label>
                <input className="input" placeholder="Street address, suburb" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}
              <button onClick={() => { if (!form.name || !form.phone) { setError('Name and phone are required'); return } setError(''); setStep(2) }} className="btn-primary w-full">
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2 — Payment */}
          {step === 2 && (
            <div className="card p-6 space-y-5">
              <h2 className="font-display font-bold text-gray-900">Choose Payment Method</h2>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'ecocash',  label: 'EcoCash',  sub: 'Instant USSD push', icon: '📱' },
                  { id: 'onemoney', label: 'OneMoney', sub: 'NetOne USSD push',   icon: '📲' },
                  { id: 'card',     label: 'Card',      sub: 'Visa / Mastercard', icon: '💳' },
                  { id: 'cod',      label: 'Cash on Delivery', sub: 'Harare only', icon: '💵' },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPay(m.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${payMethod === m.id ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="text-2xl mb-1">{m.icon}</div>
                    <div className="font-medium text-gray-900 text-sm">{m.label}</div>
                    <div className="text-gray-500 text-xs">{m.sub}</div>
                  </button>
                ))}
              </div>

              {(payMethod === 'ecocash' || payMethod === 'onemoney') && (
                <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 text-sm text-brand-800">
                  <strong>How it works:</strong> After clicking Pay, you'll receive a USSD prompt on <strong>{form.phone}</strong>. Enter your PIN to confirm payment.
                </div>
              )}

              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                <button onClick={handleSubmit} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  Pay ${total.toFixed(2)}
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Processing */}
          {step === 3 && (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"/>
              <h2 className="font-display font-bold text-gray-900 text-xl mb-2">Processing your order…</h2>
              <p className="text-gray-500 text-sm">Please wait while we connect to Paynow. Do not close this page.</p>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="card p-5 h-fit">
          <h2 className="font-display font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {cart.map(i => (
              <div key={i.id} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate flex-1 mr-2">{i.name} ×{i.quantity}</span>
                <span className="text-gray-900 font-medium flex-shrink-0">${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Delivery to {form.city}</span><span>${deliveryFee.toFixed(2)}</span></div>
            <div className="flex justify-between font-display font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
