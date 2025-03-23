import { SentimentAnalyzer } from "@/components/sentiment-analyzer"

export default function SentimentPage() {
  return (
    <main className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SmartWealth Market Sentiment Analyzer</h1>
          <p className="text-lg text-gray-600">
            AI-powered analysis of market sentiment from news, social media, and financial reports
          </p>
        </div>

        <SentimentAnalyzer />
      </div>
    </main>
  )
}

