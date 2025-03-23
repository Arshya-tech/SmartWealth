"use client"

import { useState } from "react"
import { ArrowRight, Download, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StrategyResultsProps {
  strategy: {
    assetAllocation: {
      bonds: number
      stocks: number
      alternatives: number
    }
    recommendations: string[]
    monthlyContribution: number
    projectedReturns: {
      conservative: number
      expected: number
      aggressive: number
    }
    investmentHorizon: string
  }
}

export function StrategyResults({ strategy }: StrategyResultsProps) {
  const [activeTab, setActiveTab] = useState("allocation")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real application, this would generate a PDF or other document
    alert("In a real application, this would download your strategy as a PDF")
  }

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <CardTitle className="text-2xl">Your Personalized Strategy</CardTitle>
        <CardDescription>Based on your financial profile and goals</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="allocation" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="allocation" className="text-sm">
              Asset Allocation
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="text-sm">
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="projections" className="text-sm">
              Projections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="allocation" className="pt-2">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Recommended Asset Allocation</h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{strategy.assetAllocation.bonds}%</div>
                  <div className="text-sm text-slate-600">Bonds</div>
                </div>

                <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-2">{strategy.assetAllocation.stocks}%</div>
                  <div className="text-sm text-slate-600">Stocks</div>
                </div>

                <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {strategy.assetAllocation.alternatives}%
                  </div>
                  <div className="text-sm text-slate-600">Alternatives</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="h-8 flex rounded-md overflow-hidden shadow-sm">
                  <div className="bg-blue-500" style={{ width: `${strategy.assetAllocation.bonds}%` }}></div>
                  <div className="bg-green-500" style={{ width: `${strategy.assetAllocation.stocks}%` }}></div>
                  <div className="bg-purple-500" style={{ width: `${strategy.assetAllocation.alternatives}%` }}></div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-primary/5 rounded-lg shadow-sm">
                <h4 className="font-medium mb-2">Monthly Contribution</h4>
                <p className="text-2xl font-bold">{formatCurrency(strategy.monthlyContribution)}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="pt-2">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Strategic Recommendations</h3>

              <ul className="space-y-3">
                {strategy.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start p-3 bg-gray-50 rounded-lg shadow-sm">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-amber-50 p-4 rounded-lg mt-6 shadow-sm border border-amber-100">
                <h4 className="font-medium text-amber-800 mb-2">Important Note</h4>
                <p className="text-amber-700 text-sm">
                  These recommendations are generated based on the information you provided and general market
                  principles. Consider consulting with a financial advisor before making investment decisions.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projections" className="pt-2">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Projected Returns ({strategy.investmentHorizon} years)</h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col p-4 bg-slate-50 rounded-lg shadow-sm">
                  <div className="text-sm text-slate-500 mb-1">Conservative</div>
                  <div className="text-2xl font-bold">{formatCurrency(strategy.projectedReturns.conservative)}</div>
                </div>

                <div className="flex flex-col p-4 bg-primary/5 rounded-lg border border-primary/20 shadow-sm">
                  <div className="text-sm text-primary mb-1">Expected</div>
                  <div className="text-2xl font-bold">{formatCurrency(strategy.projectedReturns.expected)}</div>
                </div>

                <div className="flex flex-col p-4 bg-slate-50 rounded-lg shadow-sm">
                  <div className="text-sm text-slate-500 mb-1">Aggressive</div>
                  <div className="text-2xl font-bold">{formatCurrency(strategy.projectedReturns.aggressive)}</div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg mt-6 shadow-sm">
                <h4 className="font-medium mb-2">Projection Assumptions</h4>
                <ul className="text-sm space-y-2">
                  <li>• Conservative: 5% annual return</li>
                  <li>• Expected: 8% annual return</li>
                  <li>• Aggressive: 12% annual return</li>
                  <li>• Consistent monthly contributions of {formatCurrency(strategy.monthlyContribution)}</li>
                  <li>• Time horizon of {strategy.investmentHorizon} years</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6 bg-gray-50">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button onClick={handleDownload} className="bg-primary hover:bg-primary/90">
          <Download className="h-4 w-4 mr-2" />
          Download Strategy
        </Button>
      </CardFooter>
    </Card>
  )
}

