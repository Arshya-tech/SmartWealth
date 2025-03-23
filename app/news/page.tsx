import { ComingSoon } from "@/components/coming-soon"

export default function NewsPage() {
  return (
    <main className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SmartWealth News Scraper</h1>
          <p className="text-lg text-gray-600">AI-powered financial news analysis for smarter investment decisions</p>
        </div>

        <ComingSoon
          title="News Scraper Coming Soon"
          description="Our advanced AI-powered news scraper is in the final stages of development. Soon you'll have access to real-time financial news analysis to inform your investment decisions."
        />
      </div>
    </main>
  )
}

