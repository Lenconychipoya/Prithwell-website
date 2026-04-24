'use client'
import Link from 'next/link'

export default function ProductCard({ product }) {
  const addToCart = (e) => {
    e.preventDefault()
    try {
      const cart  = JSON.parse(sessionStorage.getItem('cart') ?? '[]')
      const idx   = cart.findIndex(i => i.id === product.id)
      if (idx >= 0) {
        cart[idx].quantity += 1
      } else {
        cart.push({ id: product.id, sku: product.sku, name: product.name, price: product.price, quantity: 1 })
      }
      sessionStorage.setItem('cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('cartUpdated'))
      // Flash feedback
      const btn = e.currentTarget
      btn.textContent = 'Added!'
      btn.classList.add('bg-brand-700')
      setTimeout(() => { btn.textContent = 'Add to Cart'; btn.classList.remove('bg-brand-700') }, 1000)
    } catch {}
  }

  const stockColor = product.stock_qty > 5 ? 'text-green-600' : product.stock_qty > 0 ? 'text-amber-600' : 'text-red-500'
  const stockText  = product.stock_qty > 5 ? 'In Stock' : product.stock_qty > 0 ? `Only ${product.stock_qty} left` : 'Out of Stock'

  return (
    <Link href={`/catalogue/${product.sku}`} className="card block hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      {/* Image area */}
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 80 80" className="w-16 h-16 text-gray-300" fill="currentColor">
              <rect x="10" y="30" width="60" height="8" rx="4"/>
              <rect x="15" y="20" width="50" height="12" rx="4"/>
              <circle cx="25" cy="55" r="8" fill="none" stroke="currentColor" strokeWidth="4"/>
              <circle cx="55" cy="55" r="8" fill="none" stroke="currentColor" strokeWidth="4"/>
            </svg>
          </div>
        )}
        {product.category_name && (
          <span className="absolute top-2 left-2 badge bg-brand-100 text-brand-700">{product.category_name}</span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        <div className="text-xs text-gray-400 mt-0.5">{product.sku}</div>

        <div className="mt-2 flex items-end justify-between gap-2">
          <div>
            <div className="font-display font-bold text-brand-700 text-lg">${product.price?.toFixed(2)}</div>
            <div className={`text-xs font-medium ${stockColor}`}>{stockText}</div>
          </div>
          {product.stock_qty > 0 && (
            <button
              onClick={addToCart}
              className="btn-primary text-xs px-3 py-2 min-h-0 rounded-lg"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
