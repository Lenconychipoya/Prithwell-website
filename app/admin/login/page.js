'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const from         = searchParams.get('from') ?? '/admin'

  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push(from)
      } else {
        const { error: msg } = await res.json()
        setError(msg ?? 'Incorrect password')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a1628' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', lineHeight: 1 }}>
              <span style={{ fontFamily: 'Arial Black, Arial, sans-serif', fontSize: '1.8rem', fontWeight: 900, color: '#4d8af0', letterSpacing: '1px' }}>PRITH</span>
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ fontFamily: 'Arial Black, Arial, sans-serif', fontSize: '1.8rem', fontWeight: 900, color: '#4d8af0', letterSpacing: '1px' }}>W</span>
                <span style={{ position: 'absolute', top: '38%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '9px solid #c9a227' }}/>
              </span>
              <span style={{ fontFamily: 'Arial Black, Arial, sans-serif', fontSize: '1.8rem', fontWeight: 900, color: '#4d8af0', letterSpacing: '1px' }}>ELL</span>
            </div>
            <span style={{ fontFamily: 'Arial Black, Arial, sans-serif', fontSize: '1rem', fontWeight: 900, color: '#cbd5e1', letterSpacing: '5px', marginTop: '2px' }}>MOTORS</span>
            <span style={{ display: 'block', background: '#c9a227', color: '#0a1628', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '2px', textAlign: 'center', padding: '2px 8px', marginTop: '3px', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase' }}>Drive with confidence</span>
          </div>
          <p className="mt-4 text-sm" style={{ color: '#8899bb' }}>Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-4">
          <h1 className="font-display font-bold text-gray-900 text-xl text-center">Sign In</h1>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input"
              placeholder="Enter admin password"
              autoFocus
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="btn-primary w-full"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
