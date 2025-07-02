"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Search,
  X,
  ArrowUpDown,
  ChevronDown,
  Percent,
  Tag,
  Building2,
  Coins,
  Clock,
  CheckCircle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Fund {
  id: number
  provider: string
  name: string
  yield: number
  fee: number
  minInvestment: number
  liquidity: string
  shariah: boolean
  riskLevel: string
  fundSize: string
  history: { date: string; yield: number }[]
}

export default function MoneyMarketFundsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [filterType, setFilterType] = useState("all")
  const [liquidityFilter, setLiquidityFilter] = useState<string | null>(null)
  const [minInvestmentFilter, setMinInvestmentFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("yield")
  const [showSortOptions, setShowSortOptions] = useState(false)
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null)

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const funds: Fund[] = [
    {
      id: 1,
      provider: "Maybank",
      name: "Maybank Money Market Fund",
      yield: 3.25,
      fee: 0.35,
      minInvestment: 1000,
      liquidity: "T+1",
      shariah: false,
      riskLevel: "Low",
      fundSize: "RM 2.5B",
      history: [
        { date: "Jan", yield: 3.15 },
        { date: "Feb", yield: 3.18 },
        { date: "Mar", yield: 3.2 },
        { date: "Apr", yield: 3.22 },
        { date: "May", yield: 3.25 },
        { date: "Jun", yield: 3.25 },
      ],
    },
    {
      id: 2,
      provider: "CIMB",
      name: "CIMB Islamic Money Market Fund",
      yield: 3.35,
      fee: 0.3,
      minInvestment: 5000,
      liquidity: "T+1",
      shariah: true,
      riskLevel: "Low",
      fundSize: "RM 1.8B",
      history: [
        { date: "Jan", yield: 3.2 },
        { date: "Feb", yield: 3.25 },
        { date: "Mar", yield: 3.3 },
        { date: "Apr", yield: 3.32 },
        { date: "May", yield: 3.35 },
        { date: "Jun", yield: 3.35 },
      ],
    },
    {
      id: 3,
      provider: "Public Bank",
      name: "Public Money Market Fund",
      yield: 3.15,
      fee: 0.25,
      minInvestment: 1000,
      liquidity: "T+0",
      shariah: false,
      riskLevel: "Low",
      fundSize: "RM 3.2B",
      history: [
        { date: "Jan", yield: 3.0 },
        { date: "Feb", yield: 3.05 },
        { date: "Mar", yield: 3.1 },
        { date: "Apr", yield: 3.12 },
        { date: "May", yield: 3.15 },
        { date: "Jun", yield: 3.15 },
      ],
    },
    {
      id: 4,
      provider: "AmBank",
      name: "AmIslamic Money Market Fund",
      yield: 3.4,
      fee: 0.4,
      minInvestment: 10000,
      liquidity: "T+2",
      shariah: true,
      riskLevel: "Low",
      fundSize: "RM 1.2B",
      history: [
        { date: "Jan", yield: 3.25 },
        { date: "Feb", yield: 3.3 },
        { date: "Mar", yield: 3.35 },
        { date: "Apr", yield: 3.38 },
        { date: "May", yield: 3.4 },
        { date: "Jun", yield: 3.4 },
      ],
    },
    {
      id: 5,
      provider: "RHB",
      name: "RHB Cash Management Fund",
      yield: 3.2,
      fee: 0.3,
      minInvestment: 5000,
      liquidity: "T+1",
      shariah: false,
      riskLevel: "Low",
      fundSize: "RM 1.5B",
      history: [
        { date: "Jan", yield: 3.05 },
        { date: "Feb", yield: 3.1 },
        { date: "Mar", yield: 3.15 },
        { date: "Apr", yield: 3.18 },
        { date: "May", yield: 3.2 },
        { date: "Jun", yield: 3.2 },
      ],
    },
    {
      id: 6,
      provider: "Hong Leong",
      name: "Hong Leong Islamic Money Market Fund",
      yield: 3.3,
      fee: 0.35,
      minInvestment: 1000,
      liquidity: "T+0",
      shariah: true,
      riskLevel: "Low",
      fundSize: "RM 950M",
      history: [
        { date: "Jan", yield: 3.15 },
        { date: "Feb", yield: 3.2 },
        { date: "Mar", yield: 3.25 },
        { date: "Apr", yield: 3.28 },
        { date: "May", yield: 3.3 },
        { date: "Jun", yield: 3.3 },
      ],
    },
  ]

  const filteredFunds = funds
    .filter((fund) => {
      // Search filter
      if (
        searchQuery &&
        !fund.provider.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !fund.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Shariah filter
      if (filterType === "shariah" && !fund.shariah) {
        return false
      }
      if (filterType === "conventional" && fund.shariah) {
        return false
      }

      // Liquidity filter
      if (liquidityFilter && fund.liquidity !== liquidityFilter) {
        return false
      }

      // Min investment filter
      if (minInvestmentFilter) {
        const minAmount = Number.parseInt(minInvestmentFilter.replace("RM", "").replace("K", "000"))
        if (fund.minInvestment > minAmount) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      if (sortBy === "yield") {
        return b.yield - a.yield
      } else if (sortBy === "fee") {
        return a.fee - b.fee
      } else {
        return a.provider.localeCompare(b.provider)
      }
    })

  const handleBackClick = () => {
    router.push("/")
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch)
    if (showSearch) {
      setSearchQuery("")
    }
  }

  const handleFundClick = (fund: Fund) => {
    setSelectedFund(fund)
  }

  const closeModal = () => {
    setSelectedFund(null)
  }

  return (
    <div className="bg-white min-h-screen relative w-full max-w-sm mx-auto">
      {/* Header */}
      <header className="fixed top-0 w-full max-w-sm bg-white z-10 px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleBackClick}>
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Button>
        <h1 className="text-xl font-semibold text-center">Money Market Funds</h1>
        <Button variant="ghost" size="icon" onClick={toggleSearch}>
          <Search className="w-5 h-5 text-gray-700" />
        </Button>
      </header>

      {/* Search Bar */}
      {showSearch && (
        <div className="fixed top-[60px] w-full max-w-sm bg-white z-10 px-4 py-3 border-b border-gray-100">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by provider or fund name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pr-10 bg-gray-100 rounded-lg text-sm border-none"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 text-gray-500"
                onClick={() => setSearchQuery("")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`pt-16 px-4 pb-4 ${showSearch ? "mt-12" : ""}`}>
        {/* Filter Section */}
        <section className="mt-4 mb-6">
          <div className="flex overflow-x-auto pb-2 no-scrollbar">
            {/* Fund Type Filter */}
            <div className="flex bg-gray-100 rounded-lg p-1 mr-3 min-w-max">
              <Button
                variant={filterType === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  filterType === "all" ? "bg-white shadow-sm text-blue-600" : "text-gray-600"
                }`}
              >
                All
              </Button>
              <Button
                variant={filterType === "shariah" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilterType("shariah")}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  filterType === "shariah" ? "bg-white shadow-sm text-blue-600" : "text-gray-600"
                }`}
              >
                Shariah
              </Button>
              <Button
                variant={filterType === "conventional" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilterType("conventional")}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  filterType === "conventional" ? "bg-white shadow-sm text-blue-600" : "text-gray-600"
                }`}
              >
                Conventional
              </Button>
            </div>

            {/* Liquidity Filter */}
            <div className="flex space-x-2 mr-3 min-w-max">
              {["T+0", "T+1", "T+2"].map((option) => (
                <Button
                  key={option}
                  variant="ghost"
                  size="sm"
                  onClick={() => setLiquidityFilter(liquidityFilter === option ? null : option)}
                  className={`px-3 py-1.5 text-sm rounded-lg ${
                    liquidityFilter === option
                      ? "bg-blue-100 text-blue-600 border border-blue-200"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>

            {/* Min Investment Filter */}
            <div className="flex space-x-2 min-w-max">
              {["RM1K", "RM5K", "RM10K"].map((option) => (
                <Button
                  key={option}
                  variant="ghost"
                  size="sm"
                  onClick={() => setMinInvestmentFilter(minInvestmentFilter === option ? null : option)}
                  className={`px-3 py-1.5 text-sm rounded-lg ${
                    minInvestmentFilter === option
                      ? "bg-blue-100 text-blue-600 border border-blue-200"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-4 relative">
            <Button
              variant="ghost"
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="flex items-center text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-lg"
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Sort by:
              <span className="font-medium ml-1">
                {sortBy === "yield" ? "Highest Yield" : sortBy === "fee" ? "Lowest Fee" : "Provider Name"}
              </span>
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showSortOptions ? "rotate-180" : ""}`} />
            </Button>

            {showSortOptions && (
              <Card className="absolute top-full left-0 mt-1 w-48 z-10">
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSortBy("yield")
                      setShowSortOptions(false)
                    }}
                    className={`w-full justify-start px-4 py-2.5 text-sm hover:bg-gray-50 ${sortBy === "yield" ? "text-blue-600 font-medium" : "text-gray-700"}`}
                  >
                    <Percent className="w-4 h-4 mr-2" />
                    Highest Yield
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSortBy("fee")
                      setShowSortOptions(false)
                    }}
                    className={`w-full justify-start px-4 py-2.5 text-sm hover:bg-gray-50 ${sortBy === "fee" ? "text-blue-600 font-medium" : "text-gray-700"}`}
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    Lowest Fee
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSortBy("provider")
                      setShowSortOptions(false)
                    }}
                    className={`w-full justify-start px-4 py-2.5 text-sm hover:bg-gray-50 ${sortBy === "provider" ? "text-blue-600 font-medium" : "text-gray-700"}`}
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Provider Name
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Fund List */}
        <section className="space-y-4">
          {filteredFunds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Search className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-center">No funds match your search criteria</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("")
                  setFilterType("all")
                  setLiquidityFilter(null)
                  setMinInvestmentFilter(null)
                }}
                className="mt-4 text-blue-500 font-medium"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            filteredFunds.map((fund) => (
              <Card
                key={fund.id}
                onClick={() => handleFundClick(fund)}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                        <Building2 className="w-4 h-4 text-gray-600" />
                      </div>
                      <h3 className="font-medium">{fund.provider}</h3>
                      {fund.shariah && (
                        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                          Shariah
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{fund.name}</p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="flex items-center">
                        <Coins className="w-4 h-4 text-gray-400 mr-2" />
                        <span>Min: RM {fund.minInvestment.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <span>Liquidity: {fund.liquidity}</span>
                      </div>
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 text-gray-400 mr-2" />
                        <span>Fee: {fund.fee}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-semibold text-blue-600 mb-1">{fund.yield}%</div>
                    <div className="text-xs text-gray-500">Current Yield</div>
                    <Button size="sm" className="mt-4 bg-blue-50 text-blue-600 hover:bg-blue-100">
                      Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </section>
      </main>

      {/* Fund Detail Modal */}
      {selectedFund && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-end justify-center">
          <Card className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-t-2xl animate-slide-up">
            <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold">{selectedFund.name}</h2>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>

            <CardContent className="p-4">
              {/* Provider Info */}
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <Building2 className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium">{selectedFund.provider}</h3>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500">Fund Size: {selectedFund.fundSize}</div>
                    {selectedFund.shariah && (
                      <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                        Shariah
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Yield Display */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Current Yield</div>
                  <div className="text-3xl font-bold text-blue-600">{selectedFund.yield}%</div>
                </div>

                {/* Performance Chart */}
                <div className="h-40 mt-4 relative">
                  <div className="absolute inset-0 flex items-end">
                    {selectedFund.history.map((point, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-blue-400 rounded-t"
                          style={{
                            height: `${(point.yield / Math.max(...selectedFund.history.map((p) => p.yield))) * 80}%`,
                            minHeight: "10%",
                          }}
                        ></div>
                        <div className="text-xs text-gray-500 mt-1">{point.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fund Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Management Fee</div>
                  <div className="font-medium">{selectedFund.fee}%</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Min Investment</div>
                  <div className="font-medium">RM {selectedFund.minInvestment.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Liquidity</div>
                  <div className="font-medium">{selectedFund.liquidity}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Risk Level</div>
                  <div className="font-medium">{selectedFund.riskLevel}</div>
                </div>
              </div>

              {/* Fund Description */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">About this Fund</h3>
                <p className="text-sm text-gray-600">
                  {selectedFund.name} is a {selectedFund.shariah ? "Shariah-compliant" : "conventional"} money market
                  fund that aims to provide investors with regular income stream and high level of liquidity while
                  maintaining capital preservation.
                </p>
              </div>

              {/* Key Features */}
              <div className="mb-8">
                <h3 className="font-medium mb-2">Key Features</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Low risk investment with competitive returns</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>{selectedFund.liquidity} liquidity for quick access to your funds</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>No sales charge or exit fee</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>
                      {selectedFund.shariah ? "Shariah-compliant investment" : "Professionally managed portfolio"}
                    </span>
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <Button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700">
                Invest Now
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overlay to close sort options when clicking outside */}
      {showSortOptions && <div className="fixed inset-0 z-5" onClick={() => setShowSortOptions(false)}></div>}

      <style jsx>{`
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
