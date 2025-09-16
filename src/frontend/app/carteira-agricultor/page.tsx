"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wallet,
  Download,
  Receipt,
  User,
  LogOut,
  ArrowUpRight,
  ArrowDownRight,
  Sprout,
  Calendar,
  DollarSign,
  TrendingDown,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RouteGuard } from "@/components/auth/route-guard"
import BoletoModal from "@/components/modals/boleto-modal"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import WalletService, { type Farmer, type Transaction, type Installment } from "@/lib/wallet-service"

export default function FarmerWalletPage() {
  const [userType, setUserType] = useState<string | null>(null)
  const [farmer, setFarmer] = useState<Farmer | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [installments, setInstallments] = useState<Installment[]>([])
  const [boletoModal, setBoletoModal] = useState<{
    isOpen: boolean
    invoice?: any
    type: "single" | "all"
  }>({
    isOpen: false,
    type: "single",
  })
  const router = useRouter()

  // Load farmer data
  const loadFarmerData = () => {
    // For demo purposes, we'll use farmer_001
    const currentFarmer = WalletService.getFarmer("farmer_001")
    if (currentFarmer) {
      setFarmer(currentFarmer)
      setTransactions(WalletService.getFarmerTransactions("farmer_001", 10))
      setInstallments(currentFarmer.installments)
    }
  }


  useEffect(() => {
    const storedUserType = localStorage.getItem("userType")

    if (storedUserType !== "farmer") {
      router.push("/login")
      return
    }

    setUserType(storedUserType)
    loadFarmerData()
  }, [router])

  // Refresh data when component mounts or when coming back from other pages
  useEffect(() => {
    if (userType === "farmer") {
      loadFarmerData()
    }
  }, [userType])

  // Auto-refresh data every 30 seconds to simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (userType === "farmer") {
        loadFarmerData()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [userType])

  const handleGenerateBoleto = (invoice: any) => {
    setBoletoModal({
      isOpen: true,
      invoice,
      type: "single",
    })
  }

  const handleGenerateAllBoleto = () => {
    setBoletoModal({
      isOpen: true,
      type: "all",
    })
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  if (!userType || !farmer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center text-green-700">Carregando...</div>
      </div>
    )
  }

  const walletData = farmer.wallet
  const debtProgress = walletData.totalDebt > 0 ? (walletData.paidAmount / walletData.totalDebt) * 100 : 0
  const upcomingPayments = installments.filter(i => i.status === 'pending').slice(0, 2)

  return (
    <RouteGuard allowedUserTypes={["farmer"]}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Header */}
        <header className="border-b border-green-200 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-green-800">AgroFinance</span>
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="hidden sm:flex bg-green-100 text-green-700 border-green-300">
                Agricultor
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-green-800">Minha Carteira</h1>
            <p className="text-green-600">Gerencie seu financiamento e acompanhe o progresso do seu projeto</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-green-200 bg-white/70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Saldo Disponível</CardTitle>
                <Wallet className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {walletData.balance.toLocaleString()}
                </div>
                <p className="text-xs text-green-500">Disponível para saque</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-white/70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Dívida Atual</CardTitle>
                <DollarSign className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">R$ {walletData.totalDebt.toLocaleString()}</div>
                <p className="text-xs text-green-500">{walletData.interestRate}% sobre o valor</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-white/70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Parcela Mensal</CardTitle>
                <Calendar className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800">R$ {walletData.monthlyPayment.toLocaleString()}</div>
                <p className="text-xs text-green-500">{walletData.remainingMonths} parcelas restantes</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-white/70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Progresso</CardTitle>
                <TrendingDown className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800">{debtProgress.toFixed(1)}%</div>
                <Progress value={debtProgress} className="mt-2" />
                <p className="text-xs text-green-500 mt-1">Pago até agora</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
              <Link href="/saque">
                <Download className="mr-2 h-5 w-5" />
                Solicitar Saque
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
              asChild
            >
              <Link href="/faturas">
                <Receipt className="mr-2 h-5 w-5" />
                Ver Faturas
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
              asChild
            >
              <Link href="/perfil">
                <User className="mr-2 h-5 w-5" />
                Ver Perfil
              </Link>
            </Button>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-green-100">
              <TabsTrigger
                value="transactions"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Transações
              </TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                Próximas Parcelas
              </TabsTrigger>
              <TabsTrigger value="project" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                Meu Projeto
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions">
              <Card className="border-green-200 bg-white/70">
                <CardHeader>
                  <CardTitle className="text-green-800">Histórico de Transações</CardTitle>
                  <CardDescription className="text-green-600">Suas últimas movimentações financeiras</CardDescription>

                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
                      <Input
                        placeholder="Buscar transações..."
                        className="pl-10 border-green-200 focus:border-green-400"
                      />
                    </div>
                    <Select>
                      <SelectTrigger className="w-full sm:w-48 border-green-200">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="funding">Financiamentos</SelectItem>
                        <SelectItem value="payment">Pagamentos</SelectItem>
                        <SelectItem value="withdrawal">Saques</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-full sm:w-48 border-green-200">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-white/50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === "withdrawal"
                                ? "bg-blue-100"
                                : transaction.type === "payment"
                                  ? "bg-red-100"
                                  : transaction.type === "donation"
                                    ? "bg-green-100"
                                    : "bg-emerald-100"
                            }`}
                          >
                            {transaction.type === "withdrawal" ? (
                              <Download className="h-5 w-5 text-blue-600" />
                            ) : transaction.type === "payment" ? (
                              <ArrowUpRight className="h-5 w-5 text-red-600" />
                            ) : transaction.type === "donation" ? (
                              <ArrowDownRight className="h-5 w-5 text-green-600" />
                            ) : (
                              <ArrowDownRight className="h-5 w-5 text-emerald-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-green-800">{transaction.description}</p>
                            <p className="text-sm text-green-600">
                              {new Date(transaction.date).toLocaleDateString("pt-BR")} • {transaction.reference}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${
                              transaction.type === "donation" || transaction.type === "funding"
                                ? "text-green-600"
                                : transaction.type === "withdrawal"
                                  ? "text-blue-600"
                                  : "text-red-600"
                            }`}
                          >
                            {transaction.type === "donation" || transaction.type === "funding" ? "+" : "-"}R$ {transaction.amount.toLocaleString()}
                          </p>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              transaction.status === "completed"
                                ? "bg-green-100 text-green-700 border-green-300"
                                : transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                  : "bg-red-100 text-red-700 border-red-300"
                            }`}
                          >
                            {transaction.status === "completed" ? "Concluído" : 
                             transaction.status === "pending" ? "Pendente" : "Falhou"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                    >
                      Ver Mais Transações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card className="border-green-200 bg-white/70">
                <CardHeader>
                  <CardTitle className="text-green-800">Próximas Parcelas</CardTitle>
                  <CardDescription className="text-green-600">
                    Acompanhe seus próximos pagamentos e antecipe se desejar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingPayments.map((payment) => (
                      <div key={payment.id} className="p-4 border border-green-200 rounded-lg bg-white/50">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-green-800">
                              Vencimento: {new Date(payment.dueDate).toLocaleDateString("pt-BR")}
                            </p>
                            <p className="text-sm text-green-600">
                              Principal: R$ {payment.principal.toLocaleString()} | Juros: R${" "}
                              {payment.interest.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-800">R$ {payment.amount.toLocaleString()}</p>
                            <Badge variant={payment.status === "pending" ? "destructive" : "secondary"}>
                              {payment.status === "pending" ? "Vence em breve" : "Agendado"}
                            </Badge>
                          </div>
                        </div>
                        {payment.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleGenerateBoleto(payment)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Gerar Boleto
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleGenerateAllBoleto}
                              className="text-green-700 hover:bg-green-50"
                            >
                              Antecipar Todas
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium mb-2 text-green-800">Simulação de Antecipação</h4>
                    <p className="text-sm text-green-600 mb-3">
                      Antecipando todas as parcelas restantes, você economizaria aproximadamente:
                    </p>
                    <div className="text-2xl font-bold text-emerald-600">R$ 2.840</div>
                    <p className="text-xs text-green-500">Em juros não pagos</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="project">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-green-200 bg-white/70">
                  <CardHeader>
                    <CardTitle className="text-green-800">Detalhes do Projeto</CardTitle>
                    <CardDescription className="text-green-600">Informações sobre seu financiamento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-green-700">Descrição do Projeto</Label>
                      <p className="text-sm text-green-600 mt-1">
                        {walletData.projectDescription}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-green-700">Valor Solicitado</Label>
                        <p className="text-lg font-bold text-green-600">
                          R$ {walletData.requestedAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-green-700">Taxa de Juros</Label>
                        <p className="text-lg font-bold text-green-800">{walletData.interestRate}% sobre o valor</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-green-700">Prazo</Label>
                        <p className="text-lg font-bold text-green-800">24 meses</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-green-700">Status</Label>
                        <Badge className="bg-green-100 text-green-700 border-green-300">Aprovado</Badge>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-green-700">Localização</Label>
                      <p className="text-sm text-green-600 mt-1">
                        {farmer.location}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-green-700">Área Cultivada</Label>
                      <p className="text-sm text-green-600 mt-1">{walletData.projectArea}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-white/70">
                  <CardHeader>
                    <CardTitle className="text-green-800">Resumo Financeiro</CardTitle>
                    <CardDescription className="text-green-600">Visão geral do seu financiamento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Valor Total Financiado</span>
                        <span className="font-medium text-green-800">R$ {walletData.totalDebt.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Valor Já Pago</span>
                        <span className="font-medium text-emerald-600">
                          R$ {walletData.paidAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Saldo Devedor</span>
                        <span className="font-medium text-red-600">
                          R$ {walletData.remainingAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-green-200 pt-2">
                        <span className="text-sm font-medium text-green-700">Próximo Vencimento</span>
                        <span className="font-medium text-green-800">15/02/2024</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-green-700">Progresso do Pagamento</span>
                        <span className="text-sm text-green-600">{debtProgress.toFixed(1)}%</span>
                      </div>
                      <Progress value={debtProgress} className="h-3" />
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <h4 className="font-medium mb-2 text-green-800">Impacto Social</h4>
                      <div className="space-y-2 text-sm text-green-600">
                        <p>• 15 famílias beneficiadas com alimentos orgânicos</p>
                        <p>• 3 empregos diretos gerados na comunidade</p>
                        <p>• Redução de 40% no uso de agrotóxicos</p>
                        <p>• Economia de 30% no consumo de água</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <BoletoModal
          isOpen={boletoModal.isOpen}
          onClose={() => setBoletoModal({ ...boletoModal, isOpen: false })}
          invoice={boletoModal.invoice}
          type={boletoModal.type}
        />
      </div>
    </RouteGuard>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
