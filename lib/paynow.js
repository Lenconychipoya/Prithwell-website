import crypto from 'crypto'

const PAYNOW_URL = 'https://www.paynow.co.zw/interface/initiatetransaction'
const INT_ID     = process.env.PAYNOW_INTEGRATION_ID
const INT_KEY    = process.env.PAYNOW_INTEGRATION_KEY
const RETURN_URL = process.env.PAYNOW_RETURN_URL
const RESULT_URL = process.env.PAYNOW_RESULT_URL

function hash(values, key) {
  const str = values.join('') + key
  return crypto.createHash('sha512').update(str).digest('hex').toUpperCase()
}

function buildForm(fields) {
  return Object.entries(fields)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

function parseResponse(raw) {
  return Object.fromEntries(
    raw.split('&').map(p => {
      const [k, v] = p.split('=')
      return [decodeURIComponent(k), decodeURIComponent(v ?? '')]
    })
  )
}

export async function initiatePayment({ orderId, orderNumber, amount, customerPhone, items, method }) {
  const desc = items.map(i => `${i.name} x${i.quantity}`).join(', ').slice(0, 200)

  const fields = {
    id:             INT_ID,
    reference:      orderNumber,
    amount:         amount.toFixed(2),
    additionalinfo: desc,
    returnurl:      RETURN_URL,
    resulturl:      RESULT_URL,
    status:         'Message',
    email:          'orders@prithwellmotorspares.co.zw',
  }

  if (method === 'ecocash' || method === 'onemoney') {
    fields.authemail = customerPhone
    fields.phone     = customerPhone
  }

  fields.hash = hash(
    [fields.id, fields.reference, fields.amount, fields.additionalinfo,
     fields.returnurl, fields.resulturl, fields.status, fields.email],
    INT_KEY
  )

  const res  = await fetch(PAYNOW_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: buildForm(fields)
  })
  const text   = await res.text()
  const result = parseResponse(text)

  if (result.status?.toLowerCase() !== 'ok') {
    throw new Error(`Paynow error: ${result.error ?? text}`)
  }

  return {
    pollUrl:     result.pollurl,
    redirectUrl: result.browserurl,
    paynowRef:   result.paynowreference
  }
}

export async function pollPayment(pollUrl) {
  const res    = await fetch(pollUrl)
  const text   = await res.text()
  const result = parseResponse(text)

  return {
    paid:      result.status === 'Paid' || result.status === 'Awaiting Delivery',
    status:    result.status,
    paynowRef: result.paynowreference,
    amount:    parseFloat(result.amount ?? '0')
  }
}

export function verifyWebhook(body) {
  const params       = parseResponse(body)
  const receivedHash = params.hash
  const values       = Object.entries(params).filter(([k]) => k !== 'hash').map(([, v]) => v)
  const expected     = hash(values, INT_KEY)
  return { valid: receivedHash === expected, params }
}
