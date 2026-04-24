import Link from 'next/link'

const Logo = () => (
  <div className="flex flex-col leading-none">
    <span style={{
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '1.5rem',
      fontWeight: 900,
      color: '#f5c500',
      letterSpacing: '-0.5px',
      lineHeight: 1,
      display: 'inline-block',
      transform: 'skewX(-10deg)',
    }}>PRITHWELL</span>
    <span style={{
      display: 'block',
      height: '2px',
      background: '#f5c500',
      marginTop: '2px',
      marginBottom: '3px',
      transform: 'skewX(-10deg)',
      width: '100%',
    }}/>
    <span style={{
      fontFamily: 'Arial, sans-serif',
      fontSize: '0.5rem',
      fontWeight: 400,
      color: '#ffffff',
      letterSpacing: '4px',
      lineHeight: 1,
    }}>MOTOR SPARES</span>
  </div>
)

export default function Footer() {
  return (
    <footer style={{ background: '#0a1628' }} className="text-gray-400 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">

        <div>
          <div className="mb-4">
            <Logo />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#8899bb' }}>
            Quality auto parts for Japanese and Chinese vehicles. Trusted by mechanics and motorists across Zimbabwe.
          </p>
          <div className="mt-3 text-xs" style={{ color: '#445566' }}>Harare, Zimbabwe</div>
        </div>

        <div>
          <h3 className="font-bold text-white mb-4 text-sm tracking-widest uppercase">Quick Links</h3>
          <div className="flex flex-col gap-2 text-sm" style={{ color: '#8899bb' }}>
            <Link href="/catalogue" className="hover:text-white transition-colors">Browse Parts</Link>
            <Link href="/catalogue?search=shocks" className="hover:text-white transition-colors">Shock Absorbers</Link>
            <Link href="/catalogue?search=brake" className="hover:text-white transition-colors">Brake Parts</Link>
            <Link href="/catalogue?search=oil" className="hover:text-white transition-colors">Engine Oil</Link>
            <Link href="/catalogue?search=filter" className="hover:text-white transition-colors">Filters</Link>
            <Link href="/track" className="hover:text-white transition-colors">Track Order</Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white mb-4 text-sm tracking-widest uppercase">Contact Us</h3>
          <div className="flex flex-col gap-3 text-sm">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2637XXXXXXXXX'}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
              style={{ color: '#25D366' }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              WhatsApp Us
            </a>
            <div className="text-xs mt-2" style={{ color: '#445566' }}>
              Orders before 2pm processed same day.<br/>
              Harare delivery: 1–2 days<br/>
              Other cities: 2–4 days
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ borderTop: '1px solid #1a2a44', color: '#445566' }}>
        <span>© {new Date().getFullYear()} Prithwell Motor Spares. All rights reserved.</span>
        <span>Prices in USD · EcoCash · OneMoney · Card accepted</span>
      </div>
    </footer>
  )
}
