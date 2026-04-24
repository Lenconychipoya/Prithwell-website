'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const Logo = () => (
  <Link href="/" className="flex flex-col leading-none select-none" style={{ minHeight: 0 }}>
    {/* PRITHWELL with gold W chevron accent */}
    <div style={{ display: 'flex', alignItems: 'flex-end', lineHeight: 1 }}>
      <span style={{
        fontFamily: 'Arial Black, Arial, sans-serif',
        fontSize: '1.3rem',
        fontWeight: 900,
        color: '#4d8af0',
        letterSpacing: '1px',
        lineHeight: 1,
      }}>PRITH</span>
      <span style={{ position: 'relative', display: 'inline-block', lineHeight: 1 }}>
        <span style={{
          fontFamily: 'Arial Black, Arial, sans-serif',
          fontSize: '1.3rem',
          fontWeight: 900,
          color: '#4d8af0',
          letterSpacing: '1px',
        }}>W</span>
        {/* Gold chevron inside W */}
        <span style={{
          position: 'absolute',
          top: '38%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: '7px solid #c9a227',
        }}/>
      </span>
      <span style={{
        fontFamily: 'Arial Black, Arial, sans-serif',
        fontSize: '1.3rem',
        fontWeight: 900,
        color: '#4d8af0',
        letterSpacing: '1px',
        lineHeight: 1,
      }}>ELL</span>
    </div>
    {/* MOTORS */}
    <span style={{
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '0.78rem',
      fontWeight: 900,
      color: '#cbd5e1',
      letterSpacing: '4.5px',
      lineHeight: 1,
      marginTop: '1px',
    }}>MOTORS</span>
    {/* Gold tagline bar */}
    <span style={{
      display: 'block',
      background: '#c9a227',
      color: '#0a1628',
      fontSize: '0.38rem',
      fontWeight: 700,
      letterSpacing: '1.5px',
      textAlign: 'center',
      padding: '2px 4px',
      marginTop: '2px',
      fontFamily: 'Arial, sans-serif',
      textTransform: 'uppercase',
      borderRadius: '1px',
    }}>Drive with confidence</span>
  </Link>
)

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const update = () => {
      try {
        const cart = JSON.parse(sessionStorage.getItem('cart') ?? '[]')
        setCartCount(cart.reduce((s, i) => s + i.quantity, 0))
      } catch {}
    }
    update()
    window.addEventListener('cartUpdated', update)
    return () => window.removeEventListener('cartUpdated', update)
  }, [])

  return (
    <nav style={{ background: '#0a1628' }} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">

        <Logo />

        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: '#8899bb' }}>
          <Link href="/catalogue" className="hover:text-white transition-colors">Catalogue</Link>
          <Link href="/catalogue?search=shocks" className="hover:text-white transition-colors">Shocks</Link>
          <Link href="/catalogue?search=brake" className="hover:text-white transition-colors">Brakes</Link>
          <Link href="/catalogue?search=filter" className="hover:text-white transition-colors">Filters</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/track" className="hover:text-white transition-colors">Track Order</Link>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/263773895255"
            target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            style={{ background: '#25D366' }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Chat
          </a>

          <Link href="/cart" className="relative flex items-center justify-center w-10 h-10 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center"
                style={{ background: '#c9a227', color: '#0a1628' }}>
                {cartCount}
              </span>
            )}
          </Link>

          <button className="md:hidden text-white p-1" onClick={() => setMenuOpen(!menuOpen)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 py-4 flex flex-col gap-3 text-sm" style={{ background: '#060e1c', borderTop: '1px solid #1a2a44', color: '#8899bb' }}>
          <Link href="/catalogue" onClick={() => setMenuOpen(false)} className="py-1 hover:text-white">All Parts</Link>
          <Link href="/catalogue?search=shocks" onClick={() => setMenuOpen(false)} className="py-1 hover:text-white">Shock Absorbers</Link>
          <Link href="/catalogue?search=brake" onClick={() => setMenuOpen(false)} className="py-1 hover:text-white">Brake Parts</Link>
          <Link href="/catalogue?search=filter" onClick={() => setMenuOpen(false)} className="py-1 hover:text-white">Filters</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="py-1 hover:text-white">About Us</Link>
          <Link href="/track" onClick={() => setMenuOpen(false)} className="py-1 hover:text-white">Track My Order</Link>
          <a href="https://wa.me/263773895255" target="_blank" rel="noopener noreferrer" className="py-1" style={{ color: '#25D366' }}>WhatsApp Us</a>
        </div>
      )}
    </nav>
  )
}
