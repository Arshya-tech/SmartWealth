"use client"

import { useState, useEffect } from "react"
import { Check, Clock, RefreshCw, Settings, Sliders } from "lucide-react"
import { PortfolioChart } from "@/components/portfolio-chart"

// Define types for our data
interface AdjustmentRule {
  id: string
  name: string
  description: string
  trigger: string
  action: string
  status: "active" | "paused"
}

interface RecentAdjustment {
  id: string
  date: string
  description: string
  impact: string
  status: "completed" | "pending" | "failed"
}

export function AutoAdjustDashboard() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for adjustment rules
  const [adjustmentRules, setAdjustmentRules] = useState<AdjustmentRule[]>([
    {
      id: "rule-1",
      name: "Market Volatility Protection",
      description: "Automatically adjust portfolio when market volatility exceeds threshold",
      trigger: "VIX > 25 for 2 consecutive days",
      action: "Increase bond allocation by 5%, decrease high-volatility stocks by 5%",
      status: "active",
    },
    {
      id: "rule-2",
      name: "Sector Rotation Strategy",
      description: "Rotate between sectors based on economic indicators",
      trigger: "Economic cycle phase change detected",
      action: "Adjust sector weights according to historical performance in current cycle phase",
      status: "active",
    },
    {
      id: "rule-3",
      name: "Crypto Market Sentiment",
      description: "Adjust crypto allocation based on market sentiment",
      trigger: "Crypto Fear & Greed Index < 20 or > 80",
      action: "Rebalance crypto allocation based on sentiment score",
      status: "paused",
    },
    {
      id: "rule-4",
      name: "Earnings Season Protection",
      description: "Reduce exposure to stocks with upcoming earnings reports",
      trigger: "Company earnings report within 7 days",
      action: "Reduce position by 25% until after earnings announcement",
      status: "active",
    },
  ])

  // Mock data for recent adjustments
  const [recentAdjustments, setRecentAdjustments] = useState<RecentAdjustment[]>([
    {
      id: "adj-1",
      date: "2024-03-21",
      description: "Increased bond allocation by 5% due to rising market volatility",
      impact: "+0.8% portfolio stability score",
      status: "completed",
    },
    {
      id: "adj-2",
      date: "2024-03-18",
      description: "Rotated 3% from Technology to Healthcare sector based on economic indicators",
      impact: "+1.2% projected annual return",
      status: "completed",
    },
    {
      id: "adj-3",
      date: "2024-03-15",
      description: "Reduced NVDA position by 25% ahead of earnings announcement",
      impact: "Risk reduction: -15% volatility",
      status: "completed",
    },
    {
      id: "adj-4",
      date: "2024-03-12",
      description: "Increased Bitcoin allocation by 1% based on positive sentiment indicators",
      impact: "+0.5% projected annual return",
      status: "completed",
    },
  ])

  // Mock data for upcoming adjustments
  const [upcomingAdjustments, setUpcomingAdjustments] = useState<RecentAdjustment[]>([
    {
      id: "up-1",
      date: "2024-03-25",
      description: "Rebalance portfolio to target allocation (scheduled monthly)",
      impact: "Estimated: +0.3% annual return",
      status: "pending",
    },
    {
      id: "up-2",
      date: "2024-03-26",
      description: "Reduce TSLA position by 25% ahead of earnings announcement",
      impact: "Estimated: -12% volatility",
      status: "pending",
    },
  ])

  // Simulate loading
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
          <span className="ml-2 text-gray-600">Loading Auto-Adjust Dashboard...</span>
        </div>
      </div>
    )
  }

  // Mock comparison data for the chart
  const comparisonChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "With Auto-Adjust",
        data: [112000, 118000, 115000, 119000, 125000, 132000, 138000, 135000, 142000, 147000, 153000, 159000],
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Without Auto-Adjust",
        data: [112000, 116000, 113000, 115000, 118000, 122000, 125000, 123000, 127000, 130000, 133000, 136000],
        borderColor: "#94a3b8",
        backgroundColor: "rgba(148, 163, 184, 0.1)",
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Active Adjustment Rules</div>
          <div className="text-2xl font-bold">{adjustmentRules.filter((rule) => rule.status === "active").length}</div>
          <p className="text-xs text-gray-500">
            <span className="text-green-500">Monitoring 24/7</span> for optimal performance
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Adjustments This Month</div>
          <div className="text-2xl font-bold">{recentAdjustments.length}</div>
          <p className="text-xs text-gray-500">
            <span className="text-green-500">+2.5%</span> performance improvement
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">AI Confidence Score</div>
          <div className="text-2xl font-bold">92/100</div>
          <p className="text-xs text-gray-500">
            <span className="text-green-500">High confidence</span> in current strategy
          </p>
        </div>
      </div>

      {/* Performance Impact Chart */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Performance Impact of Auto-Adjustments</h3>
        </div>
        <div className="h-64">
          <PortfolioChart type="line" height={250} showAxis={false} showComparison={true} data={comparisonChartData} />
        </div>
        {/* Removed the legend as requested */}
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Auto-Adjust Dashboard</h2>
              <p className="text-sm text-gray-500">AI-powered portfolio rebalancing for optimal performance</p>
            </div>
            <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm flex items-center gap-1 hover:bg-primary/90">
              <Settings className="h-4 w-4 mr-1" />
              Adjust Settings
            </button>
          </div>
        </div>

        <div className="border-b">
          <div className="flex">
            {["overview", "rules", "history"].map((tab) => (
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
                <h3 className="text-lg font-medium mb-4">Upcoming Adjustments</h3>
                <div className="space-y-3">
                  {upcomingAdjustments.map((adjustment) => (
                    <div key={adjustment.id} className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-primary mr-2" />
                          <div>
                            <div className="font-medium">{adjustment.description}</div>
                            <div className="text-xs text-gray-500">Scheduled for: {adjustment.date}</div>
                          </div>
                        </div>
                        <div className="text-sm text-primary font-medium">{adjustment.impact}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Recent Adjustments</h3>
                <div className="space-y-3">
                  {recentAdjustments.slice(0, 3).map((adjustment) => (
                    <div key={adjustment.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <div>
                            <div className="font-medium">{adjustment.description}</div>
                            <div className="text-xs text-gray-500">Completed on: {adjustment.date}</div>
                          </div>
                        </div>
                        <div className="text-sm text-green-600 font-medium">{adjustment.impact}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-md font-medium mb-2">Auto-Adjust Strategy</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Your portfolio is continuously monitored by our AI system which makes small, strategic adjustments
                  based on market conditions, economic indicators, and your risk profile.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded border">
                    <div className="text-xs font-medium text-gray-500 mb-1">Risk Management</div>
                    <div className="text-sm">Proactive volatility protection</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-xs font-medium text-gray-500 mb-1">Opportunity Capture</div>
                    <div className="text-sm">Sector rotation & trend following</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-xs font-medium text-gray-500 mb-1">Tax Efficiency</div>
                    <div className="text-sm">Optimized for after-tax returns</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "rules" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Adjustment Rules</h3>
              <div className="space-y-4">
                {adjustmentRules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg overflow-hidden">
                    <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                      <div className="flex items-center">
                        <Sliders className="h-5 w-5 text-primary mr-2" />
                        <h4 className="font-medium">{rule.name}</h4>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          rule.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {rule.status}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">Trigger Condition</div>
                          <div className="text-sm bg-gray-50 p-2 rounded">{rule.trigger}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">Adjustment Action</div>
                          <div className="text-sm bg-gray-50 p-2 rounded">{rule.action}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Adjustment History</h3>
              <div className="space-y-3">
                {[...recentAdjustments].map((adjustment) => (
                  <div key={adjustment.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <div>
                          <div className="font-medium">{adjustment.description}</div>
                          <div className="text-xs text-gray-500">Completed on: {adjustment.date}</div>
                        </div>
                      </div>
                      <div className="text-sm text-green-600 font-medium">{adjustment.impact}</div>
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

