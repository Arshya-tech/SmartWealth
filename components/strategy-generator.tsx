"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { StrategyResults } from "@/components/strategy-results"

const formSchema = z.object({
  income: z.string().min(1, { message: "Income is required" }),
  riskLevel: z.string().min(1, { message: "Risk level is required" }),
  investmentHorizon: z.string().min(1, { message: "Investment horizon is required" }),
  financialGoals: z.string().min(10, { message: "Please describe your financial goals (minimum 10 characters)" }),
  monthlyInvestment: z.string().min(1, { message: "Monthly investment amount is required" }),
})

export function StrategyGenerator() {
  const [loading, setLoading] = useState(false)
  const [strategy, setStrategy] = useState<any>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: "",
      riskLevel: "",
      investmentHorizon: "",
      financialGoals: "",
      monthlyInvestment: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    // Simulates API call to generate strategy
    setTimeout(() => {
      const mockStrategy = generateMockStrategy(values)
      setStrategy(mockStrategy)
      setLoading(false)
    }, 2000)
  }

  function generateMockStrategy(values: z.infer<typeof formSchema>) {
    const income = Number.parseFloat(values.income)
    const monthlyInvestment = Number.parseFloat(values.monthlyInvestment)
    const riskLevel = values.riskLevel

    // Generates a strategy based on the user's inputs
    let assetAllocation = {}
    let recommendations = []

    if (riskLevel === "conservative") {
      assetAllocation = {
        bonds: 60,
        stocks: 30,
        alternatives: 10,
      }
      recommendations = [
        "Focus on high-quality bonds and dividend stocks",
        "Consider Treasury Inflation-Protected Securities (TIPS)",
        "Maintain a higher cash reserve for emergencies",
      ]
    } else if (riskLevel === "moderate") {
      assetAllocation = {
        bonds: 40,
        stocks: 50,
        alternatives: 10,
      }
      recommendations = [
        "Balance between growth stocks and value stocks",
        "Consider adding some international exposure",
        "Explore REITs for income and diversification",
      ]
    } else {
      assetAllocation = {
        bonds: 20,
        stocks: 65,
        alternatives: 15,
      }
      recommendations = [
        "Focus on growth stocks and emerging markets",
        "Consider small-cap stocks for higher growth potential",
        "Explore alternative investments like private equity funds",
      ]
    }

    return {
      assetAllocation,
      recommendations,
      monthlyContribution: monthlyInvestment,
      projectedReturns: {
        conservative: monthlyInvestment * 12 * 0.05 * Number.parseInt(values.investmentHorizon),
        expected: monthlyInvestment * 12 * 0.08 * Number.parseInt(values.investmentHorizon),
        aggressive: monthlyInvestment * 12 * 0.12 * Number.parseInt(values.investmentHorizon),
      },
      investmentHorizon: values.investmentHorizon,
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Generate Your Strategy</CardTitle>
          <CardDescription>Fill out the form below to receive a personalized investment strategy</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Income ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 75000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyInvestment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Investment ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="riskLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Tolerance</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select risk level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="conservative">Conservative</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="aggressive">Aggressive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="investmentHorizon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Horizon (years)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time horizon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="5">Short-term (5 years)</SelectItem>
                          <SelectItem value="10">Medium-term (10 years)</SelectItem>
                          <SelectItem value="20">Long-term (20 years)</SelectItem>
                          <SelectItem value="30">Very long-term (30+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="financialGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Financial Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your financial goals (e.g., retirement, buying a home, education, etc.)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Be specific about what you're saving for and your timeline</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Strategy...
                  </>
                ) : (
                  "Generate Strategy"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {strategy && <StrategyResults strategy={strategy} />}
    </div>
  )
}

