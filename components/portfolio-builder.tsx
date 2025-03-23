"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Bitcoin, DollarSign, RefreshCw, LineChart, BarChart, PieChart } from "lucide-react"
import { fetchFromAPI } from "@/config/api-config"
import { PortfolioChart } from "@/components/portfolio-chart"

// Define types for our data
interface Asset {
  id: string
  name: string
  symbol: string
  type: "stock" | "crypto"
  price: number
  change: number
  allocation: number
  risk: "low" | "medium" | "high"
}

interface PortfolioStats {
  totalValue: number
  monthlyReturn: number
  monthlyReturnPercentage: number
  riskScore: number
  historicalPerformance?: { month: string; value: number }[]
  sectorAllocation?: { sector: string; percentage: number }[]
}

interface Adjustment {
  action: string
  reason: string
}

export function PortfolioBuilder() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line")

  // State for API data
  const [assets, setAssets] = useState<Asset[]>([])
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats | null>(null)
  const [recentAdjustments, setRecentAdjustments] = useState<Adjustment[]>([])

  // State for chart data
  const [portfolioData, setPortfolioData] = useState<any>({
    line: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Portfolio Value",
          data: [112000, 118000, 115000, 119000, 125000, 132000, 138000, 135000, 142000, 147000, 153000, 159000],
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          borderWidth: 3,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
        },
      ],
    },
    bar: {
      labels: ["AAPL", "MSFT", "NVDA", "TSLA", "AMZN", "BTC"],
      datasets: [
        {
          label: "Monthly Return (%)",
          data: [3.2, 2.8, 5.1, -1.2, 1.8, 4.5],
          backgroundColor: [
            "rgba(245, 158, 11, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(239, 68, 68, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(245, 158, 11, 0.8)",
          ],
          borderWidth: 0,
          borderRadius: 4,
        },
      ],
    },
    pie: {
      labels: ["Technology", "Finance", "Healthcare", "Consumer", "Energy", "Other"],
      datasets: [
        {
          label: "Sector Allocation",
          data: [40, 20, 15, 12, 8, 5],
          backgroundColor: [
            "rgba(245, 158, 11, 0.8)",
            "rgba(245, 158, 11, 0.6)",
            "rgba(245, 158, 11, 0.4)",
            "rgba(59, 130, 246, 0.6)",
            "rgba(16, 185, 129, 0.6)",
            "rgba(107, 114, 128, 0.6)",
          ],
          borderWidth: 0,
        },
      ],
    },
  })

  // Format helpers
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatPercentage = (value: number) => `${value.toFixed(2)}%`

  // Fetches portfolio data from API
  const fetchPortfolioData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Replaces these with your actual API endpoints
      const assetsData = await fetchFromAPI(`/api/portfolio/assets`)
      const statsData = await fetchFromAPI(`/api/portfolio/stats`)
      const adjustmentsData = await fetchFromAPI(`/api/portfolio/adjustments`)

      setAssets(assetsData)
      setPortfolioStats(statsData)
      setRecentAdjustments(adjustmentsData)

      // Adds this line at the end of the try block in fetchPortfolioData
      preparePortfolioData(assetsData, statsData)
    } catch (err) {
      setError("Failed to load portfolio data. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Prepares portfolio data for different chart types
  const preparePortfolioData = (assetsData: Asset[], statsData: PortfolioStats | null) => {
    // Create updated data object
    const updatedData = { ...portfolioData }

    // Updates line chart data if we have historical performance
    if (statsData?.historicalPerformance) {
      updatedData.line = {
        labels: statsData.historicalPerformance.map((item) => item.month),
        datasets: [
          {
            label: "Portfolio Value",
            data: statsData.historicalPerformance.map((item) => item.value),
            borderColor: "#f59e0b",
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            borderWidth: 3,
            pointRadius: 0,
            tension: 0.4,
            fill: true,
          },
        ],
      }
    }

    // Updates bar chart data with top performers
    if (assetsData.length > 0) {
      const topAssets = [...assetsData].sort((a, b) => b.change - a.change).slice(0, 6)
      updatedData.bar = {
        labels: topAssets.map((asset) => asset.symbol),
        datasets: [
          {
            label: "Monthly Change (%)",
            data: topAssets.map((asset) => asset.change),
            backgroundColor: topAssets.map((asset) =>
              asset.change >= 0 ? "rgba(52, 211, 153, 0.8)" : "rgba(239, 68, 68, 0.8)",
            ),
            borderWidth: 0,
            borderRadius: 4,
          },
        ],
      }
    }

    // Updates pie chart data with sector allocation
    if (statsData?.sectorAllocation) {
      updatedData.pie = {
        labels: statsData.sectorAllocation.map((item) => item.sector),
        datasets: [
          {
            label: "Sector Allocation",
            data: statsData.sectorAllocation.map((item) => item.percentage),
            backgroundColor: [
              "rgba(245, 158, 11, 0.8)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(16, 185, 129, 0.8)",
              "rgba(139, 92, 246, 0.8)",
              "rgba(239, 68, 68, 0.8)",
              "rgba(107, 114, 128, 0.8)",
            ],
            borderWidth: 0,
          },
        ],
      }
    }

    setPortfolioData(updatedData)
  }

  // Initial data load
  useEffect(() => {
    fetchPortfolioData()
  }, [])

  // Handles refresh button click
  const handleRefreshPortfolio = () => {
    fetchPortfolioData()
  }

  // If we're still loading and have no data
  if (loading && !portfolioStats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg border shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg border shadow-sm p-8 flex justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  // If there was an error
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>{error}</p>
        <button
          onClick={fetchPortfolioData}
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md text-red-800"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {portfolioStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Portfolio Value</div>
            <div className="text-2xl font-bold">{formatCurrency(portfolioStats.totalValue)}</div>
            <p className="text-xs text-gray-500">
              <span className="text-green-500">↑ {portfolioStats.monthlyReturnPercentage}%</span> from last month
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Monthly Return</div>
            <div className="text-2xl font-bold">{formatCurrency(portfolioStats.monthlyReturn)}</div>
            <p className="text-xs text-gray-500">
              <span className="text-green-500">
                ↑ {((portfolioStats.monthlyReturn / portfolioStats.totalValue) * 100).toFixed(1)}%
              </span>{" "}
              return rate
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Risk Score</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{portfolioStats.riskScore}/100</div>
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                {portfolioStats.riskScore < 30
                  ? "Conservative"
                  : portfolioStats.riskScore < 70
                    ? "Moderate"
                    : "Aggressive"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${portfolioStats.riskScore}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Chart */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Portfolio Performance</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType("line")}
              className={`p-1 rounded-md ${chartType === "line" ? "bg-primary/20 text-primary" : "bg-gray-100 text-gray-500"}`}
            >
              <LineChart className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`p-1 rounded-md ${chartType === "bar" ? "bg-primary/20 text-primary" : "bg-gray-100 text-gray-500"}`}
            >
              <BarChart className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType("pie")}
              className={`p-1 rounded-md ${chartType === "pie" ? "bg-primary/20 text-primary" : "bg-gray-100 text-gray-500"}`}
            >
              <PieChart className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="h-64">
          {chartType === "line" && (
            <PortfolioChart type="line" height={250} showAxis={true} data={portfolioData.line} />
          )}
          {chartType === "bar" && <PortfolioChart type="bar" height={250} showAxis={true} data={portfolioData.bar} />}
          {chartType === "pie" && <PortfolioChart type="pie" height={250} showAxis={false} data={portfolioData.pie} />}
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Your SmartWealth Portfolio</h2>
              <p className="text-sm text-gray-500">Auto-adjusts based on market trends and your risk profile</p>
            </div>
            <button
              className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm flex items-center gap-1 hover:bg-primary/90"
              onClick={handleRefreshPortfolio}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" /> Refresh
                </>
              )}
            </button>
          </div>
        </div>

        <div className="border-b">
          <div className="flex">
            {["overview", "stocks", "crypto"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Asset Allocation</h3>
                {/* Asset allocation chart - Will be populated with API data */}
                <div className="space-y-4">
                  {/* Calculate stock allocation */}
                  {(() => {
                    const stockAllocation = assets
                      .filter((asset) => asset.type === "stock")
                      .reduce((sum, asset) => sum + asset.allocation, 0)

                    const cryptoAllocation = assets
                      .filter((asset) => asset.type === "crypto")
                      .reduce((sum, asset) => sum + asset.allocation, 0)

                    return (
                      <>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                            <span>Stocks</span>
                          </div>
                          <span>{stockAllocation}%</span>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stockAllocation}%` }}></div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                            <span>Crypto</span>
                          </div>
                          <span>{cryptoAllocation}%</span>
                        </div>
                        <div className="w-full bg-purple-100 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${cryptoAllocation}%` }}
                          ></div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Top Performers</h3>
                <div className="space-y-3">
                  {/* Top performers list - Will be populated with API data */}
                  {assets
                    .sort((a, b) => b.change - a.change)
                    .slice(0, 3)
                    .map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${asset.type === "crypto" ? "bg-purple-100" : "bg-blue-100"}`}
                          >
                            {asset.type === "crypto" ? (
                              <Bitcoin className="h-5 w-5 text-purple-500" />
                            ) : (
                              <DollarSign className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-xs text-gray-500">{asset.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(asset.price)}</div>
                          <div className={`text-xs ${asset.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {asset.change >= 0 ? "↑" : "↓"} {formatPercentage(Math.abs(asset.change))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <h3 className="text-lg font-medium mb-4 mt-6">Recent AI Adjustments</h3>
                <div className="space-y-3">
                  {/* Recent adjustments - Will be populated with API data */}
                  {recentAdjustments.map((adjustment, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-center text-green-700 text-sm font-medium">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        {adjustment.action}
                      </div>
                      <div className="text-xs text-green-600 mt-1">{adjustment.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "stocks" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Stock Holdings</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {assets.filter((asset) => asset.type === "stock").reduce((sum, asset) => sum + asset.allocation, 0)}%
                  of Portfolio
                </span>
              </div>

              <div className="space-y-3">
                {/* Stock assets - Will be populated with API data */}
                {assets
                  .filter((asset) => asset.type === "stock")
                  .map((asset) => (
                    <div key={asset.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-blue-100">
                            <DollarSign className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-xs text-gray-500">{asset.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(asset.price)}</div>
                          <div className={`text-xs ${asset.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {asset.change >= 0 ? "↑" : "↓"} {formatPercentage(Math.abs(asset.change))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === "crypto" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Crypto Holdings</h3>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  {assets.filter((asset) => asset.type === "crypto").reduce((sum, asset) => sum + asset.allocation, 0)}%
                  of Portfolio
                </span>
              </div>

              <div className="space-y-3">
                {/* Crypto assets - Will be populated with API data */}
                {assets
                  .filter((asset) => asset.type === "crypto")
                  .map((asset) => (
                    <div key={asset.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-purple-100">
                            <Bitcoin className="h-5 w-5 text-purple-500" />
                          </div>
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-xs text-gray-500">{asset.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(asset.price)}</div>
                          <div className={`text-xs ${asset.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {asset.change >= 0 ? "↑" : "↓"} {formatPercentage(Math.abs(asset.change))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PortfolioBuilder

