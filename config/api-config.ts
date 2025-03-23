// API Configuration
// Using Alpha Vantage for both financial data and sentiment analysis
// Using Alchemy for blockchain/Web3 functionality

export const API_CONFIG = {
  // Alpha Vantage API for financial data and sentiment analysis
  FINANCIAL_API_KEY: process.env.FINANCIAL_API_KEY || "",
  ALPHA_VANTAGE_BASE_URL: "https://www.alphavantage.co/query",

  // Alchemy API for blockchain/Web3 data
  BLOCKCHAIN_API_KEY: process.env.BLOCKCHAIN_API_KEY || "",
  ALCHEMY_BASE_URL: "https://eth-mainnet.g.alchemy.com/v2",
}

// API request helpers
export async function fetchFromAPI(url: string, options = {}) {
  try {
    console.log(`Fetching from: ${url}`)
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        // Add any API-specific headers here
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    // Check if the response is JSON by looking at the content-type header
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      // For internal API routes, we'll use mock data if the endpoint doesn't exist
      if (url.startsWith("/api/")) {
        console.warn(`API endpoint ${url} returned non-JSON response. Using mock data instead.`)
        return getMockDataForEndpoint(url)
      } else {
        throw new Error(`API returned non-JSON response: ${contentType}`)
      }
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)

    // For internal API routes, use mock data as fallback
    if (url.startsWith("/api/")) {
      console.warn(`API request to ${url} failed. Using mock data instead.`)
      return getMockDataForEndpoint(url)
    }

    throw error
  }
}

// Alpha Vantage API helpers
export async function fetchAlphaVantage(function_name: string, params: Record<string, string>) {
  const queryParams = new URLSearchParams({
    function: function_name,
    apikey: API_CONFIG.FINANCIAL_API_KEY,
    ...params,
  })

  try {
    return await fetchFromAPI(`${API_CONFIG.ALPHA_VANTAGE_BASE_URL}?${queryParams}`)
  } catch (error) {
    console.error(`Alpha Vantage API request failed for function ${function_name}:`, error)
    // Return mock data based on the function
    return getMockAlphaVantageData(function_name, params)
  }
}

// Alchemy API helpers
export async function fetchAlchemy(endpoint: string, method = "GET", body?: any) {
  // For this simplified version, we'll just return mock data directly
  // This avoids issues with the Alchemy API configuration
  console.log(`Using mock data for Alchemy API request to ${endpoint}`)
  return getMockAlchemyData(endpoint, body)

  /* 
  // Original implementation - commented out to avoid API errors
  const url = `${API_CONFIG.ALCHEMY_BASE_URL}/${API_CONFIG.BLOCKCHAIN_API_KEY}${endpoint}`;

  try {
    return await fetchFromAPI(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    console.error(`Alchemy API request failed for endpoint ${endpoint}:`, error);
    // Return mock data for Alchemy
    return getMockAlchemyData(endpoint);
  }
  */
}

// Mock data helpers
function getMockDataForEndpoint(url: string) {
  // Extract the endpoint path
  const path = new URL(url, "http://localhost").pathname

  // Portfolio endpoints
  if (path === "/api/portfolio/assets") {
    return getMockPortfolioAssets()
  } else if (path === "/api/portfolio/stats") {
    return getMockPortfolioStats()
  } else if (path === "/api/portfolio/adjustments") {
    return getMockPortfolioAdjustments()
  }

  // Sentiment endpoints
  else if (path === "/api/sentiment/market-sentiment") {
    return getMockMarketSentiment()
  } else if (path === "/api/sentiment/sentiment-sources") {
    return getMockSentimentSources()
  }

  // Blockchain endpoints
  else if (path === "/api/blockchain/contracts") {
    return getMockBlockchainContracts()
  } else if (path === "/api/blockchain/stats") {
    return getMockBlockchainStats()
  }

  // Default empty response
  return {}
}

