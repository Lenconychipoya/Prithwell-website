import { getAdminClient } from '@/lib/supabase'

export async function PATCH(request, { params }) {
  const { id } = await params
  const { status, notes } = await request.json()

  const admin = getAdminClient()

  const updates = { updated_at: new Date().toISOString() }
  if (status) updates.status = status
  if (notes !== undefined) updates.notes = notes

  const { data, error } = await admin
    .from('online_orders')
    .update(updates)
    .eq('id', id)
    .select('id, order_number, status, notes, updated_at')
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function GET(request, { params }) {
  const { id } = await params
  const admin = getAdminClient()

  const { data, error } = await admin
    .from('online_orders')
    .select(`
      id, order_number, status, subtotal, delivery_fee, total,
      delivery_city, delivery_address, payment_method, paynow_ref,
      synced_to_pos, notes, created_at, updated_at,
      online_customers ( id, full_name, phone, whatsapp, email, address ),
      online_order_items ( id, sku, name, quantity, unit_price, subtotal )
    `)
    .eq('id', id)
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
