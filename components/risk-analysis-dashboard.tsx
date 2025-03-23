"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, BarChart3, ChevronDown, ChevronUp, RefreshCw, Shield, TrendingDown } from "lucide-react"
import { PortfolioChart } from "@/components/portfolio-chart"

// Define types for our data
interface RiskMetric {
  id: string
  name: string
  value: number
  benchmark: number
  status: "low" | "medium" | "high"
  change: number
}

interface RiskFactor {
  id: string
  name: string
  impact: "low" | "medium" | "high"
  description: string
  recommendation: string
}

export function RiskAnalysisDashboard() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedFactors, setExpandedFactors] = useState<string[]>([])

  // Mock data for risk metrics
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([
    {
      id: "volatility",
      name: "Portfolio Volatility",
      value: 12.4,
      benchmark: 15.2,
      status: "medium",
      change: -1.2,
    },
    {
      id: "drawdown",
      name: "Maximum Drawdown",
      value: 8.7,
      benchmark: 12.5,
      status: "low",
      change: -2.3,
    },
    {
      id: "var",
      name: "Value at Risk (95%)",
      value: 3.2,
      benchmark: 4.1,
      status: "low",
      change: -0.5,
    },
    {
      id: "beta",
      name: "Portfolio Beta",
      value: 0.92,
      benchmark: 1.0,
      status: "medium",
      change: 0.03,
    },
    {
      id: "sharpe",
      name: "Sharpe Ratio",
      value: 1.8,
      benchmark: 1.5,
      status: "low",
      change: 0.2,
    },
    {
      id: "concentration",
      name: "Concentration Risk",
      value: 22.5,
      benchmark: 20.0,
      status: "medium",
      change: 1.5,
    },
  ])

  // Mock data for risk factors
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([
    {
      id: "factor-1",
      name: "Technology Sector Overexposure",
      impact: "medium",
      description:
        "Your portfolio has a 42% allocation to technology stocks, which is significantly higher than the benchmark allocation of 28%.",
      recommendation:
        "Consider reducing technology exposure by 5-10% and reallocating to underrepresented sectors like healthcare and consumer staples.",
    },
    {
      id: "factor-2",
      name: "Interest Rate Sensitivity",
      impact: "high",
      description:
        "Your fixed income holdings have an average duration of 8.2 years, making them vulnerable to interest rate increases.",
      recommendation:
        "Shift a portion of your bond allocation to shorter-duration bonds or floating-rate securities to reduce interest rate risk.",
    },
    {
      id: "factor-3",
      name: "Cryptocurrency Volatility",
      impact: "medium",
      description:
        "Your 8% allocation to cryptocurrencies introduces significant volatility to your portfolio, with potential drawdowns of 15-20%.",
      recommendation:
        "Consider implementing a stop-loss strategy for crypto holdings or reducing allocation to 5% of total portfolio.",
    },
    {
      id: "factor-4",
      name: "Geographic Concentration",
      impact: "low",
      description: "Your portfolio is 82% allocated to U.S. markets, limiting international diversification benefits.",
      recommendation: "Increase exposure to international developed and emerging markets to improve diversification.",
    },
  ])

  // Toggles expanded factor
  const toggleFactor = (id: string) => {
    setExpandedFactors((prev) => (prev.includes(id) ? prev.filter((factorId) => factorId !== id) : [...prev, id]))
  }

  // Simulates loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // If we're still loading
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border shadow-sm p-8 flex justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Loading Risk Analysis...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Overall Risk Score</div>
          <div className="text-2xl font-bold">68/100</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: "68%" }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            <span className="text-green-500">↓ 3 points</span> from last month
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Risk-Adjusted Return</div>
          <div className="text-2xl font-bold">+12.4%</div>
          <p className="text-xs text-gray-500">
            <span className="text-green-500">+2.1%</span> above benchmark
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Risk Factors Identified</div>
          <div className="text-2xl font-bold">{riskFactors.length}</div>
          <p className="text-xs text-gray-500">
            <span className="text-amber-500">{riskFactors.filter((f) => f.impact === "high").length} high impact</span>{" "}
            factors to address
          </p>
        </div>
      </div>

      {/* Risk Distribution Chart */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Risk Distribution Analysis</h3>
        </div>
        <div className="h-64">
          <PortfolioChart type="bar" height={250} showAxis={false} />
        </div>
        <div className="mt-2 text-sm text-gray-500 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
            <span>Your Portfolio</span>
            <div className="h-3 w-3 rounded-full bg-gray-300 ml-4"></div>
            <span>Benchmark</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Risk Analysis Dashboard</h2>
              <p className="text-sm text-gray-500">Comprehensive risk assessment and management</p>
            </div>
            <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm flex items-center gap-1 hover:bg-primary/90">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh Analysis
            </button>
          </div>
        </div>

        <div className="border-b">
          <div className="flex">
            {["overview", "metrics", "factors"].map((tab) => (
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
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Key Risk Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-medium flex items-center">
                      <Shield className="h-5 w-5 text-green-500 mr-2" />
                      Portfolio Strengths
                    </h4>
                    <ul className="mt-2 space-y-2">
                      <li className="text-sm flex items-start">
                        <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        </div>
                        <span>Diversification across 8 sectors reduces specific sector risk</span>
                      </li>
                      <li className="text-sm flex items-start">
                        <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        </div>
                        <span>Lower volatility than benchmark (12.4% vs 15.2%)</span>
                      </li>
                      <li className="text-sm flex items-start">
                        <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        </div>
                        <span>Strong Sharpe ratio of 1.8 indicates good risk-adjusted returns</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-medium flex items-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                      Areas for Improvement
                    </h4>
                    <ul className="mt-2 space-y-2">
                      <li className="text-sm flex items-start">
                        <div className="h-4 w-4 rounded-full bg-amber-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        </div>
                        <span>Technology sector overexposure (42% vs benchmark 28%)</span>
                      </li>
                      <li className="text-sm flex items-start">
                        <div className="h-4 w-4 rounded-full bg-amber-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        </div>
                        <span>High interest rate sensitivity in fixed income holdings</span>
                      </li>
                      <li className="text-sm flex items-start">
                        <div className="h-4 w-4 rounded-full bg-amber-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        </div>
                        <span>Limited international diversification (82% U.S. exposure)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Top Risk Factors</h3>
                <div className="space-y-3">
                  {riskFactors
                    .filter((factor) => factor.impact === "high")
                    .map((factor) => (
                      <div key={factor.id} className="p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                            <div>
                              <div className="font-medium">{factor.name}</div>
                              <div className="text-xs text-gray-500">{factor.description}</div>
                            </div>
                          </div>
                          <div className="text-sm text-red-600 font-medium">High Impact</div>
                        </div>
                        <div className="mt-2 text-sm bg-white p-2 rounded border border-red-100">
                          <span className="font-medium">Recommendation:</span> {factor.recommendation}
                        </div>
                      </div>
                    ))}

                  {riskFactors
                    .filter((factor) => factor.impact === "medium")
                    .slice(0, 1)
                    .map((factor) => (
                      <div key={factor.id} className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                            <div>
                              <div className="font-medium">{factor.name}</div>
                              <div className="text-xs text-gray-500">{factor.description}</div>
                            </div>
                          </div>
                          <div className="text-sm text-amber-600 font-medium">Medium Impact</div>
                        </div>
                        <div className="mt-2 text-sm bg-white p-2 rounded border border-amber-100">
                          <span className="font-medium">Recommendation:</span> {factor.recommendation}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "metrics" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Risk Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {riskMetrics.map((metric) => (
                  <div key={metric.id} className="border rounded-lg overflow-hidden">
                    <div className="p-3 bg-gray-50 border-b">
                      <h4 className="font-medium">{metric.name}</h4>
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold">{metric.value}%</div>
                        <div
                          className={`flex items-center text-sm ${
                            metric.change < 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {metric.change < 0 ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                          {Math.abs(metric.change)}%
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="text-xs text-gray-500 mb-1">Compared to Benchmark ({metric.benchmark}%)</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              metric.status === "low"
                                ? "bg-green-500"
                                : metric.status === "medium"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${(metric.value / metric.benchmark) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs">
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            metric.status === "low"
                              ? "bg-green-100 text-green-800"
                              : metric.status === "medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)} Risk
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "factors" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Risk Factors</h3>
              <div className="space-y-3">
                {riskFactors.map((factor) => (
                  <div
                    key={factor.id}
                    className={`border rounded-lg overflow-hidden ${
                      factor.impact === "high"
                        ? "border-red-200"
                        : factor.impact === "medium"
                          ? "border-amber-200"
                          : "border-gray-200"
                    }`}
                  >
                    <div
                      className={`p-3 flex justify-between items-center cursor-pointer ${
                        factor.impact === "high"
                          ? "bg-red-50"
                          : factor.impact === "medium"
                            ? "bg-amber-50"
                            : "bg-gray-50"
                      }`}
                      onClick={() => toggleFactor(factor.id)}
                    >
                      <div className="flex items-center">
                        {factor.impact === "high" ? (
                          <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                        ) : factor.impact === "medium" ? (
                          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                        ) : (
                          <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                        )}
                        <h4 className="font-medium">{factor.name}</h4>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full mr-2 ${
                            factor.impact === "high"
                              ? "bg-red-100 text-red-800"
                              : factor.impact === "medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {factor.impact.charAt(0).toUpperCase() + factor.impact.slice(1)} Impact
                        </span>
                        {expandedFactors.includes(factor.id) ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </div>
                    {expandedFactors.includes(factor.id) && (
                      <div className="p-3 bg-white">
                        <div className="text-sm text-gray-600 mb-3">{factor.description}</div>
                        <div
                          className={`text-sm p-2 rounded ${
                            factor.impact === "high"
                              ? "bg-red-50 border border-red-100"
                              : factor.impact === "medium"
                                ? "bg-amber-50 border border-amber-100"
                                : "bg-blue-50 border border-blue-100"
                          }`}
                        >
                          <span className="font-medium">Recommendation:</span> {factor.recommendation}
                        </div>
                      </div>
                    )}
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

