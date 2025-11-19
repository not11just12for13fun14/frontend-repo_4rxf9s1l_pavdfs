import { useState } from 'react'

export default function RequestRide({ onRideCreated }) {
  const [name, setName] = useState('')
  const [pickup, setPickup] = useState({ lat: 37.7749, lng: -122.4194 })
  const [dropoff, setDropoff] = useState({ lat: 37.7849, lng: -122.4094 })
  const [loading, setLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/rides/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rider_name: name || 'Guest', pickup, dropoff })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to request ride')
      onRideCreated?.(data)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, children }) => (
    <label className="block mb-3">
      <span className="text-sm text-blue-200 block mb-1">{label}</span>
      {children}
    </label>
  )

  return (
    <form onSubmit={submit} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-3">Request a Ride</h3>
      <Field label="Your name">
        <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700 focus:outline-none" placeholder="e.g., Alex" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Pickup lat">
          <input type="number" step="0.0001" value={pickup.lat} onChange={(e)=>setPickup({ ...pickup, lat: parseFloat(e.target.value) })} className="w-full px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700" />
        </Field>
        <Field label="Pickup lng">
          <input type="number" step="0.0001" value={pickup.lng} onChange={(e)=>setPickup({ ...pickup, lng: parseFloat(e.target.value) })} className="w-full px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Dropoff lat">
          <input type="number" step="0.0001" value={dropoff.lat} onChange={(e)=>setDropoff({ ...dropoff, lat: parseFloat(e.target.value) })} className="w-full px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700" />
        </Field>
        <Field label="Dropoff lng">
          <input type="number" step="0.0001" value={dropoff.lng} onChange={(e)=>setDropoff({ ...dropoff, lng: parseFloat(e.target.value) })} className="w-full px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700" />
        </Field>
      </div>
      <button disabled={loading} className="mt-2 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded px-4 py-2">{loading ? 'Requesting...' : 'Request Ride'}</button>
    </form>
  )
}
