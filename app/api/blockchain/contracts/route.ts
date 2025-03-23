import { NextResponse } from "next/server"
import { getMockBlockchainContracts } from "@/config/api-config"

export async function GET() {
  try {
    
    const contracts = await getMockBlockchainContracts()
    return NextResponse.json(contracts)
  } catch (error) {
    console.error("Error fetching blockchain contracts:", error)
    return NextResponse.json({ error: "Failed to fetch blockchain contracts" }, { status: 500 })
  }
}



