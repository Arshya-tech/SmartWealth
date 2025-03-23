import { AutoAdjustDashboard } from "@/components/auto-adjust-dashboard"

export default function AutoAdjustPage() {
  return (
    <main className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SmartWealth Auto-Adjust</h1>
          <p className="text-lg text-gray-600">
            AI-powered portfolio rebalancing based on market conditions and your risk profile
          </p>
        </div>

        <AutoAdjustDashboard />
      </div>
    </main>
  )
}

