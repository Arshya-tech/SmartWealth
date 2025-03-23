import { RiskAnalysisDashboard } from "@/components/risk-analysis-dashboard"

export default function RiskPage() {
  return (
    <main className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SmartWealth Risk Analysis</h1>
          <p className="text-lg text-gray-600">
            Comprehensive risk assessment and management for your investment portfolio
          </p>
        </div>

        <RiskAnalysisDashboard />
      </div>
    </main>
  )
}

