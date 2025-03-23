import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Returns mock blockchain stats directly
    const blockchainStats = {
      totalValueLocked: 16.23,
      activeContracts: 2,
      totalTransactions: 7,
      monthlyGrowth: 4.2,
    }

    return NextResponse.json(blockchainStats)
  } catch (error) {
    console.error("Error calculating blockchain stats:", error)
    return NextResponse.json({ error: "Failed to calculate blockchain statistics" }, { status: 500 })
  }
}

