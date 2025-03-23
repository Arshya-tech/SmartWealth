"use client"

import { useEffect, useRef, useState } from "react"
import { LineChart, BarChart, PieChart } from "lucide-react"

interface PortfolioChartProps {
  data?: any
  type?: "line" | "bar" | "pie"
  height?: number
  showAxis?: boolean
  showComparison?: boolean
}

export function PortfolioChart({
  data,
  type: initialType = "line",
  height = 300,
  showAxis = false,
  showComparison = false,
}: PortfolioChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<any>(null)
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">(initialType)

  // Modern mock data for portfolio growth
  const mockLineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Portfolio Value",
        data: [112000, 118000, 115000, 119000, 125000, 132000, 138000, 135000, 142000, 147000, 153000, 159000],
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.4, // Makes the line curved for a more modern look
        fill: true,
      },
      // Adds comparison dataset if needed
      ...(showComparison
        ? [
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
          ]
        : []),
    ],
  }

  // Modern mock data for asset allocation
  const mockPieData = {
    labels: ["Technology", "Finance", "Healthcare", "Consumer", "Energy", "Other"],
    datasets: [
      {
        label: "Sector Allocation",
        data: [40, 20, 15, 12, 8, 5],
        backgroundColor: [
          "rgba(245, 158, 11, 0.8)", // Primary color (yellow)
          "rgba(245, 158, 11, 0.6)",
          "rgba(245, 158, 11, 0.4)",
          "rgba(59, 130, 246, 0.6)",
          "rgba(16, 185, 129, 0.6)",
          "rgba(107, 114, 128, 0.6)",
        ],
        borderWidth: 0,
      },
    ],
  }

  // Modern mock data for performance comparison
  const mockBarData = {
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
  }

  useEffect(() => {
    const initChart = async () => {
      if (chartRef.current) {
        const Chart = (await import("chart.js/auto")).default

        // Destroys previous chart instance if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy()
        }

        // Gets the appropriate data based on chart type
        let chartData

        // Uses provided data if available, otherwise use mock data
        if (data) {
          chartData = data
        } else {
          // Uses mock data based on chart type
          if (chartType === "line") {
            chartData = mockLineData
          } else if (chartType === "bar") {
            chartData = mockBarData
          } else {
            chartData = mockPieData
          }
        }

        // Applies gradient fill if it's a line chart
        if (chartType === "line" && chartData.datasets && chartData.datasets[0]) {
          const ctx = chartRef.current.getContext("2d")
          if (ctx) {
            const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height)
            gradient.addColorStop(0, "rgba(245, 158, 11, 0.2)")
            gradient.addColorStop(1, "rgba(245, 158, 11, 0)")
            chartData.datasets[0].backgroundColor = gradient

            // Comparison dataset gradient if it exists
            if (chartData.datasets[1]) {
              const gradient2 = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height)
              gradient2.addColorStop(0, "rgba(148, 163, 184, 0.2)")
              gradient2.addColorStop(1, "rgba(148, 163, 184, 0)")
              chartData.datasets[1].backgroundColor = gradient2
            }
          }
        }

        // Creates new chart
        chartInstance.current = new Chart(chartRef.current, {
          type: chartType,
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: chartType === "pie" || showComparison,
                position: "top",
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: 12,
                  },
                },
              },
              tooltip: {
                mode: "index",
                intersect: false,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                titleColor: "#000",
                bodyColor: "#666",
                borderColor: "#ddd",
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                usePointStyle: true,
                callbacks: {
                  label: (context) => {
                    if (chartType === "line") {
                      return ` $${context.parsed.y.toLocaleString()}`
                    } else if (chartType === "bar") {
                      return ` ${context.parsed.y}%`
                    }
                    return ` ${context.parsed}%`
                  },
                },
              },
            },
            scales:
              chartType !== "pie"
                ? {
                    x: {
                      display: showAxis,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        font: {
                          size: 12,
                        },
                      },
                    },
                    y: {
                      display: showAxis,
                      beginAtZero: true,
                      grid: {
                        display: showAxis,
                        color: "rgba(0, 0, 0, 0.05)",
                      },
                      ticks: {
                        font: {
                          size: 12,
                        },
                      },
                    },
                  }
                : undefined,
            elements: {
              line: {
                tension: 0.4,
              },
              point: {
                radius: 0,
                hoverRadius: 6,
              },
            },
            animation: {
              duration: 1500,
              easing: "easeOutQuart",
            },
          },
        })
      }
    }

    initChart()

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [chartType, data, showAxis, showComparison])

  return (
    <div className="relative" style={{ height: `${height}px` }}>
      {/* Chart type selector - only shows in the component if needed */}
      {false && (
        <div className="absolute top-0 right-0 flex space-x-2 z-10">
          <button
            className={`p-1 rounded-md ${chartType === "line" ? "bg-primary/20 text-primary" : "bg-gray-100 text-gray-500"}`}
            title="Line Chart"
            onClick={() => setChartType("line")}
          >
            <LineChart className="h-4 w-4" />
          </button>
          <button
            className={`p-1 rounded-md ${chartType === "bar" ? "bg-primary/20 text-primary" : "bg-gray-100 text-gray-500"}`}
            title="Bar Chart"
            onClick={() => setChartType("bar")}
          >
            <BarChart className="h-4 w-4" />
          </button>
          <button
            className={`p-1 rounded-md ${chartType === "pie" ? "bg-primary/20 text-primary" : "bg-gray-100 text-gray-500"}`}
            title="Pie Chart"
            onClick={() => setChartType("pie")}
          >
            <PieChart className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Canvas for the chart */}
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

