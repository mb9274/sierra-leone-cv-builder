import { type NextRequest } from "next/server"
import { ApiResponse, handleApiError } from "@/lib/api-utils"

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, provider, productId, amount } = await req.json()

    // Validate input
    if (!phoneNumber || !provider || !productId || !amount) {
      return ApiResponse.error("Missing required fields: phoneNumber, provider, productId, amount", 400, "VALIDATION_ERROR")
    }

    // Validate phone number format (Sierra Leone)
    const phoneRegex = /^(\+232|0)(7[0-9]|3[0-9]|2[0-9]|8[0-9]|9[0-9])\d{6}$/
    if (!phoneRegex.test(phoneNumber)) {
      return ApiResponse.error("Invalid Sierra Leone phone number format", 400, "VALIDATION_ERROR")
    }

    // Validate provider
    const validProviders = ['orange', 'africell', 'airtel']
    if (!validProviders.includes(provider.toLowerCase())) {
      return ApiResponse.error("Invalid provider. Must be one of: orange, africell, airtel", 400, "VALIDATION_ERROR")
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0 || amount > 1000000) {
      return ApiResponse.error("Invalid amount. Must be a positive number up to 1,000,000 SLL", 400, "VALIDATION_ERROR")
    }

    console.log("[v0] Mobile payment initiated:", { phoneNumber, provider, productId, amount })

    // TODO: Integrate with actual Mobile Money API
    // For Orange Money: https://developer.orange.com/apis/orange-money-webpay/
    // For Afrimoney: Contact Africell for API documentation

    // Simulate API call
    const transactionId = `MM-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // In production, you would:
    // 1. Call the Mobile Money API
    // 2. Store the payment in database
    // 3. Set up webhook for payment confirmation
    // 4. Return transaction ID

    // Simulated success response
    return ApiResponse.success({
      transactionId,
      message: "Payment initiated. Please confirm on your phone.",
      provider,
      amount,
      phoneNumber,
      status: "pending"
    })
  } catch (error) {
    return handleApiError(error)
  }
}
