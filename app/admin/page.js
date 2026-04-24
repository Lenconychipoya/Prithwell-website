'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const STATUS_TABS = [
  { key: 'all',               label: 'All' },
  { key: 'pending',           label: 'Pending' },
  { key: 'awaiting_payment',  label: 'Awaiting Payment' },
  { key: 'paid',              label: 'Paid' },
  { key: 'processing',        label: 'Processing' },
  { key: 'dispatched',        label: 'Dispatched' },
  { key: 'delivered',         label: 'Delivered' },
  { key: 'cancelled',         label: 'Cancelled' },
]

const STATUS_STYLES = {
  pending:           { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
  awaiting_payment:  { bg: '#dbeafe', color: '#1e40af', label: 'Awaiting Payment' },
  paid:              { bg: '#d1fae5', color: '#065f46', label: 'Paid' },
  processing:        { bg: '#e0e7ff', color: '#3730a3', label: 'Processing' },
  dispatched:        { bg: '#fce7f3', color: '#9d174d', label: 'Dispatched' },
  delivered:         { bg: '#d1fae5', color: '#065f46', label: 'Delivered' },
  cancelled:         { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? { bg: '#f3f4f6', color: '#374151', label: status }
  return (
    <span className="badge" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

function fmtDate(iso) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function fmtUSD(n) {
  return `$${Number(n ?? 0).toFixed(2)}`
}

export default function AdminDashboard() {
  const router = useRouter()
  const [orders,     setOrders]     = useState([])
  const [activeTab,  setActiveTab]  = useState('all')
  const [loading,    setLoading]    = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchOrders = useCallback(async (status) => {
    setLoading(true)
    const qs = status !== 'all' ? `?status=${status}` : ''
    const res = await fetch(`/api/admin/orders${qs}`)
    if (res.status === 401) { router.push('/admin/login'); return }
    const { orders } = await res.json()
    setOrders(orders ?? [])
    setLoading(false)
  }, [router])

  useEffect(() => { fetchOrders(activeTab) }, [activeTab, fetchOrders])

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  async function updateStatus(orderId, newStatus) {
    setUpdatingId(orderId)
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    await fetchOrders(activeTab)
    setUpdatingId(null)
  }

  // Stats derived from current visible orders (full set when tab = all)
  const stats = {
    total:    orders.length,
    pending:  orders.filter(o => o.status === 'pending').length,
    paid:     orders.filter(o => o.status === 'paid').length,
    revenue:  orders.filter(o => o.status === 'paid').reduce((s, o) => s + Number(o.total), 0),
  }

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      {/* Admin header */}
      <header style={{ background: '#0a1628', borderBottom: '1px solid #1a2a44' }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span style={{ color: '#c9a227', fontFamily: 'Arial Black, sans-serif', fontWeight: 900, fontSize: '1rem', letterSpacing: '1px' }}>PRITHWELL</span>
            <span style={{ color: '#445566', fontSize: '0.75rem' }}>|</span>
            <span style={{ color: '#c9a227', fontWeight: 600, fontSize: '0.85rem' }}>Orders</span>
            <span style={{ color: '#445566' }}>·</span>
            <Link href="/admin/products" className="hover:text-white transition-colors text-sm" style={{ color: '#8899bb', minHeight: 0 }}>Products</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs" style={{ color: '#8899bb' }}>← View site</Link>
            <button onClick={logout} className="text-xs px-3 py-1.5 rounded-lg transition-colors" style={{ background: 'rgba(255,255,255,0.07)', color: '#8899bb', minHeight: 0 }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="font-display font-bold text-gray-900 text-2xl mb-6">Orders Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Orders',   value: stats.total,           sub: 'shown below' },
            { label: 'Pending',        value: stats.pending,         sub: 'need action', color: '#92400e', bg: '#fef3c7' },
            { label: 'Paid',           value: stats.paid,            sub: 'confirmed',   color: '#065f46', bg: '#d1fae5' },
            { label: 'Revenue (paid)', value: fmtUSD(stats.revenue), sub: 'from paid orders' },
          ].map(s => (
            <div key={s.label} className="card p-4">
              <div className="text-xs text-gray-500 mb-1">{s.label}</div>
              <div
                className="font-display font-bold text-2xl"
                style={{ color: s.color ?? '#0a1628' }}
              >
                {s.value}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-4">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-shrink-0 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
              style={{
                minHeight: 0,
                background: activeTab === tab.key ? '#0a1628' : '#fff',
                color:      activeTab === tab.key ? '#c9a227' : '#6b7280',
                border:     '1px solid ' + (activeTab === tab.key ? '#0a1628' : '#e5e7eb'),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading orders…</div>
          ) : orders.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    {['Order', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', 'Action'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <tr
                      key={order.id}
                      style={{ borderBottom: i < orders.length - 1 ? '1px solid #f3f4f6' : 'none' }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-mono font-bold text-xs hover:underline"
                          style={{ color: '#2563eb', minHeight: 0 }}
                        >
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 text-xs">{order.online_customers?.full_name}</div>
                        <div className="text-gray-400 text-xs">{order.online_customers?.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {fmtDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 text-center">
                        {order.online_order_items?.length ?? 0}
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-gray-900 whitespace-nowrap">
                        {fmtUSD(order.total)}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 capitalize whitespace-nowrap">
                        {order.payment_method ?? '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={e => updateStatus(order.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1"
                            style={{ minHeight: 0, color: '#374151' }}
                          >
                            {Object.entries(STATUS_STYLES).map(([k, v]) => (
                              <option key={k} value={k}>{v.label}</option>
                            ))}
                          </select>
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors whitespace-nowrap"
                            style={{ minHeight: 0 }}
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
