import { getProductBySku, getProductFitment } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/AddToCartButton'
import Link from 'next/link'

export async function generateMetadata({ params }) {
  try {
    const p = await getProductBySku(params.sku)
    return { title: `${p.name} — Prithwell Motor Spares`, description: p.description ?? `Buy ${p.name} (${p.sku}) from Prithwell Motor Spares Zimbabwe` }
  } catch { return { title: 'Product — Prithwell Motor Spares' } }
}

export default async function ProductPage({ params }) {
  let product, fitment
  try {
    product = await getProductBySku(params.sku)
    fitment = await getProductFitment(product.id)
  } catch { notFound() }

  const stockColor = product.stock_qty > 5 ? 'text-green-600' : product.stock_qty > 0 ? 'text-amber-600' : 'text-red-500'
  const stockText  = product.stock_qty > 5 ? `In Stock (${product.stock_qty} units)` : product.stock_qty > 0 ? `Low Stock — Only ${product.stock_qty} left` : 'Out of Stock'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link href="/catalogue" className="hover:text-brand-600">Catalogue</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="card overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-center text-gray-300">
                <svg viewBox="0 0 80 80" className="w-20 h-20 mx-auto mb-2" fill="currentColor">
                  <rect x="10" y="30" width="60" height="8" rx="4"/>
                  <rect x="15" y="20" width="50" height="12" rx="4"/>
                  <circle cx="25" cy="55" r="8" fill="none" stroke="currentColor" strokeWidth="4"/>
                  <circle cx="55" cy="55" r="8" fill="none" stroke="currentColor" strokeWidth="4"/>
                </svg>
                <div className="text-sm">No image</div>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="mb-1">
            {product.category_name && (
              <span className="badge bg-brand-100 text-brand-700 mb-2">{product.category_name}</span>
            )}
          </div>
          <h1 className="font-display font-bold text-gray-900 text-2xl leading-tight mb-1">{product.name}</h1>
          <div className="text-gray-400 text-sm mb-4">SKU: {product.sku} {product.barcode && `· Barcode: ${product.barcode}`}</div>

          <div className="font-display font-bold text-brand-700 text-4xl mb-1">${product.price?.toFixed(2)}</div>
          <div className={`text-sm font-medium mb-6 ${stockColor}`}>{stockText}</div>

          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Add to cart */}
          {product.stock_qty > 0 ? (
            <AddToCartButton product={product} />
          ) : (
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2637XXXXXXXXX'}?text=Hi, I'm interested in ${product.name} (${product.sku}). Is this part available?`}
              target="_blank" rel="noopener noreferrer"
              className="btn-outline flex items-center justify-center gap-2 w-full"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-green-600"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Ask about availability
            </a>
          )}

          {/* Vehicle fitment */}
          {fitment.length > 0 && (
            <div className="mt-6 p-4 bg-brand-50 rounded-xl">
              <h3 className="font-medium text-brand-800 text-sm mb-2">Fits these vehicles:</h3>
              <div className="flex flex-wrap gap-1.5">
                {fitment.slice(0, 8).map((f, i) => (
                  <span key={i} className="badge bg-white border border-brand-200 text-brand-700">
                    {f.vehicle_makes?.name} {f.vehicle_models?.name}
                  </span>
                ))}
                {fitment.length > 8 && (
                  <span className="badge bg-white border border-brand-200 text-gray-500">+{fitment.length - 8} more</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
