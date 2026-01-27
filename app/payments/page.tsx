"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Check, ArrowLeft } from "lucide-react"
import { premiumProducts } from "@/lib/premium-products"
import { PaymentModal } from "@/components/payment-modal"
import type { PremiumProduct } from "@/lib/types"
import { Toaster } from "@/components/ui/toaster"

export default function PaymentsPage() {
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<PremiumProduct | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handlePurchase = (product: PremiumProduct) => {
    setSelectedProduct(product)
    setModalOpen(true)
  }

  const handlePaymentSuccess = () => {
    // Store purchased product in localStorage
    const purchased = JSON.parse(localStorage.getItem("purchased_products") || "[]")
    if (selectedProduct && !purchased.includes(selectedProduct.id)) {
      purchased.push(selectedProduct.id)
      localStorage.setItem("purchased_products", JSON.stringify(purchased))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-lg bg-[#4CAF50] flex items-center justify-center">
              <FileText className="size-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Konek Salone</h1>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Premium Features</h2>
          <p className="text-xl text-muted-foreground">
            Upgrade your CV and unlock powerful features to stand out to employers
          </p>
        </div>

        {/* Products Grid */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {premiumProducts.map((product) => (
            <Card key={product.id} className="border-2 border-[#4CAF50]/30 hover:border-[#4CAF50] transition-colors">
              <CardHeader>
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                <CardDescription className="text-base">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-[#4CAF50]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-[#4CAF50]">SLL {product.priceSLL}</span>
                    <span className="text-sm text-muted-foreground">or {product.priceSOL} SOL</span>
                  </div>
                  <Button
                    className="w-full bg-[#4CAF50] hover:bg-[#45a049]"
                    size="lg"
                    onClick={() => handlePurchase(product)}
                  >
                    Purchase Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Methods Info */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <h3 className="text-xl font-bold mb-4">Accepted Payment Methods</h3>
          <div className="flex justify-center gap-6 text-muted-foreground">
            <div>✓ Orange Money</div>
            <div>✓ Afrimoney</div>
            <div>✓ Solana Pay</div>
          </div>
        </div>
      </div>

      {selectedProduct && (
        <PaymentModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          product={selectedProduct}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <Toaster />
    </div>
  )
}
