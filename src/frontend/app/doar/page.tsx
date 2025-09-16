"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Heart, Shield, CheckCircle, Sprout } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RouteGuard } from "@/components/auth/route-guard"
import WalletService, { type Donor, type Farmer } from "@/lib/wallet-service"
import { useToast } from "@/hooks/use-toast"

export default function DonatePage() {
  const [userType, setUserType] = useState<string | null>(null)
  const [amount, setAmount] = useState([1000])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [donor, setDonor] = useState<Donor | null>(null)
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Load donor data
  useEffect(() => {
    const currentDonor = WalletService.getDonor("donor_001")
    if (currentDonor) {
      setDonor(currentDonor)
    }
    
    // Select a random farmer to receive the donation
    const farmers = WalletService.getAllFarmers()
    if (farmers.length > 0) {
      const randomFarmer = farmers[Math.floor(Math.random() * farmers.length)]
      setSelectedFarmer(randomFarmer)
    }
  }, [])

  const availableBalance = donor?.wallet.balance || 0

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType")

    if (storedUserType !== "donor") {
      router.push("/login")
      return
    }

    setUserType(storedUserType)
  }, [router])

  const handleDonate = async () => {
    if (!donor || !selectedFarmer) {
      toast({
        title: "Erro",
        description: "Dados não carregados. Tente novamente.",
        variant: "destructive",
      })
      return
    }

    if (amount[0] > availableBalance) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não tem saldo suficiente para esta doação.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const success = WalletService.processDonation(
        donor.id,
        selectedFarmer.id,
        amount[0],
        "Doação anônima via plataforma"
      )

      if (success) {
        // Update local donor data
        const updatedDonor = WalletService.getDonor(donor.id)
        if (updatedDonor) {
          setDonor(updatedDonor)
        }

        setIsSuccess(true)
        toast({
          title: "Doação realizada com sucesso!",
          description: `R$ ${amount[0].toLocaleString()} foram doados anonimamente.`,
        })
      } else {
        throw new Error("Falha ao processar doação")
      }
    } catch (error) {
      toast({
        title: "Erro ao processar doação",
        description: error instanceof Error ? error.message : "Erro desconhecido.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <RouteGuard allowedUserTypes={["donor"]}>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card className="border-red-200 bg-white/80">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-red-800">Doação Realizada!</CardTitle>
                <CardDescription className="text-red-600">
                  Seu dinheiro foi distribuído anonimamente para agricultores
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-600">Valor doado</p>
                  <p className="text-2xl font-bold text-red-700">R$ {amount[0].toLocaleString()}</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600">Famílias que serão beneficiadas</p>
                  <p className="text-xl font-bold text-green-700">{Math.ceil(amount[0] / 5000)}</p>
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <Shield className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-sm text-green-700">
                    O sistema fez a distribuição automática e anônima. Você pode acompanhar o impacto na sua carteira.
                  </AlertDescription>
                </Alert>

                <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                  <Link href="/carteira-doador">Voltar à Carteira</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </RouteGuard>
    )
  }

  return (
    <RouteGuard allowedUserTypes={["donor"]}>
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/carteira-doador">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-red-800">Fazer Doação</h1>
              <p className="text-red-600">Doe para transformar vidas no campo</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Donation Form */}
            <Card className="border-red-200 bg-white/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <Heart className="h-5 w-5 text-red-500" />
                  Valor da Doação
                </CardTitle>
                <CardDescription className="text-red-600">
                  Saldo disponível: R$ {availableBalance.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-red-700">Valor (R$)</Label>
                    <div className="px-3 py-2 border border-red-300 rounded-md bg-background">
                      <span className="text-2xl font-bold text-red-700">R$ {amount[0].toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-red-700">Ajustar valor</Label>
                    <Slider
                      value={amount}
                      onValueChange={setAmount}
                      max={availableBalance}
                      min={100}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-red-500">
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
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        R$ {value}
                      </Button>
                    ))}
                  </div>
                </div>

                <Alert className="border-red-200 bg-red-50">
                  <Shield className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-sm text-red-700">
                    <strong>Distribuição anônima:</strong> O sistema escolherá automaticamente os agricultores que
                    receberão sua doação. Nem você nem eles saberão da conexão.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleDonate}
                  disabled={isProcessing || amount[0] > availableBalance}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  {isProcessing ? "Processando..." : "Confirmar Doação"}
                </Button>
              </CardContent>
            </Card>

            {/* Impact Details */}
            <div className="space-y-6">
              <Card className="border-green-200 bg-white/80">
                <CardHeader>
                  <CardTitle className="text-green-800">Impacto Social</CardTitle>
                  <CardDescription className="text-green-600">O que sua doação pode gerar</CardDescription>
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
                    <p className="text-sm font-medium text-green-800">Projetos que você pode apoiar:</p>
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
                      Cada real doado gera impacto real na vida de famílias agricultoras brasileiras.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-white/80">
                <CardHeader>
                  <CardTitle className="text-red-800">Diferença da Doação</CardTitle>
                  <CardDescription className="text-red-600">Por que doar ao invés de investir?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <p className="text-sm text-red-700">100% do valor vai para os agricultores</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <p className="text-sm text-red-700">Sem expectativa de retorno financeiro</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <p className="text-sm text-red-700">Máximo impacto social possível</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <p className="text-sm text-red-700">Transformação de vidas pura</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}
