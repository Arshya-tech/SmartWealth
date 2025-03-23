import PortfolioBuilder from "@/components/portfolio-builder"

export default function PortfolioPage() {
  return (
    <main className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SmartWealth Portfolio Builder</h1>
          <p className="text-lg text-gray-600">
            Build a personalized stock & crypto portfolio using real-time market data
          </p>
        </div>

        <PortfolioBuilder />
      </div>
    </main>
  )
}

