"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CreditCard, Building, Smartphone, ArrowLeft, Shield, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PagamentoPage() {
  const [paymentMethod, setPaymentMethod] = useState("pix")
  const [isLoading, setIsLoading] = useState(false)
  const [paymentType, setPaymentType] = useState<"single" | "all">("single")
  const [installmentId, setInstallmentId] = useState<number | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const type = searchParams.get("type")
    const id = searchParams.get("installment")

    if (type === "all") {
      setPaymentType("all")
    } else if (id) {
      setInstallmentId(Number.parseInt(id))
      setPaymentType("single")
    }
  }, [searchParams])

  // Mock payment data
  const singlePayment = {
    amount: 2167,
    installment: installmentId || 1,
    dueDate: "2024-02-15",
  }

  const allPayments = {
    originalAmount: 43332,
    discount: 2600,
    finalAmount: 40732,
    installmentsCount: 20,
  }

  const currentPayment = paymentType === "all" ? allPayments : singlePayment

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Pagamento realizado com sucesso!",
        description:
          paymentType === "all"
            ? "Todas as parcelas foram quitadas. Parabéns!"
            : `Parcela ${singlePayment.installment} foi paga com sucesso.`,
      })

      router.push("/carteira-agricultor")
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {paymentType === "all" ? "Quitação Total" : "Pagamento de Parcela"}
            </h1>
            <p className="text-muted-foreground">
              {paymentType === "all"
                ? "Quite todas as parcelas pendentes e economize nos juros"
                : `Pague a parcela ${singlePayment.installment}/24`}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                {paymentType === "all" ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor original:</span>
                      <span>R$ {allPayments.originalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Desconto antecipação:</span>
                      <span className="text-green-600">- R$ {allPayments.discount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Total a pagar:</span>
                      <span className="font-bold text-xl">R$ {allPayments.finalAmount.toLocaleString()}</span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-sm">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Economia de R$ {allPayments.discount.toLocaleString()}</span>
                      </div>
                      <p className="text-green-600 mt-1">
                        Quitando hoje, você economiza {allPayments.installmentsCount} parcelas de juros!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Parcela:</span>
                      <span>{singlePayment.installment}/24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vencimento:</span>
                      <span>{new Date(singlePayment.dueDate).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Valor:</span>
                      <span className="font-bold text-xl">R$ {singlePayment.amount.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Forma de Pagamento</CardTitle>
                <CardDescription>Escolha como deseja pagar</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="pix" id="pix" />
                      <div className="flex items-center space-x-3 flex-1">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor="pix" className="font-medium">
                            PIX
                          </Label>
                          <p className="text-sm text-muted-foreground">Processamento instantâneo</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <div className="flex items-center space-x-3 flex-1">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor="credit-card" className="font-medium">
                            Cartão de Crédito
                          </Label>
                          <p className="text-sm text-muted-foreground">Processamento instantâneo</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                      <div className="flex items-center space-x-3 flex-1">
                        <Building className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor="bank-transfer" className="font-medium">
                            Transferência Bancária
                          </Label>
                          <p className="text-sm text-muted-foreground">1-2 dias úteis para compensação</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>

                  {/* Security Notice */}
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Pagamento 100% Seguro</p>
                        <p className="text-muted-foreground">
                          Seus dados são protegidos com criptografia de ponta. O pagamento será processado de forma
                          segura.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12" disabled={isLoading}>
                    {isLoading
                      ? "Processando..."
                      : paymentType === "all"
                        ? `Quitar por R$ ${allPayments.finalAmount.toLocaleString()}`
                        : `Pagar R$ ${singlePayment.amount.toLocaleString()}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
