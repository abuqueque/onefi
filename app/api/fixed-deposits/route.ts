import { NextResponse } from "next/server"

// This would typically fetch from your database or external API
export async function GET() {
  try {
    // Example: Fetch from external API
    // const response = await fetch('https://financial-api.com/fixed-deposits')
    // const data = await response.json()

    // For now, returning mock data (replace with real API call)
    const mockData = [
      {
        id: 1,
        bank: "Maybank",
        productName: "Maybank Fixed Deposit-i",
        interestRate: 3.85,
        tenure: "12M",
        minDeposit: 1000,
        islamic: true,
        features: ["Shariah-compliant", "Auto-renewal option", "Partial withdrawal"],
        terms: "Minimum deposit of RM1,000. Early withdrawal penalties apply.",
        affiliateUrl: "https://maybank.com/fd",
        lastUpdated: new Date().toISOString(),
      },
      // Add more banks...
    ]

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error fetching fixed deposits:", error)
    return NextResponse.json({ error: "Failed to fetch fixed deposits" }, { status: 500 })
  }
}
