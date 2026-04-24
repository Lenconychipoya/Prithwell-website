import Link from 'next/link'

export const metadata = {
  title: 'About Us — Prithwell Motor Spares',
  description: 'Harare\'s trusted auto parts supplier. Quality genuine and aftermarket parts with fast delivery across Zimbabwe.',
}

const WHY_US = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    title: 'Quality Guaranteed',
    body: 'Every part we stock is sourced from trusted suppliers. We carry both genuine OEM parts and quality aftermarket alternatives.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
    title: 'Fast Delivery',
    body: 'Orders placed before midday are delivered within 1–2 business days in Harare. We also ship to other cities across Zimbabwe.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
      </svg>
    ),
    title: 'Easy Payments',
    body: 'Pay with EcoCash, OneMoney, bank card, or cash on delivery. No hassle, no complicated steps.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
      </svg>
    ),
    title: 'Expert Advice',
    body: 'Not sure which part you need? Chat with us on WhatsApp. Our team knows vehicles inside-out and will point you to the right part.',
  },
]

const STATS = [
  { value: '408+', label: 'Parts in stock' },
  { value: '14', label: 'Vehicle makes' },
  { value: '168', label: 'Vehicle models' },
  { value: '17', label: 'Categories' },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: '#0a1628' }}>
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: '#f5c500' }}/>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(245,197,0,0.05) 0%, transparent 60%)',
        }}/>
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-20">
          <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: '#f5c500' }}>About Us</p>
          <h1 className="font-display text-white text-4xl md:text-5xl font-bold leading-tight mb-4">
            Harare&rsquo;s Trusted<br/>
            <span style={{ color: '#f5c500' }}>Auto Parts Supplier</span>
          </h1>
          <p className="text-lg max-w-xl leading-relaxed" style={{ color: '#8899bb' }}>
            Prithwell Motor Spares has been supplying quality auto parts to Zimbabwean motorists and workshops. We stock genuine and aftermarket parts for the most popular vehicles on Zimbabwean roads.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#f5c500' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display font-bold text-3xl md:text-4xl" style={{ color: '#0a1628' }}>{s.value}</div>
                <div className="text-sm font-medium mt-1" style={{ color: '#3a2800' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: '#f5c500' }}>Our Story</p>
            <h2 className="font-display text-gray-900 text-3xl font-bold mb-5">Built for Zimbabwe&rsquo;s Roads</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Prithwell Motor Spares was founded with one goal: make it easy for every Zimbabwean motorist to find the right part at a fair price — without wasting hours driving across Harare.
              </p>
              <p>
                We understand Zimbabwe&rsquo;s vehicle landscape. Whether you drive a Toyota Hilux, Nissan Navara, Honda Fit, or a Mazda Demio, we stock the parts you need most — filters, brakes, suspension, belts, fluids and more.
              </p>
              <p>
                Our online shop brings the same parts and expertise directly to your phone. Browse, order, pay with EcoCash or card, and we deliver to your door.
              </p>
            </div>
          </div>

          {/* Photo placeholder — replace with a real shop photo */}
          <div
            className="rounded-2xl overflow-hidden flex items-center justify-center"
            style={{ background: '#0a1628', minHeight: '300px', border: '2px dashed rgba(245,197,0,0.3)' }}
          >
            <div className="text-center p-8">
              <div className="text-5xl mb-3">🏪</div>
              <p className="text-sm" style={{ color: '#8899bb' }}>Shop photo coming soon</p>
              <p className="text-xs mt-1" style={{ color: '#4a5a7a' }}>Replace with a real image</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section style={{ background: '#f9fafb' }} className="py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: '#f5c500' }}>Why Choose Us</p>
            <h2 className="font-display text-gray-900 text-3xl font-bold">The Prithwell Difference</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {WHY_US.map(item => (
              <div key={item.title} className="card p-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: '#0a1628', color: '#f5c500' }}>
                  {item.icon}
                </div>
                <h3 className="font-display font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & contact */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: '#f5c500' }}>Find Us</p>
            <h2 className="font-display text-gray-900 text-3xl font-bold mb-6">Visit Our Store</h2>
            <div className="space-y-4">
              {[
                { label: 'Address', value: 'Harare, Zimbabwe', icon: '📍' },
                { label: 'Phone / WhatsApp', value: '+263 7XX XXX XXX', icon: '📱' },
                { label: 'Email', value: 'info@prithwellmotorspares.co.zw', icon: '✉️' },
                { label: 'Hours', value: 'Mon–Fri 8am–5pm · Sat 8am–1pm', icon: '🕐' },
              ].map(row => (
                <div key={row.label} className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{row.icon}</span>
                  <div>
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">{row.label}</div>
                    <div className="text-gray-800 font-medium">{row.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-8 flex flex-col gap-5" style={{ background: '#0a1628' }}>
            <h3 className="font-display font-bold text-white text-2xl">Need a part?</h3>
            <p style={{ color: '#8899bb' }} className="text-sm leading-relaxed">
              Can&rsquo;t find what you&rsquo;re looking for online? Message us on WhatsApp with your vehicle details and part name — we&rsquo;ll check stock and get back to you fast.
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2637XXXXXXXXX'}?text=Hi, I need help finding a part`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-bold rounded-xl px-6 py-3.5 transition-all active:scale-95"
                style={{ background: '#f5c500', color: '#0a1628' }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Chat on WhatsApp
              </a>
              <Link
                href="/catalogue"
                className="inline-flex items-center justify-center gap-2 font-medium rounded-xl px-6 py-3.5 transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.07)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Browse the Catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
