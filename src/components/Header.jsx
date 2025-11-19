export default function Header() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Mini Ride Hailing</h1>
        <p className="text-blue-200/80">Request rides, manage drivers, and track status</p>
      </div>
      <a href="/test" className="text-sm text-blue-300 hover:text-blue-200 underline">Check backend</a>
    </div>
  )
}
