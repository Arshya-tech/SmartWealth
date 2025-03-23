"use client"

import { useState, useEffect } from "react"
import { BarChart, LineChart, PieChart, RefreshCw, Search, TrendingDown, TrendingUp } from "lucide-react"
import { fetchFromAPI } from "@/config/api-config"

// Defines types for our data
interface SentimentData {
  symbol: string
  name: string
  sentiment: number
  trend: "bullish" | "bearish" | "neutral"
  headlines: {
    title: string
    source: string
    sentiment: "positive" | "negative" | "neutral"
    id?: string
  }[]
}

interface SentimentSources {
  news: number
  social: number
  financial: number
  breakdown?: {
    twitter: number
    reddit: number
    stockTwits: number
    bloomberg: number
    reuters: number
  }
}

export function SentimentAnalyzer() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // States for API data
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([])
  const [sentimentSources, setSentimentSources] = useState<SentimentSources | null>(null)

  // Fetches sentiment data from API
  const fetchSentimentData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetches data from API endpoints
      const data = await fetchFromAPI(`/api/sentiment/market-sentiment`)
      const sources = await fetchFromAPI(`/api/sentiment/sentiment-sources`)

      setSentimentData(data)
      setSentimentSources(sources)
    } catch (err) {
      console.error("Error fetching sentiment data:", err)
      setError("Failed to load sentiment data. Using fallback data instead.")

      // Uses fallback data
      const fallbackData = [
        {
          symbol: "AAPL",
          name: "Apple Inc.",
          sentiment: 75,
          trend: "bullish" as const,
          headlines: [
            {
              title: "Apple's new product line exceeds expectations",
              source: "Financial Times",
              sentiment: "positive" as const,
              id: "news-1",
            },
            {
              title: "Analysts raise price targets for Apple stock",
              source: "Wall Street Journal",
              sentiment: "positive" as const,
              id: "news-2",
            },
          ],
        },
        {
          symbol: "MSFT",
          name: "Microsoft Corporation",
          sentiment: 68,
          trend: "bullish" as const,
          headlines: [
            {
              title: "Microsoft cloud services see strong growth",
              source: "CNBC",
              sentiment: "positive" as const,
              id: "news-3",
            },
          ],
        },
      ]

      const fallbackSources = {
        news: 72,
        social: 78,
        financial: 65,
        breakdown: {
          twitter: 60,
          reddit: 55,
          stockTwits: 70,
          bloomberg: 80,
          reuters: 75,
        },
      }

      setSentimentData(fallbackData)
      setSentimentSources(fallbackSources)
    } finally {
      setLoading(false)
    }
  }

  // Initial data load
  useEffect(() => {
    fetchSentimentData()
  }, [])

  // Handles search
  const handleSearch = async () => {
    if (!searchQuery) return

    setLoading(true)
    setError(null)

    try {
      // Searches API endpoint
      const data = await fetchFromAPI(`/api/sentiment/market-sentiment?q=${encodeURIComponent(searchQuery)}`)

      setSentimentData(data)
    } catch (err) {
      console.error("Search failed:", err)
      setError("Search failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handles refresh button click
  const handleRefresh = () => {
    fetchSentimentData()
  }

  // If we're still loading and have no data
  if (loading && sentimentData.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border shadow-sm p-8 flex justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Market Sentiment Analyzer</h2>
              <p className="text-sm text-gray-500">
                AI-powered analysis of market sentiment from news, social media, and financial reports
              </p>
              {error && <p className="text-sm text-amber-600 mt-1">Note: {error}</p>}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="Search asset (e.g., AAPL, BTC)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md pr-8"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  className="absolute right-0 top-0 h-full px-2 text-gray-500"
                  onClick={handleSearch}
                  disabled={loading || !searchQuery}
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
              <button className="p-2 border rounded-md text-gray-500" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Top Sentiment Scores</h3>
              <div className="space-y-4">
                {/* Sentiment scores - Will be populated with API data */}
                {sentimentData
                  .sort((a, b) => b.sentiment - a.sentiment)
                  .map((data) => (
                    <div key={data.symbol} className="flex items-center space-x-4">
                      <div className="w-12 text-sm font-medium">{data.symbol}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{data.name}</span>
                          <span className="text-sm font-medium">{data.sentiment}%</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                data.sentiment >= 70
                                  ? "bg-green-500"
                                  : data.sentiment >= 50
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${data.sentiment}%` }}
                            ></div>
                          </div>
                          {data.trend === "bullish" ? (
                            <TrendingUp className="h-4 w-4 ml-2 text-green-500" />
                          ) : data.trend === "bearish" ? (
                            <TrendingDown className="h-4 w-4 ml-2 text-red-500" />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {sentimentSources && (
                <>
                  <h3 className="text-lg font-medium mt-8 mb-4">Sentiment Sources</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Sentiment sources - Will be populated with API data */}
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <div className="text-blue-500 mb-1">
                        <BarChart className="h-5 w-5 mx-auto" />
                      </div>
                      <div className="text-sm font-medium">News</div>
                      <div className="text-2xl font-bold text-blue-700 mt-1">{sentimentSources.news}%</div>
                      <div className="text-xs text-blue-600 mt-1">Positive</div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg text-center">
                      <div className="text-purple-500 mb-1">
                        <LineChart className="h-5 w-5 mx-auto" />
                      </div>
                      <div className="text-sm font-medium">Social</div>
                      <div className="text-2xl font-bold text-purple-700 mt-1">{sentimentSources.social}%</div>
                      <div className="text-xs text-purple-600 mt-1">Positive</div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg text-center">
                      <div className="text-green-500 mb-1">
                        <PieChart className="h-5 w-5 mx-auto" />
                      </div>
                      <div className="text-sm font-medium">Financial</div>
                      <div className="text-2xl font-bold text-green-700 mt-1">{sentimentSources.financial}%</div>
                      <div className="text-xs text-green-600 mt-1">Positive</div>
                    </div>
                  </div>

                  {/* Add detailed breakdown if available */}
                  {sentimentSources.breakdown && (
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-3">Detailed Sentiment Breakdown</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="bg-white p-2 rounded border text-center">
                          <div className="text-xs text-gray-500">Twitter</div>
                          <div className="font-medium text-primary">{sentimentSources.breakdown.twitter}%</div>
                        </div>
                        <div className="bg-white p-2 rounded border text-center">
                          <div className="text-xs text-gray-500">Reddit</div>
                          <div className="font-medium text-primary">{sentimentSources.breakdown.reddit}%</div>
                        </div>
                        <div className="bg-white p-2 rounded border text-center">
                          <div className="text-xs text-gray-500">StockTwits</div>
                          <div className="font-medium text-primary">{sentimentSources.breakdown.stockTwits}%</div>
                        </div>
                        <div className="bg-white p-2 rounded border text-center">
                          <div className="text-xs text-gray-500">Bloomberg</div>
                          <div className="font-medium text-primary">{sentimentSources.breakdown.bloomberg}%</div>
                        </div>
                        <div className="bg-white p-2 rounded border text-center">
                          <div className="text-xs text-gray-500">Reuters</div>
                          <div className="font-medium text-primary">{sentimentSources.breakdown.reuters}%</div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Latest Headlines & Sentiment</h3>
              <div className="space-y-3">
                {/* Headlines - Will be populated with API data */}
                {sentimentData
                  .flatMap((data) =>
                    data.headlines.map((headline, idx) => ({
                      ...headline,
                      symbol: data.symbol,
                      id: headline.id || `${data.symbol}-${idx}`,
                    })),
                  )
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 5)
                  .map((headline) => (
                    <div key={headline.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-800 text-xs rounded-full">
                          {headline.symbol}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            headline.sentiment === "positive"
                              ? "bg-green-100 text-green-800"
                              : headline.sentiment === "negative"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {headline.sentiment}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{headline.title}</p>
                      <div className="text-xs text-gray-500 mt-1">Source: {headline.source}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

