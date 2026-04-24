import { getAdminClient } from '@/lib/supabase'

const BUCKET = 'product-images'

export async function GET(request, { params }) {
  const { id } = await params
  const admin  = getAdminClient()
  const { data, error } = await admin
    .from('products')
    .select('id, name, sku, brand, images, selling_price, online_price, quantity, is_active')
    .eq('id', id)
    .single()
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request, { params }) {
  const { id } = await params
  const admin  = getAdminClient()

  // Parse multipart form
  const formData = await request.formData()
  const file     = formData.get('image')

  if (!file || typeof file === 'string') {
    return Response.json({ error: 'No image file provided' }, { status: 400 })
  }

  const ext      = file.name.split('.').pop().toLowerCase()
  const allowed  = ['jpg', 'jpeg', 'png', 'webp', 'gif']
  if (!allowed.includes(ext)) {
    return Response.json({ error: 'File type not allowed. Use JPG, PNG, or WebP.' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return Response.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
  }

  const filename  = `${id}/${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi, '_')}`
  const buffer    = Buffer.from(await file.arrayBuffer())

  // Upload to Supabase Storage
  const { error: uploadErr } = await admin.storage
    .from(BUCKET)
    .upload(filename, buffer, { contentType: file.type, upsert: false })

  if (uploadErr) {
    return Response.json({ error: uploadErr.message }, { status: 500 })
  }

  // Get public URL
  const { data: { publicUrl } } = admin.storage
    .from(BUCKET)
    .getPublicUrl(filename)

  // Fetch current images array and append
  const { data: product, error: fetchErr } = await admin
    .from('products')
    .select('images')
    .eq('id', id)
    .single()

  if (fetchErr) return Response.json({ error: fetchErr.message }, { status: 500 })

  const existing = Array.isArray(product.images) ? product.images : []
  const updated  = [...existing, publicUrl]

  const { error: updateErr } = await admin
    .from('products')
    .update({ images: updated })
    .eq('id', id)

  if (updateErr) return Response.json({ error: updateErr.message }, { status: 500 })

  return Response.json({ url: publicUrl, images: updated })
}

export async function DELETE(request, { params }) {
  const { id }  = await params
  const { url } = await request.json()
  const admin   = getAdminClient()

  // Extract storage path from URL
  const marker  = `${BUCKET}/`
  const pathIdx = url.indexOf(marker)
  if (pathIdx === -1) {
    return Response.json({ error: 'Invalid image URL' }, { status: 400 })
  }
  const storagePath = url.slice(pathIdx + marker.length)

  // Remove from storage
  await admin.storage.from(BUCKET).remove([storagePath])

  // Remove from product images array
  const { data: product, error: fetchErr } = await admin
    .from('products')
    .select('images')
    .eq('id', id)
    .single()

  if (fetchErr) return Response.json({ error: fetchErr.message }, { status: 500 })

  const updated = (product.images ?? []).filter(img => img !== url)

  const { error: updateErr } = await admin
    .from('products')
    .update({ images: updated })
    .eq('id', id)

  if (updateErr) return Response.json({ error: updateErr.message }, { status: 500 })

  return Response.json({ images: updated })
}
