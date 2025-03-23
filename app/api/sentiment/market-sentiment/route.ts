import { NextResponse } from "next/server"
import { fetchAlphaVantage } from "@/config/api-config"

export async function GET(request: Request) {
  try {
    // Get search query from URL if provided
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    // Defines symbols to analyze (or use search query)
    let symbols = ["AAPL", "MSFT", "AMZN", "TSLA", "BTC", "ETH"]
    if (query) {
      symbols = [query.toUpperCase()]
    }

    // Fetches news sentiment for each symbol
    const sentimentPromises = symbols.map((symbol) =>
      fetchAlphaVantage("NEWS_SENTIMENT", {
        tickers: symbol,
        limit: 10,
      }),
    )

    const sentimentResults = await Promise.all(sentimentPromises)

    // Transforms the data to our format
    const sentimentData = sentimentResults
      .map((result, index) => {
        const symbol = symbols[index]

        if (!result.feed || result.feed.length === 0) {
          return null
        }

        // Calculates average sentiment score
        let totalSentiment = 0
        let count = 0

        const headlines = result.feed.slice(0, 5).map((article: any) => {
          // Finds the ticker sentiment for this symbol
          const tickerSentiment = article.ticker_sentiment?.find((t: any) => t.ticker === symbol)

          if (tickerSentiment) {
            totalSentiment += Number.parseFloat(tickerSentiment.ticker_sentiment_score)
            count++
          }

          return {
            title: article.title,
            source: article.source,
            sentiment: getSentimentCategory(tickerSentiment?.ticker_sentiment_score),
            id: article.url,
          }
        })

        // Calculates average sentiment (0-100 scale)
        const avgSentiment = count > 0 ? (totalSentiment / count) * 50 + 50 : 50

        return {
          symbol,
          name: getFullNameForSymbol(symbol, symbol === "BTC" || symbol === "ETH"),
          sentiment: Math.round(avgSentiment),
          trend: avgSentiment > 60 ? "bullish" : avgSentiment < 40 ? "bearish" : "neutral",
          headlines,
        }
      })
      .filter(Boolean)

    // If API call failed or returned no data, use enhanced mock data
    if (sentimentData.length === 0) {
      return NextResponse.json(getEnhancedMockSentimentData(query))
    }

    return NextResponse.json(sentimentData)
  } catch (error) {
    console.error("Error fetching sentiment data:", error)
    return NextResponse.json(getEnhancedMockSentimentData(), { status: 200 })
  }
}

// Helper function to get sentiment category
function getSentimentCategory(score?: string): "positive" | "negative" | "neutral" {
  if (!score) return "neutral"

  const numScore = Number.parseFloat(score)
  if (numScore > 0.25) return "positive"
  if (numScore < -0.25) return "negative"
  return "neutral"
}

// Helper function to get full names for symbols
function getFullNameForSymbol(symbol: string, isCrypto = false): string {
  const stockNames: Record<string, string> = {
    AAPL: "Apple Inc.",
    MSFT: "Microsoft Corporation",
    AMZN: "Amazon.com Inc.",
    GOOGL: "Alphabet Inc.",
    TSLA: "Tesla Inc.",
    NVDA: "NVIDIA Corporation",
    META: "Meta Platforms Inc.",
    JPM: "JPMorgan Chase & Co.",
    V: "Visa Inc.",
    WMT: "Walmart Inc.",
  }

  const cryptoNames: Record<string, string> = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    SOL: "Solana",
    BNB: "Binance Coin",
    XRP: "Ripple",
    ADA: "Cardano",
    DOT: "Polkadot",
    DOGE: "Dogecoin",
    AVAX: "Avalanche",
    MATIC: "Polygon",
  }

  return isCrypto ? cryptoNames[symbol] || symbol : stockNames[symbol] || symbol
}

