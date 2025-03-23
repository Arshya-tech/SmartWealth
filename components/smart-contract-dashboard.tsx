"use client"

import { useState, useEffect } from "react"
import { Bitcoin, ExternalLink, RefreshCw, Shield } from "lucide-react"
import { fetchFromAPI } from "@/config/api-config"

// Define types for our data
interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "fee" | "profit"
  amount: number
  timestamp: string
  status: "confirmed" | "pending" | "failed"
  contractName?: string
  contractId?: string
}

interface Contract {
  id: string
  name: string
  address: string
  balance: number
  createdAt: string
  transactions: Transaction[]
}

interface BlockchainStats {
  totalValueLocked: number
  activeContracts: number
  totalTransactions: number
  monthlyGrowth: number
}

export function SmartContractDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("contracts")

  // State for API data
  const [contracts, setContracts] = useState<Contract[]>([])
  const [blockchainStats, setBlockchainStats] = useState<BlockchainStats | null>(null)

  // Format helpers
  const formatEth = (value: number) => `${value.toFixed(4)} ETH`

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const truncateAddress = (address: string) => `${address.substring(0, 6)}...${address.substring(address.length - 4)}`

  // Fetches blockchain data from API
  const fetchBlockchainData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Adds a delay to make the refresh feel more substantial
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Fetches data from API endpoints
      const contractsData = await fetchFromAPI(`/api/blockchain/contracts`)
      const statsData = await fetchFromAPI(`/api/blockchain/stats`)

      setContracts(contractsData)
      setBlockchainStats(statsData)
    } catch (err) {
      console.error("Error fetching blockchain data:", err)
      setError("Failed to load blockchain data. Using fallback data instead.")

      // Uses fallback data
      const fallbackContracts = [
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

      const fallbackStats = {
        totalValueLocked: 16.23,
        activeContracts: 2,
        totalTransactions: 7,
        monthlyGrowth: 4.2,
      }

      setContracts(fallbackContracts)
      setBlockchainStats(fallbackStats)
    } finally {
      setLoading(false)
    }
  }

  // Initial data load
  useEffect(() => {
    fetchBlockchainData()
  }, [])

  // Handles refresh button click
  const handleRefresh = () => {
    fetchBlockchainData()
  }

  // If we're still loading and have no data
  if (loading && !blockchainStats) {
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

  return (
    <div className="space-y-6">
      {blockchainStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Value Locked</div>
            <div className="text-2xl font-bold">{formatEth(blockchainStats.totalValueLocked)}</div>
            <p className="text-xs text-gray-500">
              <span className="text-green-500">↑ {blockchainStats.monthlyGrowth}%</span> from last month
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Active Smart Contracts</div>
            <div className="text-2xl font-bold">{blockchainStats.activeContracts}</div>
            <p className="text-xs text-gray-500">Across {blockchainStats.activeContracts} investment pools</p>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Transactions</div>
            <div className="text-2xl font-bold">{blockchainStats.totalTransactions}</div>
            <p className="text-xs text-gray-500">All confirmed on Ethereum blockchain</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Smart Contract Dashboard</h2>
              <p className="text-sm text-gray-500">Transparent investment tracking through Ethereum smart contracts</p>
              {error && <p className="text-sm text-amber-600 mt-1">Note: {error}</p>}
            </div>
            <button
              className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm flex items-center gap-1 hover:bg-primary/90"
              onClick={handleRefresh}
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
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === "contracts" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
              onClick={() => setActiveTab("contracts")}
            >
              Smart Contracts
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === "transactions" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
              onClick={() => setActiveTab("transactions")}
            >
              Transactions
            </button>
          </div>
        </div>

        <div className="p-4">
          {activeTab === "contracts" && (
            <div className="space-y-6">
              {/* Contract cards - Will be populated with API data */}
              {contracts.map((contract) => (
                <div key={contract.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-medium">{contract.name}</h3>
                      </div>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Created on {formatDate(contract.createdAt)}</p>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Contract Address</div>
                        <div className="flex items-center gap-2">
                          <code className="bg-primary/10 px-2 py-1 rounded text-sm">
                            {truncateAddress(contract.address)}
                          </code>
                          <a
                            href={`https://etherscan.io/address/${contract.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>

                        <div className="text-sm text-gray-500 mt-4 mb-1">Current Balance</div>
                        <div className="text-2xl font-bold">{formatEth(contract.balance)}</div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-2">Recent Activity</div>
                        <div className="space-y-2">
                          {/* Recent transactions - Will be populated with API data */}
                          {contract.transactions.slice(0, 2).map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`p-1 rounded-full ${
                                    tx.type === "deposit"
                                      ? "bg-primary/10"
                                      : tx.type === "withdrawal"
                                        ? "bg-red-100"
                                        : tx.type === "fee"
                                          ? "bg-yellow-100"
                                          : "bg-blue-100"
                                  }`}
                                >
                                  <Bitcoin
                                    className={`h-3 w-3 ${
                                      tx.type === "deposit"
                                        ? "text-primary"
                                        : tx.type === "withdrawal"
                                          ? "text-red-500"
                                          : tx.type === "fee"
                                            ? "text-yellow-500"
                                            : "text-blue-500"
                                    }`}
                                  />
                                </div>
                                <span className="text-sm capitalize">{tx.type}</span>
                              </div>
                              <div className="text-sm font-medium">
                                {tx.type === "withdrawal" || tx.type === "fee" ? "-" : "+"}
                                {formatEth(tx.amount)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "transactions" && (
            <div>
              <h3 className="text-lg font-medium mb-4">All Blockchain Transactions</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contract</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* All transactions - Will be populated with API data */}
                    {contracts
                      .flatMap((contract) =>
                        contract.transactions.map((tx) => ({
                          ...tx,
                          contractName: contract.name,
                          contractId: contract.id,
                        })),
                      )
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((tx) => (
                        <tr key={tx.id}>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div
                                className={`p-1 rounded-full ${
                                  tx.type === "deposit"
                                    ? "bg-primary/10"
                                    : tx.type === "withdrawal"
                                      ? "bg-red-100"
                                      : tx.type === "fee"
                                        ? "bg-yellow-100"
                                        : "bg-blue-100"
                                }`}
                              >
                                <Bitcoin
                                  className={`h-3 w-3 ${
                                    tx.type === "deposit"
                                      ? "text-primary"
                                      : tx.type === "withdrawal"
                                        ? "text-red-500"
                                        : tx.type === "fee"
                                          ? "text-yellow-500"
                                          : "text-blue-500"
                                  }`}
                                />
                              </div>
                              <span className="capitalize">{tx.type}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span
                              className={
                                tx.type === "withdrawal" || tx.type === "fee" ? "text-red-500" : "text-green-500"
                              }
                            >
                              {tx.type === "withdrawal" || tx.type === "fee" ? "-" : "+"}
                              {formatEth(tx.amount)}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">{tx.contractName}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{formatDate(tx.timestamp)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary-foreground">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

