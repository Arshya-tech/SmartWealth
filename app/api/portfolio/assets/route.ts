import { NextResponse } from "next/server"
import { fetchAlphaVantage } from "@/config/api-config"

export async function GET() {
  try {
    // Gets stock data for popular stocks
    const stockSymbols = ["AAPL", "MSFT", "AMZN", "GOOGL", "TSLA", "NVDA", "META", "JPM", "V", "WMT"]
    const stockPromises = stockSymbols.map((symbol) => fetchAlphaVantage("GLOBAL_QUOTE", { symbol }))

    // Gets crypto data for popular cryptocurrencies
    const cryptoSymbols = ["BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "DOT", "DOGE", "AVAX", "MATIC"]
    const cryptoPromises = cryptoSymbols.map((symbol) =>
      fetchAlphaVantage("CURRENCY_EXCHANGE_RATE", {
        from_currency: symbol,
        to_currency: "USD",
      }),
    )

    // Waits for all API calls to complete
    const stockResults = await Promise.all(stockPromises)
    const cryptoResults = await Promise.all(cryptoPromises)

    // Transforms stock data to our format
    const stockAssets = stockResults
      .map((result, index) => {
        const quote = result["Global Quote"]
        if (!quote) return null

        const price = Number.parseFloat(quote["05. price"])
        const prevClose = Number.parseFloat(quote["08. previous close"])
        const change = ((price - prevClose) / prevClose) * 100

        return {
          id: `stock-${stockSymbols[index]}`,
          name: getFullNameForSymbol(stockSymbols[index]),
          symbol: stockSymbols[index],
          type: "stock",
          price,
          change,
          allocation: getStockAllocation(index), // More realistic allocation
          risk: index < 3 ? "low" : index < 7 ? "medium" : "high",
        }
      })
      .filter(Boolean)

    // Transforms crypto data to our format
    const cryptoAssets = cryptoResults
      .map((result, index) => {
        const exchangeRate = result["Realtime Currency Exchange Rate"]
        if (!exchangeRate) return null

        const price = Number.parseFloat(exchangeRate["5. Exchange Rate"])

        return {
          id: `crypto-${cryptoSymbols[index]}`,
          name: getFullNameForSymbol(cryptoSymbols[index], true),
          symbol: cryptoSymbols[index],
          type: "crypto",
          price,
          change: getCryptoChange(index), // More realistic change values
          allocation: getCryptoAllocation(index), // More realistic allocation
          risk: "high",
        }
      })
      .filter(Boolean)

    // If API calls failed, use enhanced mock data
    if (stockAssets.length === 0 && cryptoAssets.length === 0) {
      return NextResponse.json(getEnhancedMockAssets())
    }

    // Combine and return all assets
    return NextResponse.json([...stockAssets, ...cryptoAssets])
  } catch (error) {
    console.error("Error fetching portfolio assets:", error)
    return NextResponse.json(getEnhancedMockAssets(), { status: 200 })
  }
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

// Helper function for more realistic stock allocations
function getStockAllocation(index: number): number {
  const allocations = [18, 15, 12, 10, 8, 7, 6, 5, 4, 3]
  return allocations[index] || 2
}

// Helper function for more realistic crypto allocations
function getCryptoAllocation(index: number): number {
  const allocations = [5, 3, 1.5, 1, 0.5, 0.4, 0.3, 0.2, 0.1, 0.1]
  return allocations[index] || 0.1
}

// Helper function for more realistic crypto price changes
function getCryptoChange(index: number): number {
  // More volatile than stocks
  const changes = [4.2, 3.8, -2.7, 5.1, -3.2, 2.9, -1.8, 6.3, -4.5, 3.1]
  return changes[index] || Math.random() * 10 - 5
}

// Enhanced mock assets with more realistic data
function getEnhancedMockAssets() {
  return [
    {
      id: "stock-AAPL",
      name: "Apple Inc.",
      symbol: "AAPL",
      type: "stock",
      price: 189.84,
      change: 1.23,
      allocation: 18,
      risk: "low",
    },
    {
      id: "stock-MSFT",
      name: "Microsoft Corporation",
      symbol: "MSFT",
      type: "stock",
      price: 417.88,
      change: 0.78,
      allocation: 15,
      risk: "low",
    },
    {
      id: "stock-AMZN",
      name: "Amazon.com Inc.",
      symbol: "AMZN",
      type: "stock",
      price: 178.75,
      change: -0.45,
      allocation: 12,
      risk: "low",
    },
    {
      id: "stock-GOOGL",
      name: "Alphabet Inc.",
      symbol: "GOOGL",
      type: "stock",
      price: 164.32,
      change: 1.05,
      allocation: 10,
      risk: "medium",
    },
    {
      id: "stock-TSLA",
      name: "Tesla Inc.",
      symbol: "TSLA",
      type: "stock",
      price: 175.34,
      change: -1.87,
      allocation: 8,
      risk: "medium",
    },
    {
      id: "stock-NVDA",
      name: "NVIDIA Corporation",
      symbol: "NVDA",
      type: "stock",
      price: 950.02,
      change: 2.34,
      allocation: 7,
      risk: "medium",
    },
    {
      id: "stock-META",
      name: "Meta Platforms Inc.",
      symbol: "META",
      type: "stock",
      price: 485.39,
      change: 1.56,
      allocation: 6,
      risk: "medium",
    },
    {
      id: "stock-JPM",
      name: "JPMorgan Chase & Co.",
      symbol: "JPM",
      type: "stock",
      price: 198.47,
      change: 0.32,
      allocation: 5,
      risk: "high",
    },
    {
      id: "stock-V",
      name: "Visa Inc.",
      symbol: "V",
      type: "stock",
      price: 275.96,
      change: 0.18,
      allocation: 4,
      risk: "high",
    },
    {
      id: "stock-WMT",
      name: "Walmart Inc.",
      symbol: "WMT",
      type: "stock",
      price: 68.89,
      change: 0.67,
      allocation: 3,
      risk: "high",
    },
    {
      id: "crypto-BTC",
      name: "Bitcoin",
      symbol: "BTC",
      type: "crypto",
      price: 67245.78,
      change: 4.2,
      allocation: 5,
      risk: "high",
    },
    {
      id: "crypto-ETH",
      name: "Ethereum",
      symbol: "ETH",
      type: "crypto",
      price: 3478.92,
      change: 3.8,
      allocation: 3,
      risk: "high",
    },
    {
      id: "crypto-SOL",
      name: "Solana",
      symbol: "SOL",
      type: "crypto",
      price: 142.67,
      change: -2.7,
      allocation: 1.5,
      risk: "high",
    },
    {
      id: "crypto-BNB",
      name: "Binance Coin",
      symbol: "BNB",
      type: "crypto",
      price: 578.34,
      change: 5.1,
      allocation: 1,
      risk: "high",
    },
    {
      id: "crypto-XRP",
      name: "Ripple",
      symbol: "XRP",
      type: "crypto",
      price: 0.5423,
      change: -3.2,
      allocation: 0.5,
      risk: "high",
    },
  ]
}

