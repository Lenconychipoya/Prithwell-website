import { initiatePayment } from '@/lib/paynow'
import { getAdminClient } from '@/lib/supabase'

export async function POST(request) {
  try {
    const body   = await request.json()
    const result = await initiatePayment(body)

    // Save poll URL for webhook use
    const admin = getAdminClient()
    await admin.from('online_orders').update({
      paynow_poll_url: result.pollUrl,
      paynow_ref:      result.paynowRef,
      status:          'awaiting_payment'
    }).eq('id', body.orderId)

    return Response.json(result)
  } catch (err) {
    console.error('Paynow initiate error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
