import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real application, it would fetch recent portfolio adjustments from a database
    // For now, it returns placeholder data

    const recentAdjustments = [
      {
        action: "Increased Bitcoin allocation by 2%",
        reason: "Based on positive market sentiment from Alpha Vantage news analysis",
      },
      {
        action: "Reduced Tesla exposure by 1.5%",
        reason: "Due to increased volatility detected in recent market data",
      },
    ]

    return NextResponse.json(recentAdjustments)
  } catch (error) {
    console.error("Error fetching portfolio adjustments:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio adjustments" }, { status: 500 })
  }
}

