"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calculator, TrendingUp, Info, RotateCcw, Download, Crown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

interface TaxBracket {
  min: number
  max: number | null
  rate: number
}

interface TaxRelief {
  id: string
  name: string
  maxAmount: number
  amount: number
  description: string
}

export default function TaxCalculatorPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [annualIncome, setAnnualIncome] = useState<number>(0)
  const [taxReliefs, setTaxReliefs] = useState<TaxRelief[]>([
    {
      id: "personal",
      name: "Personal Relief",
      maxAmount: 9000,
      amount: 9000,
      description: "Basic personal relief for all taxpayers",
    },
    {
      id: "epf",
      name: "EPF Contribution",
      maxAmount: 4000,
      amount: 0,
      description: "Employee Provident Fund contributions",
    },
    {
      id: "life-insurance",
      name: "Life Insurance",
      maxAmount: 3000,
      amount: 0,
      description: "Life insurance and takaful premiums",
    },
    {
      id: "medical",
      name: "Medical Expenses",
      maxAmount: 8000,
      amount: 0,
      description: "Medical expenses for self, spouse, and children",
    },
    {
      id: "education",
      name: "Education",
      maxAmount: 7000,
      amount: 0,
      description: "Education fees for self, spouse, and children",
    },
    {
      id: "parents",
      name: "Parents Medical",
      maxAmount: 8000,
      amount: 0,
      description: "Medical expenses for parents",
    },
  ])

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const taxBrackets: TaxBracket[] = [
    { min: 0, max: 5000, rate: 0 },
    { min: 5001, max: 20000, rate: 1 },
    { min: 20001, max: 35000, rate: 3 },
    { min: 35001, max: 50000, rate: 8 },
    { min: 50001, max: 70000, rate: 13 },
    { min: 70001, max: 100000, rate: 21 },
    { min: 100001, max: 400000, rate: 24 },
    { min: 400001, max: 600000, rate: 24.5 },
    { min: 600001, max: 2000000, rate: 25 },
    { min: 2000001, max: null, rate: 30 },
  ]

  const calculateTax = () => {
    const totalReliefs = taxReliefs.reduce((sum, relief) => sum + relief.amount, 0)
    const taxableIncome = Math.max(0, annualIncome - totalReliefs)

    let tax = 0
    let remainingIncome = taxableIncome

    for (const bracket of taxBrackets) {
      if (remainingIncome <= 0) break

      const bracketMax = bracket.max || Number.POSITIVE_INFINITY
      const taxableInBracket = Math.min(remainingIncome, bracketMax - bracket.min + 1)

      if (taxableInBracket > 0) {
        tax += (taxableInBracket * bracket.rate) / 100
        remainingIncome -= taxableInBracket
      }
    }

    return {
      grossIncome: annualIncome,
      totalReliefs,
      taxableIncome,
      totalTax: tax,
      netIncome: annualIncome - tax,
      effectiveRate: annualIncome > 0 ? (tax / annualIncome) * 100 : 0,
      marginalRate: getMarginalRate(taxableIncome),
    }
  }

  const getMarginalRate = (taxableIncome: number) => {
    for (const bracket of taxBrackets) {
      if (taxableIncome >= bracket.min && (bracket.max === null || taxableIncome <= bracket.max)) {
        return bracket.rate
      }
    }
    return 0
  }

  const handleReliefChange = (id: string, value: number) => {
    setTaxReliefs((prev) =>
      prev.map((relief) => (relief.id === id ? { ...relief, amount: Math.min(value, relief.maxAmount) } : relief)),
    )
  }

  const resetCalculator = () => {
    setAnnualIncome(0)
    setTaxReliefs((prev) =>
      prev.map((relief) => ({
        ...relief,
        amount: relief.id === "personal" ? relief.maxAmount : 0,
      })),
    )
  }

  const handleBackClick = () => {
    router.push("/")
  }

  const taxResult = calculateTax()

  return (
    <div className="bg-white min-h-screen relative w-full max-w-sm mx-auto">
      {/* Header */}
      <header className="fixed top-0 w-full max-w-sm bg-white z-10 px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleBackClick}>
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Button>
        <h1 className="text-xl font-semibold text-center">Tax Calculator</h1>
        <Button variant="ghost" size="icon" onClick={resetCalculator}>
          <RotateCcw className="w-5 h-5 text-gray-700" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="pt-16 px-4 pb-4">
        {/* Income Input */}
        <section className="mt-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <Label htmlFor="income" className="text-sm font-medium mb-2 block">
                Annual Income (RM)
              </Label>
              <Input
                id="income"
                type="number"
                placeholder="Enter your annual income"
                value={annualIncome || ""}
                onChange={(e) => setAnnualIncome(Number(e.target.value) || 0)}
                className="text-lg"
              />
            </CardContent>
          </Card>
        </section>

        {/* Tax Result Summary */}
        <section className="mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Calculator className="w-4 h-4 mr-2" />
                Tax Calculation Summary
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Gross Income:</span>
                  <span className="font-medium">RM {taxResult.grossIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Reliefs:</span>
                  <span className="font-medium text-green-600">-RM {taxResult.totalReliefs.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Taxable Income:</span>
                  <span className="font-medium">RM {taxResult.taxableIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tax:</span>
                  <span className="font-semibold text-red-600">RM {taxResult.totalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Net Income:</span>
                  <span className="font-semibold text-blue-600">RM {taxResult.netIncome.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-500">Effective Rate</div>
                  <div className="font-semibold">{taxResult.effectiveRate.toFixed(2)}%</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-500">Marginal Rate</div>
                  <div className="font-semibold">{taxResult.marginalRate}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tax Reliefs */}
        <section className="mb-6">
          <h3 className="font-semibold mb-3">Tax Reliefs (2025)</h3>
          <div className="space-y-3">
            {taxReliefs.map((relief) => (
              <Card key={relief.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Label className="font-medium">{relief.name}</Label>
                      <p className="text-xs text-gray-600">{relief.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Max: RM {relief.maxAmount.toLocaleString()}
                    </Badge>
                  </div>

                  <Input
                    type="number"
                    placeholder="0"
                    value={relief.amount || ""}
                    onChange={(e) => handleReliefChange(relief.id, Number(e.target.value) || 0)}
                    max={relief.maxAmount}
                    className="mt-2"
                  />

                  {relief.amount > relief.maxAmount && (
                    <p className="text-xs text-red-500 mt-1">
                      Amount exceeds maximum limit of RM {relief.maxAmount.toLocaleString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tax Brackets Info */}
        <section className="mb-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                2025 Tax Brackets
              </h3>

              <div className="space-y-2 text-xs">
                {taxBrackets.map((bracket, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span>
                      RM {bracket.min.toLocaleString()} - {bracket.max ? `RM ${bracket.max.toLocaleString()}` : "Above"}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {bracket.rate}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Optimization Tips */}
        <section className="mb-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Tax Optimization Tips
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <span>Maximize your EPF contributions to reduce taxable income</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <span>Keep receipts for medical expenses and education fees</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <span>Consider life insurance for additional tax relief</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Export Feature (Premium) */}
        <section className="mb-6">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold flex items-center">
                    <Crown className="w-4 h-4 mr-2 text-yellow-600" />
                    Export Tax Summary
                  </h3>
                  <p className="text-sm text-gray-600">Download detailed tax calculation report</p>
                </div>
                <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
