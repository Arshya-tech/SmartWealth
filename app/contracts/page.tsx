import { SmartContractDashboard } from "@/components/smart-contract-dashboard"

export default function ContractsPage() {
  return (
    <main className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SmartWealth Blockchain Contracts</h1>
          <p className="text-lg text-gray-600">Transparent investment tracking through Ethereum smart contracts</p>
        </div>

        <SmartContractDashboard />
      </div>
    </main>
  )
}

