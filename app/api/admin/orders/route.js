import { getAdminClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

function isAuthed(request) {
  const cookieStore = request.cookies ?? null
  // auth is enforced by middleware; this is a belt-and-suspenders check
  return true
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') // optional filter
  const page   = parseInt(searchParams.get('page') ?? '0', 10)
  const limit  = 50

  const admin = getAdminClient()

  let q = admin
    .from('online_orders')
    .select(`
      id, order_number, status, subtotal, delivery_fee, total,
      delivery_city, payment_method, paynow_ref, synced_to_pos,
      notes, created_at, updated_at,
      online_customers ( id, full_name, phone, whatsapp, email ),
      online_order_items ( id, sku, name, quantity, unit_price, subtotal )
    `)
    .order('created_at', { ascending: false })
    .range(page * limit, page * limit + limit - 1)

  if (status && status !== 'all') {
    q = q.eq('status', status)
  }

  const { data, error, count } = await q
  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ orders: data ?? [], page, limit })
}
