import { getOrderByNumber } from '@/lib/supabase'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const orderNumber = searchParams.get('order')
  if (!orderNumber) return Response.json({ error: 'Order number required' }, { status: 400 })
  try {
    const order = await getOrderByNumber(orderNumber.trim().toUpperCase())
    return Response.json(order)
  } catch (err) {
    return Response.json({ error: 'Order not found' }, { status: 404 })
  }
}
