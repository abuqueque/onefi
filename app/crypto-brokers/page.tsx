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
  CheckCircle,
  Shield,
  Star,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface CryptoBroker {
  id: number
  name: string
  tradingFee: number
  minDeposit: number
  beginnerFriendly: boolean
  licensed: boolean
  features: string[]
  supportedCoins: number
  withdrawalFee: string
  affiliateUrl: string
}

export default function CryptoBrokersPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [beginnerFilter, setBeginnerFilter] = useState(false)
  const [minDepositFilter, setMinDepositFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("fee")
  const [showSortOptions, setShowSortOptions] = useState(false)
  const [selectedBroker, setSelectedBroker] = useState<CryptoBroker | null>(null)

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const cryptoBrokers: CryptoBroker[] = [
    {
      id: 1,
      name: "Luno",
      tradingFee: 0.1,
      minDeposit: 50,
      beginnerFriendly: true,
      licensed: true,
      features: ["Easy to use", "Educational content", "Instant buy/sell", "Recurring buys", "Mobile app"],
      supportedCoins: 8,
      withdrawalFee: "Free for BTC/ETH",
      affiliateUrl: "https://luno.com/my",
    },
    {
      id: 2,
      name: "Tokenize Xchange",
      tradingFee: 0.2,
      minDeposit: 100,
      beginnerFriendly: true,
      licensed: true,
      features: ["Local exchange", "Ringgit deposits", "Advanced trading", "API access", "Staking rewards"],
      supportedCoins: 50,
      withdrawalFee: "0.0005 BTC",
      affiliateUrl: "https://tokenize.exchange",
    },
    {
      id: 3,
      name: "Sinegy",
      tradingFee: 0.25,
      minDeposit: 100,
      beginnerFriendly: false,
      licensed: true,
      features: ["Professional trading", "Advanced charts", "Margin trading", "Futures", "OTC desk"],
      supportedCoins: 100,
      withdrawalFee: "Network fees apply",
      affiliateUrl: "https://sinegy.com",
    },
    {
      id: 4,
      name: "MEXC Global",
      tradingFee: 0.1,
      minDeposit: 10,
      beginnerFriendly: true,
      licensed: false,
      features: ["Low fees", "Wide selection", "Spot trading", "Futures", "Copy trading"],
      supportedCoins: 1500,
      withdrawalFee: "Varies by coin",
      affiliateUrl: "https://mexc.com",
    },
    {
      id: 5,
      name: "Binance",
      tradingFee: 0.1,
      minDeposit: 15,
      beginnerFriendly: true,
      licensed: false,
      features: ["Global leader", "Extensive features", "DeFi integration", "NFT marketplace", "Earn products"],
      supportedCoins: 600,
      withdrawalFee: "Network fees",
      affiliateUrl: "https://binance.com",
    },
    {
      id: 6,
      name: "Bybit",
      tradingFee: 0.1,
      minDeposit: 1,
      beginnerFriendly: false,
      licensed: false,
      features: ["Derivatives focus", "High leverage", "Copy trading", "Launchpad", "Web3 wallet"],
      supportedCoins: 300,
      withdrawalFee: "Network fees",
      affiliateUrl: "https://bybit.com",
    },
  ]

  const filteredBrokers = cryptoBrokers
    .filter((broker) => {
      // Search filter
      if (searchQuery && !broker.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Beginner filter
      if (beginnerFilter && !broker.beginnerFriendly) {
        return false
      }

      // Min deposit filter
      if (minDepositFilter) {
        const minAmount = Number.parseInt(minDepositFilter.replace("RM", ""))
        if (broker.minDeposit > minAmount) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      if (sortBy === "fee") {
        return a.tradingFee - b.tradingFee
      } else if (sortBy === "deposit") {
        return a.minDeposit - b.minDeposit
      } else {
        return a.name.localeCompare(b.name)
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

  const handleBrokerClick = (broker: CryptoBroker) => {
    setSelectedBroker(broker)
  }

  const closeModal = () => {
    setSelectedBroker(null)
  }

  return (
    <div className="bg-white min-h-screen relative w-full max-w-sm mx-auto">
      {/* Header */}
      <header className="fixed top-0 w-full max-w-sm bg-white z-10 px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleBackClick}>
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Button>
        <h1 className="text-xl font-semibold text-center">Crypto Brokers</h1>
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
              placeholder="Search by broker name"
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
            {/* Beginner Friendly Filter */}
            <div className="flex mr-3 min-w-max">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBeginnerFilter(!beginnerFilter)}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  beginnerFilter ? "bg-blue-100 text-blue-600 border border-blue-200" : "bg-gray-100 text-gray-600"
                }`}
              >
                <Star className="w-4 h-4 mr-1" />
                Beginner Friendly
              </Button>
            </div>

            {/* Min Deposit Filter */}
            <div className="flex space-x-2 min-w-max">
              {["RM10", "RM50", "RM100"].map((option) => (
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
                {sortBy === "fee" ? "Lowest Fee" : sortBy === "deposit" ? "Lowest Deposit" : "Broker Name"}
              </span>
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showSortOptions ? "rotate-180" : ""}`} />
            </Button>

            {showSortOptions && (
              <Card className="absolute top-full left-0 mt-1 w-48 z-10">
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSortBy("fee")
                      setShowSortOptions(false)
                    }}
                    className={`w-full justify-start px-4 py-2.5 text-sm hover:bg-gray-50 ${sortBy === "fee" ? "text-blue-600 font-medium" : "text-gray-700"}`}
                  >
                    <Percent className="w-4 h-4 mr-2" />
                    Lowest Fee
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
                      setSortBy("name")
                      setShowSortOptions(false)
                    }}
                    className={`w-full justify-start px-4 py-2.5 text-sm hover:bg-gray-50 ${sortBy === "name" ? "text-blue-600 font-medium" : "text-gray-700"}`}
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Broker Name
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Broker List */}
        <section className="space-y-4">
          {filteredBrokers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Search className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-center">No brokers match your search criteria</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("")
                  setBeginnerFilter(false)
                  setMinDepositFilter(null)
                }}
                className="mt-4 text-blue-500 font-medium"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            filteredBrokers.map((broker) => (
              <Card
                key={broker.id}
                onClick={() => handleBrokerClick(broker)}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                        <Building2 className="w-4 h-4 text-gray-600" />
                      </div>
                      <h3 className="font-medium">{broker.name}</h3>
                      {broker.licensed && (
                        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Licensed
                        </Badge>
                      )}
                    </div>
                    {broker.beginnerFriendly && (
                      <Badge variant="secondary" className="mb-2 bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Beginner Friendly
                      </Badge>
                    )}

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="flex items-center">
                        <Coins className="w-4 h-4 text-gray-400 mr-2" />
                        <span>Min: RM {broker.minDeposit}</span>
                      </div>
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{broker.supportedCoins} coins</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-semibold text-blue-600 mb-1">{broker.tradingFee}%</div>
                    <div className="text-xs text-gray-500">Trading Fee</div>
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

      {/* Broker Detail Modal */}
      {selectedBroker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-end justify-center">
          <Card className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-t-2xl animate-slide-up">
            <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold">{selectedBroker.name}</h2>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>

            <CardContent className="p-4">
              {/* Broker Info */}
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <Building2 className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium">{selectedBroker.name}</h3>
                  <div className="flex items-center gap-2">
                    {selectedBroker.licensed && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Licensed
                      </Badge>
                    )}
                    {selectedBroker.beginnerFriendly && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Beginner Friendly
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Trading Fee Display */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Trading Fee</div>
                  <div className="text-3xl font-bold text-blue-600">{selectedBroker.tradingFee}%</div>
                  <div className="text-sm text-gray-500 mt-1">per transaction</div>
                </div>
              </div>

              {/* Broker Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Minimum Deposit</div>
                  <div className="font-medium">RM {selectedBroker.minDeposit}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Supported Coins</div>
                  <div className="font-medium">{selectedBroker.supportedCoins}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                  <div className="text-xs text-gray-500 mb-1">Withdrawal Fee</div>
                  <div className="font-medium">{selectedBroker.withdrawalFee}</div>
                </div>
              </div>

              {/* Key Features */}
              <div className="mb-8">
                <h3 className="font-medium mb-2">Key Features</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  {selectedBroker.features.map((feature, index) => (
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
                onClick={() => window.open(selectedBroker.affiliateUrl, "_blank")}
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
