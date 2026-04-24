import { getProducts, getCategories, searchPartsByVehicle, getVehicleMakes, getVehicleModels } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export const revalidate = 300

export default async function CataloguePage({ searchParams }) {
  const { search, category, make, model } = searchParams

  let products = []
  let title    = 'All Parts'

  if (make) {
    products = await searchPartsByVehicle(make, model || null)
    const makes  = await getVehicleMakes()
    const makeObj = makes.find(m => m.id === make)
    title = `Parts for ${makeObj?.name ?? 'your vehicle'}`
    if (model) {
      const models  = await getVehicleModels(make)
      const modelObj = models.find(m => m.id === model)
      if (modelObj) title += ` — ${modelObj.name}`
    }
  } else {
    products = await getProducts({ search, categoryId: category, limit: 48 })
    if (search)   title = `Search: "${search}"`
    if (category) {
      const cats = await getCategories()
      const cat  = cats.find(c => c.id === category)
      if (cat) title = cat.name
    }
  }

  const categories = await getCategories()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-gray-900 text-2xl">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} part{products.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Search box */}
        <form action="/catalogue" method="GET" className="flex gap-2 w-full sm:w-auto">
          <input
            name="search"
            defaultValue={search ?? ''}
            placeholder="Search parts, SKU..."
            className="input flex-1 sm:w-56 text-sm"
          />
          <button type="submit" className="btn-primary px-4 py-2 min-h-0 rounded-lg text-sm">Search</button>
        </form>
      </div>

      <div className="flex gap-6">
        {/* Sidebar categories */}
        <aside className="hidden md:block w-48 flex-shrink-0">
          <div className="card p-4 sticky top-20">
            <h3 className="font-display font-bold text-gray-900 text-sm mb-3">Categories</h3>
            <div className="flex flex-col gap-1">
              <Link
                href="/catalogue"
                className={`text-sm px-2 py-1.5 rounded-lg transition-colors ${!category && !search && !make ? 'bg-brand-600 text-white font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                All Parts
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/catalogue?category=${cat.id}`}
                  className={`text-sm px-2 py-1.5 rounded-lg transition-colors leading-tight ${category === cat.id ? 'bg-brand-600 text-white font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1 min-w-0">
          {products.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-display font-bold text-gray-900 text-lg mb-2">No parts found</h3>
              <p className="text-gray-500 text-sm mb-4">Try a different search or browse all categories</p>
              <Link href="/catalogue" className="btn-primary inline-block">Browse All Parts</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p.id ?? p.product_id} product={{ ...p, id: p.id ?? p.product_id, price: p.price ?? p.selling_price, stock_qty: p.stock_qty ?? p.quantity }} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
