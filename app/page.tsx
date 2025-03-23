import { StrategyGenerator } from "@/components/strategy-generator"

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">SmartWealth Strategies</h1>
          <p className="text-xl text-slate-600">Personalized investment strategies based on your financial profile</p>
        </div>

        <div className="pb-12">
          <StrategyGenerator />
        </div>
      </div>
    </main>
  )
}

