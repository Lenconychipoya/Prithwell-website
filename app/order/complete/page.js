'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

function CompleteContent() {
  const params      = useSearchParams()
  const orderNumber = params.get('order')
  const method      = params.get('method')

  const isCod      = method === 'cod'
  const isEcoCash  = method === 'ecocash'
  const isOneMoney = method === 'onemoney'
  const isMobile   = isEcoCash || isOneMoney

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl ${isCod ? 'bg-amber-100' : 'bg-brand-100'}`}>
        {isCod ? '💵' : isMobile ? '📱' : '💳'}
      </div>

      <h1 className="font-display font-bold text-2xl text-gray-900 mb-2">
        {isCod ? 'Order Placed!' : isMobile ? 'Check Your Phone!' : 'Redirecting to Payment…'}
      </h1>

      <div className="text-brand-600 font-display font-bold text-lg mb-4">
        Order #{orderNumber}
      </div>

      {isMobile && (
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5 mb-6 text-left">
          <h3 className="font-display font-bold text-brand-800 mb-3">Complete your EcoCash payment:</h3>
          <ol className="text-sm text-brand-700 space-y-2">
            <li className="flex gap-2"><span className="font-bold text-brand-600">1.</span> A USSD prompt has been sent to your phone</li>
            <li className="flex gap-2"><span className="font-bold text-brand-600">2.</span> Open the prompt and enter your EcoCash PIN</li>
            <li className="flex gap-2"><span className="font-bold text-brand-600">3.</span> Confirm the payment of the order amount</li>
            <li className="flex gap-2"><span className="font-bold text-brand-600">4.</span> You'll receive an SMS confirmation</li>
          </ol>
          <p className="text-xs text-brand-600 mt-3 font-medium">⚠️ If you did not receive a prompt, please WhatsApp us to complete payment.</p>
        </div>
      )}

      {isCod && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 text-left">
          <h3 className="font-display font-bold text-amber-800 mb-2">Cash on Delivery</h3>
          <p className="text-sm text-amber-700">Have the exact amount ready when your parts arrive. Our delivery agent will contact you before delivery.</p>
        </div>
      )}

      <div className="card p-5 mb-6 text-left">
        <h3 className="font-display font-bold text-gray-900 mb-3">What happens next?</h3>
        <div className="space-y-3">
          {[
            { icon: '✅', text: 'We confirm your payment and process your order' },
            { icon: '📦', text: 'Parts are packed and dispatched' },
            { icon: '🚚', text: 'Delivery to your address (1–4 days depending on city)' },
            { icon: '💬', text: 'You\'ll be updated via WhatsApp at each step' },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="text-lg flex-shrink-0">{s.icon}</span>
              {s.text}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link href={`/track?order=${orderNumber}`} className="btn-primary">
          Track My Order
        </Link>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2637XXXXXXXXX'}?text=Hi, I just placed order ${orderNumber}. Please confirm you received it.`}
          target="_blank" rel="noopener noreferrer"
          className="btn-outline flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-green-600"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          Confirm on WhatsApp
        </a>
        <Link href="/catalogue" className="text-sm text-gray-500 hover:text-gray-700 py-2">Continue Shopping</Link>
      </div>
    </div>
  )
}

export default function OrderCompletePage() {
  return <Suspense fallback={<div className="p-16 text-center text-gray-400">Loading…</div>}><CompleteContent /></Suspense>
}
