"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Bitcoin, Coins, DollarSign, Home, LineChart, PieChart, TrendingUp } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto hidden md:block">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg">AI Hedge Fund</span>
        </div>
      </div>

      <div className="p-2">
        <div className="mb-4">
          <Link
            href="/"
            className={`flex items-center gap-2 p-2 rounded-md ${isActive("/") ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
        </div>

        <div className="mb-4">
          <div className="px-2 py-1 text-sm font-medium text-gray-500">Invest</div>
          <Link
            href="/portfolio"
            className={`flex items-center gap-2 p-2 rounded-md ${isActive("/portfolio") ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
          >
            <PieChart className="h-5 w-5" />
            <span>Portfolio Builder</span>
          </Link>
          <Link
            href="/auto-adjust"
            className={`flex items-center gap-2 p-2 rounded-md ${isActive("/auto-adjust") ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
          >
            <LineChart className="h-5 w-5" />
            <span>Auto-Adjust</span>
          </Link>
          <Link
            href="/risk"
            className={`flex items-center gap-2 p-2 rounded-md ${isActive("/risk") ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Risk Analysis</span>
          </Link>
        </div>

        <div className="mb-4">
          <div className="px-2 py-1 text-sm font-medium text-gray-500">Market Trends</div>
          <Link
            href="/sentiment"
            className={`flex items-center gap-2 p-2 rounded-md ${isActive("/sentiment") ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
          >
            <TrendingUp className="h-5 w-5" />
            <span>Sentiment Analysis</span>
          </Link>
          <Link
            href="/news"
            className={`flex items-center gap-2 p-2 rounded-md ${isActive("/news") ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
          >
            <BarChart3 className="h-5 w-5" />
            <span>News Scraper</span>
          </Link>
        </div>

        <div className="mb-4">
          <div className="px-2 py-1 text-sm font-medium text-gray-500">Blockchain</div>
          <Link
            href="/contracts"
            className={`flex items-center gap-2 p-2 rounded-md ${isActive("/contracts") ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
          >
            <Bitcoin className="h-5 w-5" />
            <span>Smart Contracts</span>
          </Link>
          <Link
            href="/tracking"
            className={`flex items-center gap-2 p-2 rounded-md ${isActive("/tracking") ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
          >
            <Coins className="h-5 w-5" />
            <span>Transparent Tracking</span>
          </Link>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 mt-auto">
        <button className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Account</button>
      </div>
    </div>
  )
}

