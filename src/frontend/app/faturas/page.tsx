"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FileText, ArrowLeft, Calendar, DollarSign, TrendingDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import WalletService, { type Farmer, type Installment } from "@/lib/wallet-service"

export default function FaturasPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [farmer, setFarmer] = useState<Farmer | null>(null)
  const [installments, setInstallments] = useState<Installment[]>([])

  // Load farmer data
  useEffect(() => {
    const currentFarmer = WalletService.getFarmer("farmer_001")
    if (currentFarmer) {
      setFarmer(currentFarmer)
      setInstallments(currentFarmer.installments)
    } else {
      toast({
        title: "Erro",
        description: "Dados do agricultor não encontrados.",
        variant: "destructive",
      })
      router.push("/carteira-agricultor")
    }
  }, [router, toast])

  const pendingInstallments = installments.filter((i) => i.status === "pending")
  const totalPendingAmount = pendingInstallments.reduce((sum, i) => sum + i.amount, 0)
  const totalInterestSavings = pendingInstallments.reduce((sum, i) => sum + i.interest, 0) * 0.3 // 30% savings on early payment

  const handlePayInstallment = async (installmentId: number) => {
    if (!farmer) return

    try {
      const success = WalletService.processPayment("farmer_001", installmentId)
      
      if (success) {
        toast({
          title: "Pagamento realizado com sucesso!",
          description: `A parcela #${installmentId} foi paga.`,
        })
        
        // Refresh data
        const updatedFarmer = WalletService.getFarmer("farmer_001")
        if (updatedFarmer) {
          setFarmer(updatedFarmer)
          setInstallments(updatedFarmer.installments)
        }
      } else {
        throw new Error("Falha ao processar pagamento")
      }
    } catch (error) {
      toast({
        title: "Erro ao processar pagamento",
        description: error instanceof Error ? error.message : "Erro desconhecido.",
        variant: "destructive",
      })
    }
  }

  const handlePayAll = async () => {
    if (!farmer) return

    try {
      const result = WalletService.processAllPayments("farmer_001")
      
      if (result.success) {
        toast({
          title: "Pagamento antecipado realizado!",
          description: `Todas as parcelas foram quitadas. Economia de R$ ${result.savings.toLocaleString()}.`,
        })
        
        // Refresh data
        const updatedFarmer = WalletService.getFarmer("farmer_001")
        if (updatedFarmer) {
          setFarmer(updatedFarmer)
          setInstallments(updatedFarmer.installments)
        }
      } else {
        throw new Error("Falha ao processar pagamento antecipado")
      }
    } catch (error) {
      toast({
        title: "Erro ao processar pagamento",
        description: error instanceof Error ? error.message : "Erro desconhecido.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string, overdue: boolean) => {
    if (status === "paid") {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Pago
        </Badge>
      )
    }
    if (overdue) {
      return <Badge variant="destructive">Em Atraso</Badge>
    }
    return <Badge variant="outline">Pendente</Badge>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">Faturas</h1>
            <p className="text-muted-foreground">Acompanhe suas parcelas e faça pagamentos antecipados</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Parcelas Pendentes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingInstallments.length}</div>
                <p className="text-xs text-muted-foreground">De 24 parcelas totais</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total Pendente</CardTitle>
                <DollarSign className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">R$ {totalPendingAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Soma de todas as parcelas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Economia Antecipação</CardTitle>
                <TrendingDown className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {Math.round(totalInterestSavings).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Se quitar tudo hoje</p>
              </CardContent>
            </Card>
          </div>

          {/* Early Payment Option */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-green-600" />
                Pagamento Antecipado
              </CardTitle>
              <CardDescription>Quite todas as parcelas pendentes e economize nos juros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Valor original:</p>
                    <p className="font-semibold">R$ {totalPendingAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Desconto nos juros:</p>
                    <p className="font-semibold text-green-600">
                      - R$ {Math.round(totalInterestSavings).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valor final:</p>
                    <p className="font-bold text-lg">
                      R$ {(totalPendingAmount - totalInterestSavings).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <Button onClick={handlePayAll} className="w-full md:w-auto">
                Quitar Todas as Parcelas
              </Button>
            </CardContent>
          </Card>

          {/* Installments List */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Parcelas</CardTitle>
              <CardDescription>Todas as parcelas do seu financiamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {installments.map((installment) => (
                  <div key={installment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-muted">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Parcela {installment.id}/24</p>
                        <p className="text-sm text-muted-foreground">
                          Vencimento: {new Date(installment.dueDate).toLocaleDateString("pt-BR")}
                        </p>
                        <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                          <span>Principal: R$ {installment.principal.toLocaleString()}</span>
                          <span>Juros: R$ {installment.interest.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div>
                        <p className="font-semibold">R$ {installment.amount.toLocaleString()}</p>
                        {getStatusBadge(installment.status, installment.overdue)}
                      </div>
                      {installment.status === "pending" && (
                        <Button size="sm" variant="outline" onClick={() => handlePayInstallment(installment.id)}>
                          Pagar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