// Mock data for Alpha Vantage
function getMockAlphaVantageData(function_name: string, params: Record<string, string>) {
  if (function_name === "GLOBAL_QUOTE") {
    const symbol = params.symbol || "UNKNOWN"
    return {
      "Global Quote": {
        "01. symbol": symbol,
        "02. open": "150.0",
        "03. high": "155.0",
        "04. low": "148.0",
        "05. price": "152.50",
        "06. volume": "1000000",
        "07. latest trading day": "2023-05-12",
        "08. previous close": "149.50",
        "09. change": "3.00",
        "10. change percent": "2.0067%",
      },
    }
  } else if (function_name === "CURRENCY_EXCHANGE_RATE") {
    const fromCurrency = params.from_currency || "BTC"
    return {
      "Realtime Currency Exchange Rate": {
        "1. From_Currency Code": fromCurrency,
        "2. From_Currency Name": fromCurrency === "BTC" ? "Bitcoin" : "Cryptocurrency",
        "3. To_Currency Code": "USD",
        "4. To_Currency Name": "United States Dollar",
        "5. Exchange Rate": fromCurrency === "BTC" ? "30000.00000000" : "2000.00000000",
        "6. Last Refreshed": "2023-05-12 12:00:00 UTC",
        "7. Time Zone": "UTC",
        "8. Bid Price": fromCurrency === "BTC" ? "29990.00000000" : "1990.00000000",
        "9. Ask Price": fromCurrency === "BTC" ? "30010.00000000" : "2010.00000000",
      },
    }
  } else if (function_name === "NEWS_SENTIMENT") {
    const ticker = params.tickers || "AAPL"
    return {
      feed: [
        {
          title: `Positive news about ${ticker}`,
          url: "https://example.com/news/1",
          time_published: "20230512T120000",
          authors: ["Author One"],
          summary: `${ticker} is performing well in the market.`,
          source: "Financial News",
          category_within_source: "Technology",
          source_domain: "example.com",
          ticker_sentiment: [
            {
              ticker: ticker,
              relevance_score: "0.8",
              ticker_sentiment_score: "0.6",
              ticker_sentiment_label: "Positive",
            },
          ],
        },
        {
          title: `Market analysis for ${ticker}`,
          url: "https://example.com/news/2",
          time_published: "20230512T110000",
          authors: ["Author Two"],
          summary: `Analysis shows ${ticker} has strong fundamentals.`,
          source: "Market Analysis",
          category_within_source: "Stocks",
          source_domain: "example.com",
          ticker_sentiment: [
            {
              ticker: ticker,
              relevance_score: "0.9",
              ticker_sentiment_score: "0.4",
              ticker_sentiment_label: "Somewhat Positive",
            },
          ],
        },
      ],
    }
  }

  // Default empty response
  return {}
}

// Mock data for Alchemy
function getMockAlchemyData(endpoint: string, body?: any) {
  if (endpoint.includes("getBalance") || (body && body.method === "eth_getBalance")) {
    return {
      jsonrpc: "2.0",
      id: 1,
      result: "0x4563918244f40000", // 5 ETH in hex
    }
  }

  // Default empty response
  return {}
}

// Mock portfolio assets
function getMockPortfolioAssets() {
  return [
    {
      id: "stock-AAPL",
      name: "Apple Inc.",
      symbol: "AAPL",
      type: "stock",
      price: 152.5,
      change: 2.01,
      allocation: 20,
      risk: "low",
    },
    {
      id: "stock-MSFT",
      name: "Microsoft Corporation",
      symbol: "MSFT",
      type: "stock",
      price: 290.75,
      change: 1.25,
      allocation: 18,
      risk: "low",
    },
    {
      id: "stock-AMZN",
      name: "Amazon.com Inc.",
      symbol: "AMZN",
      type: "stock",
      price: 3250.0,
      change: -0.75,
      allocation: 16,
      risk: "medium",
    },
    {
      id: "stock-GOOGL",
      name: "Alphabet Inc.",
      symbol: "GOOGL",
      type: "stock",
      price: 2750.25,
      change: 0.5,
      allocation: 14,
      risk: "medium",
    },
    {
      id: "stock-TSLA",
      name: "Tesla Inc.",
      symbol: "TSLA",
      type: "stock",
      price: 750.8,
      change: -1.2,
      allocation: 12,
      risk: "high",
    },
    {
      id: "crypto-BTC",
      name: "Bitcoin",
      symbol: "BTC",
      type: "crypto",
      price: 30000.0,
      change: 3.5,
      allocation: 10,
      risk: "high",
    },
    {
      id: "crypto-ETH",
      name: "Ethereum",
      symbol: "ETH",
      type: "crypto",
      price: 2000.0,
      change: 2.75,
      allocation: 8,
      risk: "high",
    },
    {
      id: "crypto-SOL",
      name: "Solana",
      symbol: "SOL",
      type: "crypto",
      price: 45.25,
      change: -1.5,
      allocation: 6,
      risk: "high",
    },
  ]
}

