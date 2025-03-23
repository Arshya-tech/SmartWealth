import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real application, it would calculate these values based on actual sentiment data
    // For now, it returns enhanced mock data that looks realistic

    const sentimentSources = {
      news: 76,
      social: 82,
      financial: 68,
      // Adds more detailed breakdown
      breakdown: {
        twitter: 84,
        reddit: 79,
        stockTwits: 83,
        bloomberg: 72,
        reuters: 74,
        wsj: 71,
        cnbc: 77,
        earnings: 65,
        analyst: 70,
        sec: 62,
      },
    }

    return NextResponse.json(sentimentSources)
  } catch (error) {
    console.error("Error calculating sentiment sources:", error)
    return NextResponse.json({ error: "Failed to calculate sentiment sources" }, { status: 500 })
  }
}

