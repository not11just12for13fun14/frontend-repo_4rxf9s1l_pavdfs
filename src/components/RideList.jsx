import { useEffect, useState } from 'react'

export default function RideList({ refreshKey }) {
  const [rides, setRides] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    const res = await fetch(`${baseUrl}/rides`)
    const data = await res.json()
    setRides(data)
  }

  useEffect(() => { load() }, [refreshKey])

  const advance = async (ride, status) => {
    await fetch(`${baseUrl}/rides/${ride.id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    await load()
  }

  const nextActions = (status) => {
    switch (status) {
      case 'assigned': return ['accepted']
      case 'accepted': return ['in_progress']
      case 'in_progress': return ['completed']
      case 'requested': return ['cancelled']
      default: return []
    }
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-3">Rides</h3>
      <div className="space-y-2 max-h-64 overflow-auto pr-1">
        {rides.map(r => (
          <div key={r.id} className="bg-slate-900/50 border border-slate-700 rounded p-2">
            <div className="flex items-center justify-between">
              <p className="text-white text-sm font-medium">{r.status.toUpperCase()}</p>
              <p className="text-blue-300/80 text-xs">{r.id}</p>
            </div>
            <p className="text-blue-200/80 text-xs">Driver: {r.driver_id || 'Unassigned'}</p>
            <p className="text-blue-200/80 text-xs">Pickup: {r.pickup?.lat?.toFixed?.(4)}, {r.pickup?.lng?.toFixed?.(4)} → Dropoff: {r.dropoff?.lat?.toFixed?.(4)}, {r.dropoff?.lng?.toFixed?.(4)}</p>
            <div className="mt-2 flex gap-2">
              {nextActions(r.status).map(a => (
                <button key={a} onClick={() => advance(r, a)} className="text-xs bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-1">{a}</button>
              ))}
            </div>
          </div>
        ))}
        {rides.length === 0 && <p className="text-blue-200 text-sm">No rides yet.</p>}
      </div>
    </div>
  )
}
