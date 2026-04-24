import { createOrder } from '@/lib/supabase'

export async function POST(request) {
  try {
    const body   = await request.json()
    const result = await createOrder(body)
    return Response.json(result)
  } catch (err) {
    console.error('Order error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