// Enhanced mock data with more realistic news headlines
function getEnhancedMockSentimentData(query?: string | null): any[] {
  const symbols = query ? [query.toUpperCase()] : ["AAPL", "MSFT", "TSLA", "NVDA", "BTC", "ETH"]

  const mockData = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      sentiment: 78,
      trend: "bullish",
      headlines: [
        {
          title: "Apple's AI strategy could drive next wave of iPhone upgrades, analysts say",
          source: "Financial Times",
          sentiment: "positive",
          id: "news-a1",
        },
        {
          title: "Apple Vision Pro sales exceed expectations in first quarter",
          source: "Wall Street Journal",
          sentiment: "positive",
          id: "news-a2",
        },
        {
          title: "Apple's services revenue hits all-time high, boosting profit margins",
          source: "Bloomberg",
          sentiment: "positive",
          id: "news-a3",
        },
        {
          title: "Supply chain constraints may impact Apple's holiday quarter",
          source: "Reuters",
          sentiment: "negative",
          id: "news-a4",
        },
        {
          title: "Apple announces expanded partnership with OpenAI for iOS integration",
          source: "TechCrunch",
          sentiment: "positive",
          id: "news-a5",
        },
      ],
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      sentiment: 82,
      trend: "bullish",
      headlines: [
        {
          title: "Microsoft's Azure cloud growth accelerates, beating analyst estimates",
          source: "CNBC",
          sentiment: "positive",
          id: "news-m1",
        },
        {
          title: "Microsoft Copilot adoption driving productivity gains across enterprise customers",
          source: "ZDNet",
          sentiment: "positive",
          id: "news-m2",
        },
        {
          title: "Microsoft gaming division sees boost from Activision Blizzard acquisition",
          source: "The Verge",
          sentiment: "positive",
          id: "news-m3",
        },
        {
          title: "Microsoft faces new antitrust scrutiny in European markets",
          source: "Financial Times",
          sentiment: "negative",
          id: "news-m4",
        },
        {
          title: "Microsoft announces new AI data centers to meet growing demand",
          source: "TechCrunch",
          sentiment: "positive",
          id: "news-m5",
        },
      ],
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      sentiment: 62,
      trend: "neutral",
      headlines: [
        {
          title: "Tesla's Cybertruck production ramps up, meeting revised targets",
          source: "Reuters",
          sentiment: "positive",
          id: "news-t1",
        },
        {
          title: "Tesla faces increased competition in China's EV market",
          source: "Bloomberg",
          sentiment: "negative",
          id: "news-t2",
        },
        {
          title: "Tesla's Full Self-Driving software shows improvement in safety metrics",
          source: "Electrek",
          sentiment: "positive",
          id: "news-t3",
        },
        {
          title: "Elon Musk announces Tesla AI Day with robotics focus",
          source: "TechCrunch",
          sentiment: "positive",
          id: "news-t4",
        },
        {
          title: "Tesla's energy business grows as Powerwall demand surges",
          source: "CleanTechnica",
          sentiment: "positive",
          id: "news-t5",
        },
      ],
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      sentiment: 85,
      trend: "bullish",
      headlines: [
        {
          title: "NVIDIA unveils next-generation AI chips with 2x performance gains",
          source: "VentureBeat",
          sentiment: "positive",
          id: "news-n1",
        },
        {
          title: "NVIDIA's data center revenue doubles year-over-year on AI demand",
          source: "CNBC",
          sentiment: "positive",
          id: "news-n2",
        },
        {
          title: "NVIDIA partners with leading cloud providers on AI infrastructure",
          source: "ZDNet",
          sentiment: "positive",
          id: "news-n3",
        },
        {
          title: "Analysts raise NVIDIA price targets on continued AI momentum",
          source: "Barron's",
          sentiment: "positive",
          id: "news-n4",
        },
        {
          title: "NVIDIA faces supply constraints amid unprecedented chip demand",
          source: "Wall Street Journal",
          sentiment: "neutral",
          id: "news-n5",
        },
      ],
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      sentiment: 72,
      trend: "bullish",
      headlines: [
        {
          title: "Bitcoin ETF inflows reach new record as institutional adoption grows",
          source: "CoinDesk",
          sentiment: "positive",
          id: "news-b1",
        },
        {
          title: "Bitcoin mining difficulty hits all-time high as network security strengthens",
          source: "Bitcoin Magazine",
          sentiment: "positive",
          id: "news-b2",
        },
        {
          title: "Central banks increase Bitcoin reserves amid inflation concerns",
          source: "Financial Times",
          sentiment: "positive",
          id: "news-b3",
        },
        {
          title: "Bitcoin faces resistance at $80,000 level after recent rally",
          source: "CryptoNews",
          sentiment: "neutral",
          id: "news-b4",
        },
        {
          title: "Bitcoin's energy consumption decreases with shift to renewable sources",
          source: "Bloomberg",
          sentiment: "positive",
          id: "news-b5",
        },
      ],
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      sentiment: 76,
      trend: "bullish",
      headlines: [
        {
          title: "Ethereum's Layer 2 solutions see exponential growth in transaction volume",
          source: "Decrypt",
          sentiment: "positive",
          id: "news-e1",
        },
        {
          title: "Ethereum staking yields remain attractive as network participation grows",
          source: "CoinDesk",
          sentiment: "positive",
          id: "news-e2",
        },
        {
          title: "Ethereum developers approve next protocol upgrade with new scaling features",
          source: "The Block",
          sentiment: "positive",
          id: "news-e3",
        },
        {
          title: "Ethereum faces competition from alternative smart contract platforms",
          source: "CryptoSlate",
          sentiment: "negative",
          id: "news-e4",
        },
        {
          title: "Institutional Ethereum products see increased inflows following spot ETF approval",
          source: "Bloomberg",
          sentiment: "positive",
          id: "news-e5",
        },
      ],
    },
  ]

  if (query) {
    const matchedSymbol = mockData.find((item) => item.symbol === query.toUpperCase())
    return matchedSymbol ? [matchedSymbol] : []
  }

  return mockData
}