// Mock portfolio stats
function getMockPortfolioStats() {
  return {
    totalValue: 124567.89,
    monthlyReturn: 3245.67,
    monthlyReturnPercentage: 2.5,
    riskScore: 68,
  }
}

// Mock portfolio adjustments
function getMockPortfolioAdjustments() {
  return [
    {
      action: "Increased Bitcoin allocation by 2%",
      reason: "Based on positive market sentiment from Alpha Vantage news analysis",
    },
    {
      action: "Reduced Tesla exposure by 1.5%",
      reason: "Due to increased volatility detected in recent market data",
    },
  ]
}

// Mock market sentiment
function getMockMarketSentiment() {
  return [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      sentiment: 75,
      trend: "bullish",
      headlines: [
        {
          title: "Apple's new product line exceeds expectations",
          source: "Financial Times",
          sentiment: "positive",
          id: "news-1",
        },
        {
          title: "Analysts raise price targets for Apple stock",
          source: "Wall Street Journal",
          sentiment: "positive",
          id: "news-2",
        },
      ],
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      sentiment: 68,
      trend: "bullish",
      headlines: [
        {
          title: "Microsoft cloud services see strong growth",
          source: "CNBC",
          sentiment: "positive",
          id: "news-3",
        },
        {
          title: "Microsoft announces new AI features",
          source: "TechCrunch",
          sentiment: "positive",
          id: "news-4",
        },
      ],
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      sentiment: 45,
      trend: "neutral",
      headlines: [
        {
          title: "Tesla faces production challenges",
          source: "Reuters",
          sentiment: "negative",
          id: "news-5",
        },
        {
          title: "Tesla expands into new markets",
          source: "Bloomberg",
          sentiment: "positive",
          id: "news-6",
        },
      ],
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      sentiment: 62,
      trend: "bullish",
      headlines: [
        {
          title: "Institutional investors increase Bitcoin holdings",
          source: "CoinDesk",
          sentiment: "positive",
          id: "news-7",
        },
        {
          title: "Bitcoin volatility concerns some analysts",
          source: "Crypto News",
          sentiment: "neutral",
          id: "news-8",
        },
      ],
    },
  ]
}

// Mock sentiment sources
function getMockSentimentSources() {
  return {
    news: 72,
    social: 78,
    financial: 65,
  }
}

// Mock blockchain contracts
export function getMockBlockchainContracts() {
  return [
    {
      id: "742d35",
      name: "Investment Pool Alpha",
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      balance: 5.0,
      createdAt: "2023-09-15T14:30:00Z",
      transactions: [
        { id: "tx1", type: "deposit", amount: 5, timestamp: "2023-09-15T14:30:00Z", status: "confirmed" },
        { id: "tx2", type: "deposit", amount: 7.5, timestamp: "2023-10-01T10:15:00Z", status: "confirmed" },
        { id: "tx3", type: "fee", amount: 0.05, timestamp: "2023-10-15T08:45:00Z", status: "confirmed" },
      ],
    },
    {
      id: "8fD00f",
      name: "Crypto Growth Fund",
      address: "0x8fD00f170FDf3772C5ebdCD90bF257316c69BA45",
      balance: 3.8,
      createdAt: "2023-11-20T09:45:00Z",
      transactions: [
        { id: "tx4", type: "deposit", amount: 2, timestamp: "2023-11-20T09:45:00Z", status: "confirmed" },
        { id: "tx5", type: "deposit", amount: 1.5, timestamp: "2023-12-05T16:20:00Z", status: "confirmed" },
        { id: "tx6", type: "profit", amount: 0.3, timestamp: "2024-01-10T11:30:00Z", status: "confirmed" },
      ],
    },
  ]
}

// Mock blockchain stats
function getMockBlockchainStats() {
  return {
    totalValueLocked: 16.23,
    activeContracts: 2,
    totalTransactions: 7,
    monthlyGrowth: 4.2,
  }
}

