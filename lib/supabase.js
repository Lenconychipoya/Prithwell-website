import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnon)

// Server-side admin client (bypasses RLS) — never import on the client
export function getAdminClient() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// ── Products ─────────────────────────────────────────────────────

export async function getProducts({ categoryId, search, limit = 24, offset = 0 } = {}) {
  let q = supabase
    .from('online_catalogue')
    .select('*')
    .order('name')
    .range(offset, offset + limit - 1)

  if (categoryId) q = q.eq('category_id', categoryId)
  if (search)     q = q.ilike('name', `%${search}%`)

  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

export async function getProductBySku(sku) {
  const { data, error } = await supabase
    .from('online_catalogue')
    .select('*')
    .eq('sku', sku)
    .single()
  if (error) throw error
  return data
}

export async function getProductFitment(productId) {
  const { data, error } = await supabase
    .from('product_vehicle_compatibility')
    .select(`make_id, model_id, vehicle_makes(name), vehicle_models(name)`)
    .eq('product_id', productId)
  if (error) return []
  return data ?? []
}

// ── Categories ────────────────────────────────────────────────────

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')
  if (error) throw error
  return data ?? []
}

// ── Vehicles ─────────────────────────────────────────────────────

export async function getVehicleMakes() {
  const { data, error } = await supabase
    .from('vehicle_makes')
    .select('id, name')
    .neq('name', 'ALL')
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getVehicleModels(makeId) {
  const { data, error } = await supabase
    .from('vehicle_models')
    .select('id, name')
    .eq('make_id', makeId)
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function searchPartsByVehicle(makeId, modelId) {
  const { data, error } = await supabase
    .rpc('parts_by_vehicle', {
      p_make_id:  makeId,
      p_model_id: modelId
    })
  if (error) throw error
  return data ?? []
}

// ── Orders ───────────────────────────────────────────────────────

export async function createOrder({ customer, items, deliveryCity, deliveryAddress, paymentMethod }) {
  // 1. Upsert customer
  let customerId
  const { data: existing } = await supabase
    .from('online_customers')
    .select('id')
    .eq('phone', customer.phone)
    .maybeSingle()

  if (existing) {
    customerId = existing.id
  } else {
    const { data: newCust, error } = await supabase
      .from('online_customers')
      .insert({ full_name: customer.name, phone: customer.phone, whatsapp: customer.phone, city: deliveryCity })
      .select('id')
      .single()
    if (error) throw error
    customerId = newCust.id
  }

  // 2. Calculate totals
  const subtotal    = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const deliveryFee = ['Harare', 'Chitungwiza'].includes(deliveryCity) ? 3 : 6
  const total       = subtotal + deliveryFee

  // 3. Create order
  const { data: order, error: orderErr } = await supabase
    .from('online_orders')
    .insert({
      customer_id:      customerId,
      subtotal,
      delivery_fee:     deliveryFee,
      total,
      delivery_city:    deliveryCity,
      delivery_address: deliveryAddress,
      payment_method:   paymentMethod,
      status:           'pending'
    })
    .select('id, order_number')
    .single()
  if (orderErr) throw orderErr

  // 4. Order items
  const { error: itemsErr } = await supabase
    .from('online_order_items')
    .insert(items.map(i => ({
      order_id:   order.id,
      product_id: i.id,
      sku:        i.sku,
      name:       i.name,
      quantity:   i.quantity,
      unit_price: i.price
    })))
  if (itemsErr) throw itemsErr

  return { orderId: order.id, orderNumber: order.order_number, total }
}

export async function getOrderByNumber(orderNumber) {
  const { data, error } = await supabase
    .from('online_orders')
    .select(`
      id, order_number, status, subtotal, delivery_fee, total,
      delivery_city, delivery_address, payment_method, paynow_ref, created_at,
      online_customers ( full_name, phone ),
      online_order_items ( quantity, unit_price, subtotal, sku, name )
    `)
    .eq('order_number', orderNumber)
    .single()
  if (error) throw error
  return data
}
