"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, TrendingUp, Heart, Shield, CheckCircle, Sprout, Calculator } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RouteGuard } from "@/components/auth/route-guard"

export default function InvestPage() {
  const [userType, setUserType] = useState<string | null>(null)
  const [donorType, setDonorType] = useState<string | null>(null)
  const [actionType, setActionType] = useState<"investment" | "donation">("investment")
  const [amount, setAmount] = useState([1000])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  // Mock available balance
  const availableBalance = 5000

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType")
    const storedDonorType = localStorage.getItem("donorType")

    if (storedUserType !== "donor") {
      router.push("/login")
      return
    }

    setUserType(storedUserType)
    setDonorType(storedDonorType)
    setActionType(storedDonorType === "investment" ? "investment" : "donation")
  }, [router])

  const handleInvest = () => {
    setIsProcessing(true)

    // Simulate investment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <RouteGuard allowedUserTypes={["donor"]}>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card className="border-green-200 bg-white/90">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-green-700">
                  {actionType === "investment" ? "Investimento Realizado!" : "Doação Realizada!"}
                </CardTitle>
                <CardDescription className="text-green-600">
                  Seu dinheiro foi distribuído anonimamente para agricultores
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600">
                    {actionType === "investment" ? "Valor investido" : "Valor doado"}
                  </p>
                  <p className="text-2xl font-bold text-green-700">R$ {amount[0].toLocaleString()}</p>
                </div>

                {actionType === "investment" && (
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-sm text-emerald-600">Retorno esperado em 2 anos</p>
                    <p className="text-xl font-bold text-emerald-700">R$ {(amount[0] * 1.21).toLocaleString()}</p>
                  </div>
                )}

                <Alert className="border-green-200 bg-green-50">
                  <Shield className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-sm text-green-700">
                    O sistema fez a distribuição automática e anônima. Você pode acompanhar o impacto na sua carteira.
                  </AlertDescription>
                </Alert>

                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href="/carteira-doador">Voltar à Carteira</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </RouteGuard>
    )
  }

  const expectedReturn = actionType === "investment" ? amount[0] * 1.21 : 0
  const monthlyReturn = actionType === "investment" ? (amount[0] * 0.21) / 24 : 0

  return (
    <RouteGuard allowedUserTypes={["donor"]}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild className="text-green-700 hover:bg-green-100">
              <Link href="/carteira-doador">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-green-800">Apoiar Agricultores</h1>
              <p className="text-green-600">Escolha como você quer ajudar a agricultura familiar</p>
            </div>
          </div>

          <Card className="mb-8 border-green-200 bg-white/80">
            <CardHeader>
              <CardTitle className="text-green-800">Como você quer apoiar?</CardTitle>
              <CardDescription className="text-green-600">
                Escolha entre investir (com retorno) ou doar (sem retorno)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={actionType}
                onValueChange={(value) => setActionType(value as "investment" | "donation")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                    <RadioGroupItem value="investment" id="investment" />
                    <Label htmlFor="investment" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Investimento</p>
                        <p className="text-xs text-green-500">Prazo: 24 meses</p>
                      </div>
                    </Label>
                    {actionType === "investment" && <Badge className="bg-green-600">Selecionado</Badge>}
                  </div>

                  <div className="flex items-center space-x-3 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                    <RadioGroupItem value="donation" id="donation" />
                    <Label htmlFor="donation" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Heart className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Doação</p>
                        <p className="text-sm text-green-600">Apoio sem expectativa de retorno</p>
                        <p className="text-xs text-green-500">100% para o agricultor</p>
                      </div>
                    </Label>
                    {actionType === "donation" && <Badge className="bg-red-500">Selecionado</Badge>}
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Investment Form */}
            <Card className="border-green-200 bg-white/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  {actionType === "investment" ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <Heart className="h-5 w-5 text-red-500" />
                  )}
                  {actionType === "investment" ? "Valor do Investimento" : "Valor da Doação"}
                </CardTitle>
                <CardDescription className="text-green-600">
                  Saldo disponível: R$ {availableBalance.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-green-700">Valor (R$)</Label>
                    <div className="px-3 py-2 border border-green-300 rounded-md bg-white">
                      <span className="text-2xl font-bold text-green-800">R$ {amount[0].toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-green-700">Ajustar valor</Label>
                    <Slider
                      value={amount}
                      onValueChange={setAmount}
                      max={availableBalance}
                      min={100}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-green-600">
                      <span>R$ 100</span>
                      <span>R$ {availableBalance.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    {[500, 1000, 2000].map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        size="sm"
                        onClick={() => setAmount([Math.min(value, availableBalance)])}
                        disabled={value > availableBalance}
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        R$ {value}
                      </Button>
                    ))}
                  </div>
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <Shield className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-sm text-green-700">
                    <strong>Distribuição anônima:</strong> O sistema escolherá automaticamente os agricultores que
                    receberão seu {actionType === "investment" ? "investimento" : "doação"}. Nem você nem eles saberão
                    da conexão.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleInvest}
                  disabled={isProcessing || amount[0] > availableBalance}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isProcessing
                    ? "Processando..."
                    : actionType === "investment"
                      ? "Confirmar Investimento"
                      : "Confirmar Doação"}
                </Button>
              </CardContent>
            </Card>

            {/* Investment Details */}
            <div className="space-y-6">
              {actionType === "investment" && (
                <Card className="border-green-200 bg-white/80">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Calculator className="h-5 w-5 text-emerald-600" />
                      Simulação de Retorno
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-600">Valor Investido</p>
                        <p className="text-lg font-bold text-green-700">R$ {amount[0].toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <p className="text-sm text-emerald-600">Retorno Total</p>
                        <p className="text-lg font-bold text-emerald-700">R$ {expectedReturn.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">Retorno mensal médio</span>
                        <span className="font-medium text-green-800">R$ {monthlyReturn.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">Prazo</span>
                        <span className="font-medium text-green-800">24 meses</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-green-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-green-700">Progresso esperado</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Simulação
                        </Badge>
                      </div>
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-green-500 mt-1">Baseado no histórico da plataforma</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-green-200 bg-white/80">
                <CardHeader>
                  <CardTitle className="text-green-800">Impacto Social</CardTitle>
                  <CardDescription className="text-green-600">
                    O que seu {actionType === "investment" ? "investimento" : "doação"} pode gerar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-2xl font-bold text-green-700">{Math.ceil(amount[0] / 5000)}</p>
                      <p className="text-xs text-green-600">Famílias Beneficiadas</p>
                    </div>
                    <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-2xl font-bold text-emerald-700">{Math.ceil(amount[0] / 1000)}</p>
                      <p className="text-xs text-emerald-600">Hectares Cultivados</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-700">Projetos que você pode apoiar:</p>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• Cultivo de hortaliças orgânicas</li>
                      <li>• Criação de gado leiteiro</li>
                      <li>• Plantio de café sustentável</li>
                      <li>• Sistemas de irrigação</li>
                    </ul>
                  </div>

                  <Alert className="border-green-200 bg-green-50">
                    <Sprout className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-sm text-green-700">
                      Cada real {actionType === "investment" ? "investido" : "doado"} gera impacto real na vida de
                      famílias agricultoras brasileiras.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}
