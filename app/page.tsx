"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PiggyBank, TrendingUp, Building, Bitcoin, Calculator, Receipt, Home, Star, Settings } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const financialProducts = [
    {
      title: "Fixed Deposits",
      description: "Compare the best FD rates across all banks",
      icon: PiggyBank,
      gradient: "from-blue-50 to-white",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      href: "/fixed-deposits",
    },
    {
      title: "Money Market Funds",
      description: "Compare the best MMF rates",
      icon: TrendingUp,
      gradient: "from-green-50 to-white",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      href: "/money-market-funds",
    },
    {
      title: "Stock Brokers",
      description: "Compare the lowest commissions for stock investment",
      icon: Building,
      gradient: "from-purple-50 to-white",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      href: "/stock-brokers",
    },
    {
      title: "Crypto Brokers",
      description: "Compare the regulated exchanges",
      icon: Bitcoin,
      gradient: "from-orange-50 to-white",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      href: "/crypto-brokers",
    },
  ]

  const financialTools = [
    {
      title: "Financial Calculator",
      description: "Plan your finances",
      icon: Calculator,
      gradient: "from-indigo-50 to-white",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      href: "/calculator",
    },
    {
      title: "Tax Calculator",
      description: "Estimate your taxes",
      icon: Receipt,
      gradient: "from-teal-50 to-white",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      href: "/tax-calculator",
    },
  ]

  return (
    <div
      className={`relative w-full max-w-sm mx-auto min-h-screen transition-colors ${
        typeof window !== "undefined" && document.documentElement.classList.contains("dark")
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`fixed top-0 w-full max-w-sm z-50 px-4 py-3 border-b transition-colors ${
          typeof window !== "undefined" && document.documentElement.classList.contains("dark")
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-100"
        }`}
      >
        <h1 className="text-xl font-semibold text-center">OneFi</h1>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-20 px-4">
        {/* Financial Products Section */}
        <h2 className="text-lg font-semibold mb-4">Explore & Compare</h2>

        {/* Financial Products Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {financialProducts.map((product, index) => {
            const IconComponent = product.icon
            return (
              <Link key={index} href={product.href}>
                <Card
                  className={`bg-gradient-to-br ${product.gradient} p-4 shadow-sm border border-gray-100 cursor-pointer h-[150px] hover:shadow-md transition-shadow ${
                    typeof window !== "undefined" && document.documentElement.classList.contains("dark")
                      ? "dark:bg-gray-800 dark:border-gray-700"
                      : ""
                  }`}
                >
                  <div className={`w-12 h-12 mb-3 ${product.iconBg} rounded-xl flex items-center justify-center`}>
                    <IconComponent className={`${product.iconColor} w-6 h-6`} />
                  </div>
                  <h3 className="font-medium mb-2 text-sm leading-tight">{product.title}</h3>
                  <p
                    className={`text-xs leading-tight line-clamp-3 ${
                      typeof window !== "undefined" && document.documentElement.classList.contains("dark")
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {product.description}
                  </p>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Financial Tools Section */}
        <h2 className="text-lg font-semibold mb-4">Financial Tools</h2>
        <div className="grid grid-cols-2 gap-4">
          {financialTools.map((tool, index) => {
            const IconComponent = tool.icon
            return (
              <Link key={index} href={tool.href}>
                <Card
                  className={`bg-gradient-to-br ${tool.gradient} p-4 shadow-sm border border-gray-100 cursor-pointer h-[150px] hover:shadow-md transition-shadow ${
                    typeof window !== "undefined" && document.documentElement.classList.contains("dark")
                      ? "dark:bg-gray-800 dark:border-gray-700"
                      : ""
                  }`}
                >
                  <div className={`w-12 h-12 mb-3 ${tool.iconBg} rounded-xl flex items-center justify-center`}>
                    <IconComponent className={`${tool.iconColor} w-6 h-6`} />
                  </div>
                  <h3 className="font-medium mb-2 text-sm leading-tight">{tool.title}</h3>
                  <p
                    className={`text-xs leading-tight line-clamp-3 ${
                      typeof window !== "undefined" && document.documentElement.classList.contains("dark")
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {tool.description}
                  </p>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div
        className={`fixed bottom-0 w-full max-w-sm border-t transition-colors ${
          typeof window !== "undefined" && document.documentElement.classList.contains("dark")
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-100"
        }`}
      >
        <div className="grid grid-cols-3 h-16">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center justify-center h-full ${
              activeTab === "home"
                ? "text-blue-600"
                : typeof window !== "undefined" && document.documentElement.classList.contains("dark")
                  ? "text-gray-400"
                  : "text-gray-600"
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("favorites")}
            className={`flex flex-col items-center justify-center h-full ${
              activeTab === "favorites"
                ? "text-blue-600"
                : typeof window !== "undefined" && document.documentElement.classList.contains("dark")
                  ? "text-gray-400"
                  : "text-gray-600"
            }`}
          >
            <Star className="w-5 h-5 mb-1" />
            <span className="text-xs">Favorites</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setActiveTab("settings")
              router.push("/settings")
            }}
            className={`flex flex-col items-center justify-center h-full ${
              activeTab === "settings"
                ? "text-blue-600"
                : typeof window !== "undefined" && document.documentElement.classList.contains("dark")
                  ? "text-gray-400"
                  : "text-gray-600"
            }`}
          >
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
