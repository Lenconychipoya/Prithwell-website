'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

const STATUS_FLOW = ['pending', 'awaiting_payment', 'paid', 'processing', 'dispatched', 'delivered']

const STATUS_STYLES = {
  pending:           { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
  awaiting_payment:  { bg: '#dbeafe', color: '#1e40af', label: 'Awaiting Payment' },
  paid:              { bg: '#d1fae5', color: '#065f46', label: 'Paid' },
  processing:        { bg: '#e0e7ff', color: '#3730a3', label: 'Processing' },
  dispatched:        { bg: '#fce7f3', color: '#9d174d', label: 'Dispatched' },
  delivered:         { bg: '#d1fae5', color: '#065f46', label: 'Delivered' },
  cancelled:         { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
}

function fmtDate(iso) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
function fmtUSD(n) { return `$${Number(n ?? 0).toFixed(2)}` }

export default function OrderDetailPage() {
  const { id }  = useParams()
  const router  = useRouter()
  const [order,       setOrder]       = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [newStatus,   setNewStatus]   = useState('')
  const [notes,       setNotes]       = useState('')
  const [saving,      setSaving]      = useState(false)
  const [saved,       setSaved]       = useState(false)

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then(r => { if (r.status === 401) { router.push('/admin/login'); return null } return r.json() })
      .then(data => {
        if (!data) return
        setOrder(data)
        setNewStatus(data.status)
        setNotes(data.notes ?? '')
        setLoading(false)
      })
  }, [id, router])

  async function save() {
    setSaving(true)
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, notes }),
    })
    const updated = await res.json()
    setOrder(prev => ({ ...prev, ...updated }))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div style={{ background: '#f9fafb', minHeight: '100vh' }} className="flex items-center justify-center text-gray-400">
        Loading…
      </div>
    )
  }

  if (!order) return null

  const customer = order.online_customers ?? {}
  const items    = order.online_order_items ?? []
  const s        = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
  const currentStep = STATUS_FLOW.indexOf(order.status)

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: '#0a1628', borderBottom: '1px solid #1a2a44' }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm flex items-center gap-1.5 transition-colors" style={{ color: '#8899bb', minHeight: 0 }}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"/></svg>
              All Orders
            </Link>
            <span style={{ color: '#445566' }}>·</span>
            <span className="font-mono text-sm font-bold" style={{ color: '#c9a227' }}>{order.order_number}</span>
          </div>
          <span className="badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-6">

        {/* Left column — order info */}
        <div className="md:col-span-2 space-y-6">

          {/* Status timeline */}
          {order.status !== 'cancelled' && (
            <div className="card p-5">
              <h2 className="font-display font-bold text-gray-900 text-sm mb-4 uppercase tracking-wide">Order Progress</h2>
              <div className="flex items-center gap-0">
                {STATUS_FLOW.map((step, i) => {
                  const done    = i <= currentStep
                  const current = i === currentStep
                  return (
                    <div key={step} className="flex items-center flex-1 min-w-0">
                      <div className="flex flex-col items-center">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{
                            background: done ? '#c9a227' : '#e5e7eb',
                            color: done ? '#0a1628' : '#9ca3af',
                            border: current ? '2px solid #0a1628' : 'none',
                          }}
                        >
                          {done ? (current ? '●' : '✓') : '○'}
                        </div>
                        <span className="text-xs mt-1 text-center" style={{ color: done ? '#0a1628' : '#9ca3af', fontSize: '0.6rem', lineHeight: 1.2 }}>
                          {STATUS_STYLES[step]?.label ?? step}
                        </span>
                      </div>
                      {i < STATUS_FLOW.length - 1 && (
                        <div className="flex-1 h-0.5 mx-1 mb-4" style={{ background: i < currentStep ? '#c9a227' : '#e5e7eb' }}/>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-display font-bold text-gray-900 text-sm uppercase tracking-wide">
                Order Items ({items.length})
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Part</th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-gray-500">SKU</th>
                  <th className="text-right px-3 py-3 text-xs font-medium text-gray-500">Qty</th>
                  <th className="text-right px-3 py-3 text-xs font-medium text-gray-500">Unit</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id} style={{ borderBottom: i < items.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                    <td className="px-5 py-3 font-medium text-gray-900 text-xs">{item.name}</td>
                    <td className="px-3 py-3 font-mono text-xs text-gray-400">{item.sku}</td>
                    <td className="px-3 py-3 text-xs text-gray-600 text-right">{item.quantity}</td>
                    <td className="px-3 py-3 text-xs text-gray-600 text-right">{fmtUSD(item.unit_price)}</td>
                    <td className="px-5 py-3 text-xs font-bold text-gray-900 text-right">{fmtUSD(item.subtotal ?? item.unit_price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot style={{ borderTop: '2px solid #f3f4f6' }}>
                <tr>
                  <td colSpan="4" className="px-5 py-3 text-xs text-gray-500 text-right">Subtotal</td>
                  <td className="px-5 py-3 text-xs font-bold text-gray-900 text-right">{fmtUSD(order.subtotal)}</td>
                </tr>
                <tr>
                  <td colSpan="4" className="px-5 py-1 text-xs text-gray-500 text-right">Delivery ({order.delivery_city})</td>
                  <td className="px-5 py-1 text-xs font-bold text-gray-900 text-right">{fmtUSD(order.delivery_fee)}</td>
                </tr>
                <tr style={{ background: '#f9fafb' }}>
                  <td colSpan="4" className="px-5 py-3 text-sm font-bold text-gray-900 text-right">Total</td>
                  <td className="px-5 py-3 text-sm font-bold text-right" style={{ color: '#c9a227' }}>{fmtUSD(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Notes */}
          <div className="card p-5">
            <h2 className="font-display font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">Internal Notes</h2>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="input resize-none"
              placeholder="Add notes about this order…"
            />
          </div>
        </div>

        {/* Right column — customer + actions */}
        <div className="space-y-5">

          {/* Update status */}
          <div className="card p-5">
            <h2 className="font-display font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">Update Status</h2>
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              className="input mb-3"
            >
              {Object.entries(STATUS_STYLES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <button
              onClick={save}
              disabled={saving}
              className="btn-primary w-full text-center"
            >
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
            </button>
          </div>

          {/* Customer */}
          <div className="card p-5">
            <h2 className="font-display font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">Customer</h2>
            <div className="space-y-2 text-sm">
              <div className="font-bold text-gray-900">{customer.full_name}</div>
              <div className="text-gray-500">{customer.phone}</div>
              {customer.email && <div className="text-gray-500">{customer.email}</div>}
              <a
                href={`https://wa.me/${(customer.whatsapp ?? customer.phone)?.replace(/\D/g,'')}?text=Hi ${customer.full_name?.split(' ')[0]}, your order ${order.order_number} is being processed.`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg mt-2"
                style={{ background: '#25D366', color: '#fff', minHeight: 0 }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                WhatsApp Customer
              </a>
            </div>
          </div>

          {/* Delivery */}
          <div className="card p-5">
            <h2 className="font-display font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">Delivery</h2>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400 text-xs">City</span><br/><span className="font-medium text-gray-900">{order.delivery_city}</span></div>
              {order.delivery_address && (
                <div><span className="text-gray-400 text-xs">Address</span><br/><span className="font-medium text-gray-900">{order.delivery_address}</span></div>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="card p-5">
            <h2 className="font-display font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">Payment</h2>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400 text-xs">Method</span><br/><span className="font-medium text-gray-900 capitalize">{order.payment_method ?? '—'}</span></div>
              {order.paynow_ref && (
                <div><span className="text-gray-400 text-xs">Paynow Ref</span><br/><span className="font-mono text-xs text-gray-700">{order.paynow_ref}</span></div>
              )}
              <div><span className="text-gray-400 text-xs">Ordered</span><br/><span className="text-gray-700 text-xs">{fmtDate(order.created_at)}</span></div>
              <div><span className="text-gray-400 text-xs">Updated</span><br/><span className="text-gray-700 text-xs">{fmtDate(order.updated_at)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
