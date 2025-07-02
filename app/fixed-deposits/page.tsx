"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Search,
  X,
  ArrowUpDown,
  ChevronDown,
  Percent,
  Building2,
  Coins,
  CheckCircle,
  Calendar,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useFixedDeposits } from "@/hooks/useFinancialData"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { ErrorMessage } from "@/components/ErrorMessage"

export default function FixedDepositsPage() {
  const router = useRouter()
  const { data: fixedDeposits, loading, error, refresh, lastUpdated } = useFixedDeposits()

  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [filterType, setFilterType] = useState("all")
  const [tenureFilter, setTenureFilter] = useState<string | null>(null)
  const [minDepositFilter, setMinDepositFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("rate")
  const [showSortOptions, setShowSortOptions] = useState(false)
  const [selectedFD, setSelectedFD] = useState<any>(null)

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Filter and sort data
  const filteredFDs = useMemo(() => {
    if (!fixedDeposits) return []

    return fixedDeposits
      .filter((fd) => {
        // Search filter
        if (
          searchQuery &&
          !fd.bank.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !fd.product_name.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false
        }

        // Islamic filter
        if (filterType === "islamic" && !fd.is_islamic) {
          return false
        }
        if (filterType === "conventional" && fd.is_islamic) {
          return false
        }

        // Tenure filter
        if (tenureFilter && fd.tenure !== tenureFilter) {
          return false
        }

        // Min deposit filter
        if (minDepositFilter) {
          const minAmount = Number.parseInt(minDepositFilter.replace("RM", "").replace("K", "000"))
          if (fd.min_deposit > minAmount) {
            return false
          }
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === "rate") {
          return b.interest_rate - a.interest_rate
        } else if (sortBy === "deposit") {
          return a.min_deposit - b.min_deposit
        } else {
          return a.bank.localeCompare(b.bank)
        }
      })
  }, [fixedDeposits, searchQuery, filterType, tenureFilter, minDepositFilter, sortBy])

  const handleBackClick = () => {
    router.push("/")
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch)
    if (showSearch) {
      setSearchQuery("")
    }
  }

  const handleFDClick = (fd: any) => {
    setSelectedFD(fd)
  }

  const closeModal = () => {
    setSelectedFD(null)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white min-h-screen relative w-full max-w-sm mx-auto">
        <header className="fixed top-0 w-full max-w-sm bg-white z-10 px-4 py-4 border-b border-gray-100 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleBackClick}>
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>
          <h1 className="text-xl font-semibold text-center">Fixed Deposits</h1>
          <div className="w-10" />
        </header>
        <div className="pt-16">
          <LoadingSpinner size="lg" text="Loading fixed deposit rates..." />
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white min-h-screen relative w-full max-w-sm mx-auto">
        <header className="fixed top-0 w-full max-w-sm bg-white z-10 px-4 py-4 border-b border-gray-100 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleBackClick}>
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>
          <h1 className="text-xl font-semibold text-center">Fixed Deposits</h1>
          <div className="w-10" />
        </header>
        <div className="pt-16">
          <ErrorMessage message={error} onRetry={refresh} />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen relative w-full max-w-sm mx-auto">
      {/* Header */}
      <header className="fixed top-0 w-full max-w-sm bg-white z-10 px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleBackClick}>
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-xl font-semibold">Fixed Deposits</h1>
          {lastUpdated && <p className="text-xs text-gray-500">Updated {new Date(lastUpdated).toLocaleTimeString()}</p>}
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={refresh} className="mr-1">
            <RefreshCw className="w-4 h-4 text-gray-700" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleSearch}>
            <Search className="w-5 h-5 text-gray-700" />
          </Button>
        </div>
      </header>

      {/* Search Bar */}
      {showSearch && (
        <div className="fixed top-[60px] w-full max-w-sm bg-white z-10 px-4 py-3 border-b border-gray-100">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by bank or product name"
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
            {/* Bank Type Filter */}
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
                variant={filterType === "islamic" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilterType("islamic")}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  filterType === "islamic" ? "bg-white shadow-sm text-blue-600" : "text-gray-600"
                }`}
              >
                Islamic
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

            {/* Tenure Filter */}
            <div className="flex space-x-2 mr-3 min-w-max">
              {["3M", "6M", "12M", "24M"].map((option) => (
                <Button
                  key={option}
                  variant="ghost"
                  size="sm"
                  onClick={() => setTenureFilter(tenureFilter === option ? null : option)}
                  className={`px-3 py-1.5 text-sm rounded-lg ${
                    tenureFilter === option
                      ? "bg-blue-100 text-blue-600 border border-blue-200"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>

            {/* Min Deposit Filter */}
            <div className="flex space-x-2 min-w-max">
              {["RM1K", "RM5K", "RM10K"].map((option) => (
                <Button
                  key={option}
                  variant="ghost"
                  size="sm"
                  onClick={() => setMinDepositFilter(minDepositFilter === option ? null : option)}
                  className={`px-3 py-1.5 text-sm rounded-lg ${
                    minDepositFilter === option
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
                {sortBy === "rate" ? "Highest Rate" : sortBy === "deposit" ? "Lowest Deposit" : "Bank Name"}
              </span>
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showSortOptions ? "rotate-180" : ""}`} />
            </Button>

            {showSortOptions && (
              <Card className="absolute top-full left-0 mt-1 w-48 z-10">
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSortBy("rate")
                      setShowSortOptions(false)
                    }}
                    className={`w-full justify-start px-4 py-2.5 text-sm hover:bg-gray-50 ${sortBy === "rate" ? "text-blue-600 font-medium" : "text-gray-700"}`}
                  >
                    <Percent className="w-4 h-4 mr-2" />
                    Highest Rate
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSortBy("deposit")
                      setShowSortOptions(false)
                    }}
                    className={`w-full justify-start px-4 py-2.5 text-sm hover:bg-gray-50 ${sortBy === "deposit" ? "text-blue-600 font-medium" : "text-gray-700"}`}
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Lowest Deposit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSortBy("bank")
                      setShowSortOptions(false)
                    }}
                    className={`w-full justify-start px-4 py-2.5 text-sm hover:bg-gray-50 ${sortBy === "bank" ? "text-blue-600 font-medium" : "text-gray-700"}`}
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Bank Name
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* FD List */}
        <section className="space-y-4">
          {filteredFDs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Search className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-center">No fixed deposits match your search criteria</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("")
                  setFilterType("all")
                  setTenureFilter(null)
                  setMinDepositFilter(null)
                }}
                className="mt-4 text-blue-500 font-medium"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            filteredFDs.map((fd) => (
              <Card
                key={fd.id}
                onClick={() => handleFDClick(fd)}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                        <Building2 className="w-4 h-4 text-gray-600" />
                      </div>
                      <h3 className="font-medium">{fd.bank}</h3>
                      {fd.is_islamic && (
                        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                          Islamic
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{fd.product_name}</p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="flex items-center">
                        <Coins className="w-4 h-4 text-gray-400 mr-2" />
                        <span>Min: RM {fd.min_deposit.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span>Tenure: {fd.tenure}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-semibold text-blue-600 mb-1">{fd.interest_rate}%</div>
                    <div className="text-xs text-gray-500">Interest Rate</div>
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

      {/* FD Detail Modal */}
      {selectedFD && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-end justify-center">
          <Card className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-t-2xl animate-slide-up">
            <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold">{selectedFD.product_name}</h2>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>

            <CardContent className="p-4">
              {/* Bank Info */}
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <Building2 className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium">{selectedFD.bank}</h3>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500">Fixed Deposit Product</div>
                    {selectedFD.is_islamic && (
                      <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                        Islamic
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Interest Rate Display */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Interest Rate</div>
                  <div className="text-3xl font-bold text-blue-600">{selectedFD.interest_rate}%</div>
                  <div className="text-sm text-gray-500 mt-1">per annum</div>
                </div>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Minimum Deposit</div>
                  <div className="font-medium">RM {selectedFD.min_deposit.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Tenure</div>
                  <div className="font-medium">{selectedFD.tenure}</div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Terms & Conditions</h3>
                <p className="text-sm text-gray-600">{selectedFD.terms}</p>
              </div>

              {/* Key Features */}
              <div className="mb-8">
                <h3 className="font-medium mb-2">Key Features</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  {selectedFD.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Button
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700"
                onClick={() => window.open(selectedFD.affiliate_url, "_blank")}
              >
                Open Account
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
