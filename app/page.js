import Link from 'next/link'
import { getCategories, getProducts } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import VehicleSearch from '@/components/VehicleSearch'

export const revalidate = 3600

const CATEGORY_ICONS = {
  'Suspension & Steering': '🔩',
  'Brakes (Pads/Discs/Shoes)': '🛑',
  'Filters (Oil/Air/Fuel/Cabin)': '🔽',
  'Engine Oil & Fluids': '🛢️',
  'Electrical & Ignition': '⚡',
  'Cooling System': '🌡️',
  'Belts & Hoses': '〰️',
  'Tyres & Wheels': '⭕',
  'Lighting (Bulbs/Headlights)': '💡',
  'Body & Exterior': '🚗',
  'Tools & Workshop': '🔧',
  'Batteries': '🔋',
}

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getProducts({ limit: 8 })
  ])

  return (
    <div>
      {/* Hero — swap backgroundImage URL below for a real shop/parts photo */}
      <section
        className="relative overflow-hidden"
        style={{ background: '#0a1628', minHeight: '420px' }}
      >
        {/* Background photo layer — replace url(...) with a real image when ready */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/hero-bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.18,
          }}
        />

        {/* Diagonal stripe overlay for racing feel */}
        <div className="absolute inset-0 overflow-hidden">
          <div style={{
            position: 'absolute', right: '-10%', top: 0, bottom: 0, width: '55%',
            background: 'linear-gradient(135deg, transparent 40%, rgba(245,197,0,0.06) 40%)',
          }}/>
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '35%',
            background: 'linear-gradient(135deg, transparent 30%, rgba(245,197,0,0.04) 30%)',
          }}/>
        </div>

        {/* Yellow accent bar on left edge */}
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: '#c9a227' }}/>

        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-5"
              style={{ background: 'rgba(245,197,0,0.12)', color: '#c9a227', border: '1px solid rgba(245,197,0,0.25)' }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#c9a227' }}/>
              Fast delivery across Zimbabwe
            </div>

            <h1 className="font-display text-white text-4xl md:text-6xl font-bold leading-tight mb-5">
              Quality Auto Parts,
              <br/>
              <span style={{ color: '#c9a227' }}>Delivered Fast.</span>
            </h1>

            <p className="text-lg mb-8 leading-relaxed" style={{ color: '#8899bb' }}>
              Genuine and quality aftermarket parts for Toyota, Nissan, Honda, Mazda and more.
              Pay with EcoCash, OneMoney or card.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/catalogue"
                className="inline-flex items-center justify-center gap-2 font-bold rounded-xl px-7 py-3.5 transition-all duration-150 active:scale-95"
                style={{ background: '#c9a227', color: '#0a1628' }}
              >
                Browse All Parts
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              </Link>
              <a
                href="https://wa.me/263773895255?text=Hi, I need help finding a part"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-medium rounded-xl px-7 py-3.5 transition-all duration-150 active:scale-95"
                style={{ background: 'rgba(255,255,255,0.07)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Ask on WhatsApp
              </a>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mt-10">
              {[['408+', 'Parts in stock'], ['14', 'Vehicle makes'], ['Harare', '1–2 day delivery']].map(([val, label]) => (
                <div key={label}>
                  <div className="font-display font-bold text-2xl" style={{ color: '#c9a227' }}>{val}</div>
                  <div className="text-xs" style={{ color: '#8899bb' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Search */}
      <section className="max-w-6xl mx-auto px-4 -mt-6 relative z-10">
        <VehicleSearch />
      </section>

      {/* Trust badges */}
      <section className="max-w-6xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '✅', title: 'Quality Parts', sub: 'Genuine & aftermarket' },
            { icon: '🚚', title: 'Fast Delivery', sub: 'Harare: 1–2 days' },
            { icon: '📱', title: 'EcoCash', sub: 'OneMoney & card' },
            { icon: '💬', title: 'WhatsApp Support', sub: 'Chat anytime' },
          ].map(b => (
            <div key={b.title} className="card p-4 flex items-center gap-3">
              <span className="text-2xl">{b.icon}</span>
              <div>
                <div className="font-medium text-gray-900 text-sm">{b.title}</div>
                <div className="text-gray-500 text-xs">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <h2 className="font-display font-bold text-gray-900 text-2xl mb-6">Browse by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/catalogue?category=${cat.id}`}
              className="card p-3 flex flex-col items-center text-center hover:border-brand-300 hover:shadow-md transition-all duration-200"
            >
              <span className="text-2xl mb-2">{CATEGORY_ICONS[cat.name] ?? '🔧'}</span>
              <span className="text-xs text-gray-700 font-medium leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-6xl mx-auto px-4 mt-12 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-gray-900 text-2xl">Available Parts</h2>
          <Link href="/catalogue" className="text-brand-600 text-sm font-medium hover:text-brand-700">View all →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  )
}
