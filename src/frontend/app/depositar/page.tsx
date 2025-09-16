"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Wallet, ArrowLeft, Building, AlertCircle, TrendingUp, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import WalletService, { type Farmer } from "@/lib/wallet-service"

export default function DepositPage() {
  const [formData, setFormData] = useState({
    amount: "",
    source: "bank_transfer",
    description: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [farmer, setFarmer] = useState<Farmer | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Load farmer data
  useEffect(() => {
    const currentFarmer = WalletService.getFarmer("farmer_001")
    if (currentFarmer) {
      setFarmer(currentFarmer)
    } else {
      toast({
        title: "Erro",
        description: "Dados do agricultor não encontrados.",
        variant: "destructive",
      })
      router.push("/carteira-agricultor")
    }
  }, [router, toast])

  const currentBalance = farmer?.wallet.balance || 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!farmer) {
      toast({
        title: "Erro",
        description: "Dados do agricultor não carregados.",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(formData.amount)

    if (!amount || amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Digite um valor válido para depósito.",
        variant: "destructive",
      })
      return
    }

    if (amount > 100000) {
      toast({
        title: "Valor muito alto",
        description: "O valor máximo para depósito é R$ 100.000,00.",
        variant: "destructive",
      })
      return
    }

    if (!formData.source) {
      toast({
        title: "Fonte não selecionada",
        description: "Selecione a fonte do depósito.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Get source description
      const sourceDesc = depositSources.find(s => s.value === formData.source)?.label || formData.source
      const fullDescription = formData.description ? 
        `${sourceDesc} - ${formData.description}` : 
        sourceDesc

      // Process deposit
      const success = WalletService.processDeposit("farmer_001", amount, fullDescription)
      
      if (success) {
        toast({
          title: "Depósito realizado com sucesso!",
          description: `R$ ${amount.toLocaleString()} foram adicionados ao seu saldo.`,
        })
        router.push("/carteira-agricultor")
      } else {
        throw new Error("Falha ao processar depósito")
      }
    } catch (error) {
      toast({
        title: "Erro ao processar depósito",
        description: error instanceof Error ? error.message : "Erro desconhecido.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const depositSources = [
    { value: "bank_transfer", label: "Transferência Bancária" },
    { value: "pix", label: "PIX" },
    { value: "crop_sale", label: "Venda de Colheita" },
    { value: "livestock_sale", label: "Venda de Gado" },
    { value: "government_subsidy", label: "Subsídio Governamental" },
    { value: "insurance_payout", label: "Seguro Agrícola" },
    { value: "loan", label: "Empréstimo" },
    { value: "other", label: "Outros" },
  ]

  const quickAmounts = [500, 1000, 2000, 5000, 10000]

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

          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-600" />
                Dados do Depósito
              </CardTitle>
              <CardDescription>
                Saldo atual: R$ {currentBalance.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor do Depósito (R$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0,00"
                    min="0.01"
                    max="100000"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="text-xl h-12"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Valor mínimo: R$ 0,01 | Valor máximo: R$ 100.000,00
                  </p>
                </div>

                {/* Quick Amount Buttons */}
                <div className="space-y-2">
                  <Label>Valores Rápidos</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {quickAmounts.map((value) => (
                      <Button
                        key={value}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({ ...formData, amount: value.toString() })}
                        className="text-xs"
                      >
                        R$ {value >= 1000 ? `${value/1000}k` : value}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Source */}
                <div className="space-y-2">
                  <Label htmlFor="source">Fonte do Depósito</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => setFormData({ ...formData, source: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a fonte" />
                    </SelectTrigger>
                    <SelectContent>
                      {depositSources.map((source) => (
                        <SelectItem key={source.value} value={source.value}>
                          {source.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (Opcional)</Label>
                  <Input
                    id="description"
                    placeholder="Ex: Venda de milho da safra 2024"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Important Notice */}
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Informações Importantes</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• O depósito será creditado imediatamente</li>
                        <li>• Mantenha comprovantes de todas as transações</li>
                        <li>• Para valores acima de R$ 50.000, contate o suporte</li>
                        <li>• Depósitos são registrados para fins de auditoria</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                {formData.amount && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold mb-2 text-green-800">Resumo do Depósito</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Valor do depósito:</span>
                        <span className="font-medium">R$ {Number.parseFloat(formData.amount || "0").toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Saldo atual:</span>
                        <span className="font-medium">R$ {currentBalance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2 border-green-300">
                        <span className="text-green-800">Novo saldo:</span>
                        <span className="text-green-800">
                          R$ {(currentBalance + Number.parseFloat(formData.amount || "0")).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full h-12 bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? (
                    "Processando..."
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Confirmar Depósito de R$ {Number.parseFloat(formData.amount || "0").toLocaleString()}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Benefits Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Building className="h-5 w-5" />
                Fontes de Renda Agrícola
              </CardTitle>
              <CardDescription>Principais formas de receber dinheiro no agronegócio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium text-green-800">Vendas Diretas</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Venda de colheitas (grãos, frutas, verduras)</li>
                    <li>• Venda de gado e produtos lácteos</li>
                    <li>• Venda direta ao consumidor</li>
                    <li>• Feiras e mercados locais</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-green-800">Apoio Institucional</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Subsídios governamentais</li>
                    <li>• Programas de financiamento rural</li>
                    <li>• Seguros agrícolas</li>
                    <li>• Cooperativas e associações</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}