'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getVehicleMakes, getVehicleModels } from '@/lib/supabase'

export default function VehicleSearch() {
  const router   = useRouter()
  const [makes, setMakes]   = useState([])
  const [models, setModels] = useState([])
  const [make, setMake]     = useState('')
  const [model, setModel]   = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { getVehicleMakes().then(setMakes) }, [])

  const onMakeChange = async (makeId) => {
    setMake(makeId)
    setModel('')
    setModels([])
    if (makeId) {
      const m = await getVehicleModels(makeId)
      setModels(m)
    }
  }

  const onSearch = () => {
    if (!make) return
    setLoading(true)
    const params = new URLSearchParams({ make })
    if (model) params.set('model', model)
    router.push(`/catalogue?${params}`)
  }

  return (
    <div className="card p-5 shadow-lg border-brand-200 border">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
        </div>
        <div>
          <div className="font-display font-bold text-gray-900 text-sm">Find Parts for Your Vehicle</div>
          <div className="text-gray-500 text-xs">Select your make and model</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={make}
          onChange={e => onMakeChange(e.target.value)}
          className="input flex-1 text-sm"
        >
          <option value="">Select Make...</option>
          {makes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>

        <select
          value={model}
          onChange={e => setModel(e.target.value)}
          disabled={!make || models.length === 0}
          className="input flex-1 text-sm disabled:opacity-50"
        >
          <option value="">All Models</option>
          {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>

        <button
          onClick={onSearch}
          disabled={!make || loading}
          className="btn-primary whitespace-nowrap"
        >
          {loading ? 'Searching…' : 'Find Parts'}
        </button>
      </div>
    </div>
  )
}
