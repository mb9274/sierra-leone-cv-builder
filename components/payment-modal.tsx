"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Smartphone, Wallet, Loader2, CheckCircle, XCircle } from "lucide-react"
import type { PremiumProduct } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: PremiumProduct
  onSuccess?: () => void
}

export function PaymentModal({ open, onOpenChange, product, onSuccess }: PaymentModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "success" | "failed">("idle")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [provider, setProvider] = useState<"orange" | "africell">("orange")

  const handleMobilePayment = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setPaymentStatus("pending")

    try {
      const response = await fetch("/api/pay/mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          provider,
          productId: product.id,
          amount: product.priceSLL,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setPaymentStatus("success")
        toast({
          title: "Payment Initiated",
          description: "Please confirm the payment on your phone",
        })

        // Simulate payment confirmation (in real app, this would be a webhook)
        setTimeout(() => {
          toast({
            title: "Payment Successful!",
            description: `You now have access to ${product.name}`,
          })
          onSuccess?.()
          setTimeout(() => onOpenChange(false), 2000)
        }, 3000)
      } else {
        throw new Error(data.error || "Payment failed")
      }
    } catch (error) {
      setPaymentStatus("failed")
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSolanaPayment = async () => {
    setLoading(true)
    setPaymentStatus("pending")

    try {
      const response = await fetch("/api/pay/solana", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          amount: product.priceSOL,
        }),
      })

      const data = await response.json()

      if (data.success && data.paymentUrl) {
        // Open Solana Pay in new window
        window.open(data.paymentUrl, "_blank")

        toast({
          title: "Solana Pay Opened",
          description: "Complete the payment in the new window",
        })

        // Simulate payment confirmation
        setTimeout(() => {
          setPaymentStatus("success")
          toast({
            title: "Payment Successful!",
            description: `You now have access to ${product.name}`,
          })
          onSuccess?.()
          setTimeout(() => onOpenChange(false), 2000)
        }, 5000)
      } else {
        throw new Error(data.error || "Payment failed")
      }
    } catch (error) {
      setPaymentStatus("failed")
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>Choose your preferred payment method</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Summary */}
          <div className="p-4 rounded-lg bg-muted">
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price:</span>
              <span className="font-bold">
                SLL {product.priceSLL} / {product.priceSOL} SOL
              </span>
            </div>
          </div>

          {/* Payment Status */}
          {paymentStatus !== "idle" && (
            <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-muted">
              {paymentStatus === "pending" && (
                <>
                  <Loader2 className="size-5 animate-spin text-[#4CAF50]" />
                  <span>Processing payment...</span>
                </>
              )}
              {paymentStatus === "success" && (
                <>
                  <CheckCircle className="size-5 text-[#4CAF50]" />
                  <span className="text-[#4CAF50] font-semibold">Payment Successful!</span>
                </>
              )}
              {paymentStatus === "failed" && (
                <>
                  <XCircle className="size-5 text-destructive" />
                  <span className="text-destructive font-semibold">Payment Failed</span>
                </>
              )}
            </div>
          )}

          {/* Payment Methods */}
          <Tabs defaultValue="mobile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mobile">
                <Smartphone className="mr-2 size-4" />
                Mobile Money
              </TabsTrigger>
              <TabsTrigger value="solana">
                <Wallet className="mr-2 size-4" />
                Solana Pay
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mobile" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <div className="flex gap-2">
                  <Button
                    variant={provider === "orange" ? "default" : "outline"}
                    className={provider === "orange" ? "flex-1 bg-[#4CAF50] hover:bg-[#45a049]" : "flex-1"}
                    onClick={() => setProvider("orange")}
                  >
                    Orange Money
                  </Button>
                  <Button
                    variant={provider === "africell" ? "default" : "outline"}
                    className={provider === "africell" ? "flex-1 bg-[#4CAF50] hover:bg-[#45a049]" : "flex-1"}
                    onClick={() => setProvider("africell")}
                  >
                    Afrimoney
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+232 XX XXX XXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <Button
                className="w-full bg-[#4CAF50] hover:bg-[#45a049]"
                onClick={handleMobilePayment}
                disabled={loading || !phoneNumber}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Pay SLL {product.priceSLL}</>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="solana" className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Pay with Solana using your Phantom or Solflare wallet.</p>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span>Amount:</span>
                    <span className="font-semibold text-foreground">{product.priceSOL} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network:</span>
                    <span className="font-semibold text-foreground">Solana Devnet</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-[#4CAF50] hover:bg-[#45a049]"
                onClick={handleSolanaPayment}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Pay with Solana</>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
