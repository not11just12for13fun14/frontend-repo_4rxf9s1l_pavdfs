import { useEffect, useState } from 'react'

export default function DriverPanel() {
  const [drivers, setDrivers] = useState([])
  const [name, setName] = useState('')
  const [car, setCar] = useState('')
  const [plate, setPlate] = useState('')
  const [coords, setCoords] = useState({ lat: 37.776, lng: -122.417 })
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    const res = await fetch(`${baseUrl}/drivers/available`)
    const data = await res.json()
    setDrivers(data)
  }

  useEffect(() => { load() }, [])

  const addDriver = async () => {
    const res = await fetch(`${baseUrl}/drivers`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, car, plate, location: coords })
    })
    await res.json()
    setName(''); setCar(''); setPlate('')
    await load()
  }

  const updateLocation = async (id) => {
    const jitter = () => (Math.random()-0.5) * 0.01
    const res = await fetch(`${baseUrl}/drivers/${id}/location`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: { lat: coords.lat + jitter(), lng: coords.lng + jitter() } })
    })
    await res.json()
    await load()
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-3">Drivers</h3>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700" />
        <input value={car} onChange={(e)=>setCar(e.target.value)} placeholder="Car" className="px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700" />
        <input value={plate} onChange={(e)=>setPlate(e.target.value)} placeholder="Plate" className="px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700" />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <input type="number" step="0.0001" value={coords.lat} onChange={(e)=>setCoords({ ...coords, lat: parseFloat(e.target.value) })} className="px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700" />
        <input type="number" step="0.0001" value={coords.lng} onChange={(e)=>setCoords({ ...coords, lng: parseFloat(e.target.value) })} className="px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700" />
      </div>
      <button onClick={addDriver} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded px-4 py-2 mb-3">Add / Update Driver</button>
      <div className="space-y-2 max-h-56 overflow-auto pr-1">
        {drivers.map(d => (
          <div key={d.id} className="flex items-center justify-between bg-slate-900/50 border border-slate-700 rounded p-2">
            <div>
              <p className="text-white text-sm font-medium">{d.name} • {d.car || '—'} • {d.plate || '—'}</p>
              <p className="text-blue-300/80 text-xs">{d.is_available ? 'Available' : 'Busy'} {d.location ? `@ ${d.location.lat.toFixed(4)}, ${d.location.lng.toFixed(4)}` : ''}</p>
            </div>
            <button onClick={() => updateLocation(d.id)} className="text-xs bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-1">Nudge</button>
          </div>
        ))}
        {drivers.length === 0 && <p className="text-blue-200 text-sm">No available drivers yet.</p>}
      </div>
    </div>
  )
}
