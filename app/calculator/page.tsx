"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp, Car, Receipt, Target, Lock, Crown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CalculatorTool {
  id: string
  title: string
  description: string
  icon: any
  gradient: string
  iconBg: string
  iconColor: string
  isPremium: boolean
  href: string
}

export default function CalculatorPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const calculatorTools: CalculatorTool[] = [
    {
      id: "fire",
      title: "FIRE Calculator",
      description: "Calculate your Financial Independence Retire Early timeline",
      icon: Target,
      gradient: "from-green-50 to-white",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      isPremium: false,
      href: "/calculator/fire",
    },
    {
      id: "investment",
      title: "Investment Calculator",
      description: "Calculate compound interest and investment returns",
      icon: TrendingUp,
      gradient: "from-blue-50 to-white",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      isPremium: false,
      href: "/calculator/investment",
    },
    {
      id: "car-loan",
      title: "Car Loan Calculator",
      description: "Calculate monthly payments for Malaysian car loans",
      icon: Car,
      gradient: "from-purple-50 to-white",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      isPremium: true,
      href: "/calculator/car-loan",
    },
    {
      id: "tax",
      title: "Tax Calculator",
      description: "Calculate Malaysian income tax with 2025 brackets",
      icon: Receipt,
      gradient: "from-orange-50 to-white",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      isPremium: false,
      href: "/tax-calculator",
    },
  ]

  const handleBackClick = () => {
    router.push("/")
  }

  const handleCalculatorClick = (calculator: CalculatorTool) => {
    if (calculator.isPremium) {
      // Show premium upgrade modal
      alert("This calculator requires a premium subscription. Upgrade to unlock all features!")
      return
    }
    router.push(calculator.href)
  }

  return (
    <div className="bg-white min-h-screen relative w-full max-w-sm mx-auto">
      {/* Header */}
      <header className="fixed top-0 w-full max-w-sm bg-white z-10 px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleBackClick}>
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Button>
        <h1 className="text-xl font-semibold text-center">Financial Calculators</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </header>

      {/* Main Content */}
      <main className="pt-16 px-4 pb-4">
        {/* Premium Banner */}
        <div className="mt-4 mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <Crown className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Unlock Premium Calculators</h3>
              <p className="text-sm text-gray-600">Get access to advanced financial planning tools</p>
            </div>
            <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
              Upgrade
            </Button>
          </div>
        </div>

        {/* Calculator Grid */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold mb-4">Available Calculators</h2>

          {calculatorTools.map((calculator) => {
            const IconComponent = calculator.icon
            return (
              <Card
                key={calculator.id}
                onClick={() => handleCalculatorClick(calculator)}
                className={`p-4 cursor-pointer hover:shadow-md transition-shadow relative ${
                  calculator.isPremium ? "opacity-75" : ""
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`w-12 h-12 ${calculator.iconBg} rounded-xl flex items-center justify-center mr-4 relative`}
                  >
                    <IconComponent className={`${calculator.iconColor} w-6 h-6`} />
                    {calculator.isPremium && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Lock className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h3 className="font-medium">{calculator.title}</h3>
                      {calculator.isPremium && (
                        <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{calculator.description}</p>

                    <Button
                      size="sm"
                      className={`${
                        calculator.isPremium
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      }`}
                      disabled={calculator.isPremium}
                    >
                      {calculator.isPremium ? "Locked" : "Calculate"}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </section>

        {/* Features Section */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Why Use Our Calculators?</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <div>
                <h4 className="font-medium text-sm">Malaysian-Specific</h4>
                <p className="text-xs text-gray-600">
                  Tailored for Malaysian tax rates, loan terms, and financial regulations
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <div>
                <h4 className="font-medium text-sm">Real-Time Results</h4>
                <p className="text-xs text-gray-600">See calculations update instantly as you adjust your inputs</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
              <div>
                <h4 className="font-medium text-sm">Visual Charts</h4>
                <p className="text-xs text-gray-600">Understand your financial projections with interactive charts</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
