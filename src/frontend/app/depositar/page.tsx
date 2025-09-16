"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building2,
  Shield,
  CheckCircle,
  TrendingUp,
  Heart,
  Sprout,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RouteGuard } from "@/components/auth/route-guard"

export default function DepositPage() {
  const [userType, setUserType] = useState<string | null>(null)
  const [step, setStep] = useState(1) // 1: amount, 2: payment method, 3: confirmation, 4: choice, 5: success
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [actionChoice, setActionChoice] = useState<"invest" | "donate" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    pixKey: "",
    bankCode: "",
    agency: "",
    account: "",
  })
  const router = useRouter()

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType")

    if (storedUserType !== "donor") {
      router.push("/login")
      return
    }

    setUserType(storedUserType)
  }, [router])

  const handleAmountSubmit = () => {
    const numAmount = Number.parseFloat(amount)
    if (numAmount >= 50) {
      setStep(2)
    }
  }

  const handlePaymentSubmit = () => {
    setStep(3)
  }

  const handleConfirmPayment = () => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setStep(4) // Go to choice step instead of success
    }, 3000)
  }

  const handleActionChoice = (choice: "invest" | "donate") => {
    setActionChoice(choice)
    localStorage.setItem("donorType", choice === "invest" ? "investment" : "donation")
    setStep(5) // Now go to success
  }

  if (step === 5) {
    return (
      <RouteGuard allowedUserTypes={["donor"]}>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card className="border-green-200 bg-white/80">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Depósito Realizado!</CardTitle>
                <CardDescription className="text-green-600">Seu saldo foi atualizado com sucesso</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600">Valor depositado</p>
                  <p className="text-2xl font-bold text-green-700">R$ {Number.parseFloat(amount).toLocaleString()}</p>
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <Shield className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-sm text-green-700">
                    <strong>Próximo passo:</strong> Agora você pode {actionChoice === "invest" ? "investir" : "doar"}{" "}
                    seu dinheiro para agricultores de forma anônima.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col gap-2">
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <Link href={actionChoice === "invest" ? "/investir" : "/doar"}>
                      {actionChoice === "invest" ? "Investir Agora" : "Fazer Doação"}
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                  >
                    <Link href="/carteira-doador">Voltar à Carteira</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </RouteGuard>
    )
  }

  if (step === 4) {
    return (
      <RouteGuard allowedUserTypes={["donor"]}>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <Card className="border-green-200 bg-white/80">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sprout className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Como você quer usar seu dinheiro?</CardTitle>
                <CardDescription className="text-green-600">
                  Escolha entre investir (com retorno) ou doar (impacto social puro)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Investment Option */}
                  <Card
                    className="cursor-pointer border-2 hover:border-green-400 transition-colors bg-gradient-to-br from-green-50 to-emerald-50"
                    onClick={() => handleActionChoice("invest")}
                  >
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-green-800">Investir</CardTitle>
                      <CardDescription className="text-green-600">Ajude agricultores e receba retorno</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center p-3 bg-white/70 rounded-lg">
                        <p className="text-sm text-green-600">Retorno esperado</p>
                        <p className="text-xl font-bold text-green-700">10% ao ano</p>
                      </div>
                      <ul className="text-sm text-green-600 space-y-1">
                        <li>• Receba seu dinheiro de volta com juros</li>
                        <li>• Prazo de 24 meses</li>
                        <li>• Distribuição anônima</li>
                        <li>• Impacto social + retorno financeiro</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Donation Option */}
                  <Card
                    className="cursor-pointer border-2 hover:border-red-400 transition-colors bg-gradient-to-br from-red-50 to-pink-50"
                    onClick={() => handleActionChoice("donate")}
                  >
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-red-800">Doar</CardTitle>
                      <CardDescription className="text-red-600">Transforme vidas sem esperar retorno</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center p-3 bg-white/70 rounded-lg">
                        <p className="text-sm text-red-600">Impacto social</p>
                        <p className="text-xl font-bold text-red-700">100% puro</p>
                      </div>
                      <ul className="text-sm text-red-600 space-y-1">
                        <li>• Doação integral para agricultores</li>
                        <li>• Sem expectativa de retorno</li>
                        <li>• Distribuição anônima</li>
                        <li>• Máximo impacto social</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <Shield className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-sm text-green-700">
                    <strong>Anonimato garantido:</strong> Em ambas as opções, nem você nem os agricultores saberão da
                    conexão. O sistema faz a distribuição automaticamente.
                  </AlertDescription>
                </Alert>

                <div className="text-center">
                  <p className="text-sm text-green-600 mb-4">
                    Valor disponível: <strong>R$ {Number.parseFloat(amount).toLocaleString()}</strong>
                  </p>
                  <p className="text-xs text-green-500">
                    Você pode alterar sua preferência a qualquer momento nas configurações
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </RouteGuard>
    )
  }

  return (
    <RouteGuard allowedUserTypes={["donor"]}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/carteira-doador">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-green-800">Adicionar Saldo</h1>
              <p className="text-green-600">Deposite dinheiro para investir ou doar</p>
            </div>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                1
              </div>
              <div className={`w-12 h-1 ${step >= 2 ? "bg-green-600" : "bg-gray-200"}`} />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
              <div className={`w-12 h-1 ${step >= 3 ? "bg-green-600" : "bg-gray-200"}`} />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 3 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                3
              </div>
            </div>
          </div>

          {step === 1 && (
            <Card className="border-green-200 bg-white/80">
              <CardHeader>
                <CardTitle className="text-green-800">Quanto você quer depositar?</CardTitle>
                <CardDescription className="text-green-600">Valor mínimo de R$ 50,00</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-green-700">
                    Valor (R$)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="50"
                    step="0.01"
                    className="border-green-300 focus:border-green-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[100, 500, 1000].map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      onClick={() => setAmount(value.toString())}
                      className="h-12 border-green-300 text-green-700 hover:bg-green-50"
                    >
                      R$ {value}
                    </Button>
                  ))}
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <Shield className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Seus dados financeiros são protegidos com criptografia de ponta. Transações processadas por
                    parceiros certificados.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleAmountSubmit}
                  disabled={!amount || Number.parseFloat(amount) < 50}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Continuar
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-green-200 bg-white/80">
              <CardHeader>
                <CardTitle className="text-green-800">Escolha a forma de pagamento</CardTitle>
                <CardDescription className="text-green-600">Selecione o método de pagamento desejado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <div className="flex items-center space-x-3 flex-1">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <Label htmlFor="credit_card" className="font-medium">
                          Cartão de Crédito
                        </Label>
                        <p className="text-sm text-muted-foreground">Processamento instantâneo</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <div className="flex items-center space-x-3 flex-1">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <Label htmlFor="bank_transfer" className="font-medium">
                          Transferência Bancária
                        </Label>
                        <p className="text-sm text-muted-foreground">1-2 dias úteis para compensação</p>
                      </div>
                    </div>
                  </div>

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
                </RadioGroup>

                <Button
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Continuar
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="border-green-200 bg-white/80">
              <CardHeader>
                <CardTitle className="text-green-800">Confirmação de Depósito</CardTitle>
                <CardDescription className="text-green-600">Revise os detalhes antes de confirmar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <h3 className="font-semibold mb-2">Resumo do Depósito</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Valor:</span>
                      <span>R$ {Number.parseFloat(amount || "0").toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa:</span>
                      <span>R$ 0,00</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-1">
                      <span>Total:</span>
                      <span>R$ {Number.parseFloat(amount || "0").toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12" disabled={isProcessing} onClick={handleConfirmPayment}>
                  {isProcessing
                    ? "Processando..."
                    : `Depositar R$ ${Number.parseFloat(amount || "0").toLocaleString()}`}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </RouteGuard>
  )
}
