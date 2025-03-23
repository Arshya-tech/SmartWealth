import { ComingSoon } from "@/components/coming-soon"

export default function TrackingPage() {
  return (
    <main className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SmartWealth Transparent Tracking</h1>
          <p className="text-lg text-gray-600">Real-time tracking of all investment activities on the blockchain</p>
        </div>

        <ComingSoon
          title="Transparent Tracking Coming Soon"
          description="Our blockchain-based transparent tracking system is under development. Soon you'll be able to track every investment activity in real-time with complete transparency."
        />
      </div>
    </main>
  )
}

