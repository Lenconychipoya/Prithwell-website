import { getAdminClient } from '@/lib/supabase'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const search   = searchParams.get('search') ?? ''
  const page     = parseInt(searchParams.get('page') ?? '0', 10)
  const limit    = 50

  const admin = getAdminClient()

  let q = admin
    .from('products')
    .select('id, name, sku, brand, selling_price, online_price, quantity, images, is_active, category_id, categories(name)')
    .order('name')
    .range(page * limit, page * limit + limit - 1)

  if (search) {
    q = q.or(`name.ilike.%${search}%,sku.ilike.%${search}%`)
  }

  const { data, error } = await q
  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ products: data ?? [], page, limit })
}
