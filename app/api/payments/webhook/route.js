import { verifyWebhook } from '@/lib/paynow'
import { getAdminClient } from '@/lib/supabase'

export async function POST(request) {
  try {
    const body             = await request.text()
    const { valid, params } = verifyWebhook(body)

    if (!valid) {
      console.error('Paynow webhook hash mismatch')
      return new Response('Invalid hash', { status: 400 })
    }

    const isPaid      = params.status === 'Paid' || params.status === 'Awaiting Delivery'
    const isCancelled = params.status === 'Cancelled'
    const orderNumber = params.reference?.trim().toUpperCase()

    if (!orderNumber) return new Response('OK', { status: 200 })

    const admin = getAdminClient()

    if (isPaid) {
      // Mark order paid — this triggers the stock decrement trigger in DB
      await admin
        .from('online_orders')
        .update({ status: 'paid', paynow_ref: params.paynowreference })
        .eq('order_number', orderNumber)

      console.log(`Order ${orderNumber} marked PAID — ref: ${params.paynowreference}`)
    }

    if (isCancelled) {
      await admin
        .from('online_orders')
        .update({ status: 'cancelled' })
        .eq('order_number', orderNumber)
        .eq('status', 'awaiting_payment') // only cancel if not yet processed
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response('Error', { status: 500 })
  }
}
