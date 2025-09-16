"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Wallet, 
  Download, 
  CreditCard, 
  Heart, 
  RefreshCw, 
  User, 
  TrendingUp, 
  TrendingDown,
  Sprout 
} from "lucide-react"
import WalletService, { type Farmer, type Donor, type Transaction } from "@/lib/wallet-service"
import { useToast } from "@/hooks/use-toast"

export default function DemoCarteiraPage() {
  const [farmer, setFarmer] = useState<Farmer | null>(null)
  const [donor, setDonor] = useState<Donor | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [donationAmount, setDonationAmount] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const { toast } = useToast()

  const loadData = () => {
    const currentFarmer = WalletService.getFarmer("farmer_001")
    const currentDonor = WalletService.getDonor("donor_001")
    
    if (currentFarmer) {
      setFarmer(currentFarmer)
      setTransactions(WalletService.getFarmerTransactions("farmer_001", 5))
    }
    if (currentDonor) {
      setDonor(currentDonor)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount)
    if (!amount || amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Digite um valor válido para saque.",
        variant: "destructive",
      })
      return
    }

    try {
      const success = WalletService.processWithdrawal("farmer_001", amount, "Banco Demo - Ag: 1234 Cc: 12345-6")
      if (success) {
        toast({
          title: "Saque realizado!",
          description: `R$ ${amount.toLocaleString()} sacado com sucesso.`,
        })
        setWithdrawAmount("")
        loadData()
      }
    } catch (error) {
      toast({
        title: "Erro no saque",
        description: error instanceof Error ? error.message : "Erro desconhecido.",
        variant: "destructive",
      })
    }
  }

  const handleDonation = () => {
    const amount = parseFloat(donationAmount)
    if (!amount || amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Digite um valor válido para doação.",
        variant: "destructive",
      })
      return
    }

    try {
      const success = WalletService.processDonation("donor_001", "farmer_001", amount, "Doação via demo")
      if (success) {
        toast({
          title: "Doação realizada!",
          description: `R$ ${amount.toLocaleString()} doado com sucesso.`,
        })
        setDonationAmount("")
        loadData()
      }
    } catch (error) {
      toast({
        title: "Erro na doação",
        description: error instanceof Error ? error.message : "Erro desconhecido.",
        variant: "destructive",
      })
    }
  }

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount)
    if (!amount || amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Digite um valor válido para depósito.",
        variant: "destructive",
      })
      return
    }

    try {
      const success = WalletService.processDeposit("farmer_001", amount, "Depósito via demo")
      if (success) {
        toast({
          title: "Depósito realizado!",
          description: `R$ ${amount.toLocaleString()} depositado com sucesso.`,
        })
        setDepositAmount("")
        loadData()
      }
    } catch (error) {
      toast({
        title: "Erro no depósito",
        description: error instanceof Error ? error.message : "Erro desconhecido.",
        variant: "destructive",
      })
    }
  }

  const handlePayInstallment = (installmentId: number) => {
    try {
      const success = WalletService.processPayment("farmer_001", installmentId)
      if (success) {
        toast({
          title: "Parcela paga!",
          description: `Parcela #${installmentId} paga com sucesso.`,
        })
        loadData()
      }
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description: error instanceof Error ? error.message : "Erro desconhecido.",
        variant: "destructive",
      })
    }
  }

  const handlePayAllInstallments = () => {
    try {
      const result = WalletService.processAllPayments("farmer_001")
      if (result.success) {
        toast({
          title: "Todas as parcelas pagas!",
          description: `Economia de R$ ${result.savings.toLocaleString()} com pagamento antecipado.`,
        })
        loadData()
      }
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description: error instanceof Error ? error.message : "Erro desconhecido.",
        variant: "destructive",
      })
    }
  }

  const resetData = () => {
    WalletService.resetData()
    loadData()
    toast({
      title: "Dados resetados!",
      description: "Todos os dados foram restaurados ao estado inicial.",
    })
  }

  if (!farmer || !donor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center text-green-700">Carregando dados...</div>
      </div>
    )
  }

  const pendingInstallments = farmer.installments.filter(i => i.status === 'pending')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sprout className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-green-800">Demo - Sistema de Carteira</h1>
          </div>
          <p className="text-green-600 mb-4">
            Demonstração interativa do sistema de carteira com saldo, dívidas e transações
          </p>
          <Button onClick={resetData} variant="outline" className="border-green-300 text-green-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Resetar Dados
          </Button>
        </div>

        <Tabs defaultValue="farmer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-green-100">
            <TabsTrigger value="farmer" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              👨‍🌾 Agricultor
            </TabsTrigger>
            <TabsTrigger value="donor" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              ❤️ Doador
            </TabsTrigger>
            <TabsTrigger value="actions" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              ⚡ Ações
            </TabsTrigger>
          </TabsList>

          {/* Farmer Tab */}
          <TabsContent value="farmer" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-green-200 bg-white/70">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Saldo Disponível</CardTitle>
                  <Wallet className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {farmer.wallet.balance.toLocaleString()}
                  </div>
                  <p className="text-xs text-green-500">Disponível para saque</p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-white/70">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Dívida Atual</CardTitle>
                  <CreditCard className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    R$ {farmer.wallet.remainingAmount.toLocaleString()}
                  </div>
                  <p className="text-xs text-green-500">Restante a pagar</p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-white/70">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Parcelas Pendentes</CardTitle>
                  <CreditCard className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {pendingInstallments.length}
                  </div>
                  <p className="text-xs text-green-500">Parcelas a pagar</p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-white/70">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Progresso</CardTitle>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-800">
                    {farmer.wallet.totalDebt > 0 ? Math.round((farmer.wallet.paidAmount / farmer.wallet.totalDebt) * 100) : 0}%
                  </div>
                  <p className="text-xs text-green-500">Pago até agora</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="border-green-200 bg-white/70">
              <CardHeader>
                <CardTitle className="text-green-800">Transações Recentes</CardTitle>
                <CardDescription className="text-green-600">Últimas movimentações da carteira</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-white/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "donation" ? "bg-green-100" :
                          transaction.type === "withdrawal" ? "bg-blue-100" :
                          transaction.type === "payment" ? "bg-red-100" : "bg-emerald-100"
                        }`}>
                          {transaction.type === "donation" ? <Heart className="h-5 w-5 text-green-600" /> :
                           transaction.type === "withdrawal" ? <Download className="h-5 w-5 text-blue-600" /> :
                           transaction.type === "payment" ? <TrendingUp className="h-5 w-5 text-red-600" /> :
                           <TrendingDown className="h-5 w-5 text-emerald-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-green-800">{transaction.description}</p>
                          <p className="text-sm text-green-600">{new Date(transaction.date).toLocaleDateString("pt-BR")}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.type === "donation" || transaction.type === "funding" ? "text-green-600" :
                          transaction.type === "withdrawal" ? "text-blue-600" : "text-red-600"
                        }`}>
                          {transaction.type === "donation" || transaction.type === "funding" ? "+" : "-"}R$ {transaction.amount.toLocaleString()}
                        </p>
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          {transaction.status === "completed" ? "Concluído" : "Pendente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donor Tab */}
          <TabsContent value="donor" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-red-200 bg-white/70">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {donor.name}
                  </CardTitle>
                  <CardDescription className="text-red-600">Dados do doador</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-red-700">Saldo Disponível</Label>
                    <p className="text-2xl font-bold text-red-600">R$ {donor.wallet.balance.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-red-700">Total Doado</Label>
                    <p className="text-lg font-bold text-green-600">
                      R$ {donor.donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-red-700">Número de Doações</Label>
                    <p className="text-lg font-bold text-red-800">{donor.donations.length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-white/70">
                <CardHeader>
                  <CardTitle className="text-red-800">Histórico de Doações</CardTitle>
                  <CardDescription className="text-red-600">Suas contribuições</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {donor.donations.map((donation) => (
                      <div key={donation.id} className="p-3 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-red-800">R$ {donation.amount.toLocaleString()}</p>
                            <p className="text-sm text-red-600">{new Date(donation.date).toLocaleDateString("pt-BR")}</p>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {donation.status === "completed" ? "Concluído" : "Pendente"}
                          </Badge>
                        </div>
                        {donation.message && (
                          <p className="text-sm text-red-600 mt-2">"{donation.message}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Deposit - Administrative */}
              <Card className="border-emerald-200 bg-white/70">
                <CardHeader>
                  <CardTitle className="text-emerald-800 flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Depósito (Sistema/Admin)
                  </CardTitle>
                  <CardDescription className="text-emerald-600">
                    Simula entrada de dinheiro externa (vendas, financiamentos)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="deposit">Valor do Depósito (R$)</Label>
                    <Input
                      id="deposit"
                      type="number"
                      placeholder="0,00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleDeposit} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Simular Entrada de Dinheiro
                  </Button>
                  <p className="text-xs text-emerald-600">
                    💡 Na prática, o agricultor não faz depósitos diretos. O saldo aumenta via doações e financiamentos.
                  </p>
                </CardContent>
              </Card>

              {/* Withdrawal */}
              <Card className="border-blue-200 bg-white/70">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Saque (Agricultor)
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Diminui o saldo disponível do agricultor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="withdraw">Valor do Saque (R$)</Label>
                    <Input
                      id="withdraw"
                      type="number"
                      placeholder="0,00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleWithdraw} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Realizar Saque
                  </Button>
                </CardContent>
              </Card>

              {/* Donation */}
              <Card className="border-green-200 bg-white/70">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Doação (Doador → Agricultor)
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Transfere dinheiro do doador para o agricultor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="donation">Valor da Doação (R$)</Label>
                    <Input
                      id="donation"
                      type="number"
                      placeholder="0,00"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleDonation} className="w-full bg-green-600 hover:bg-green-700">
                    <Heart className="h-4 w-4 mr-2" />
                    Fazer Doação
                  </Button>
                </CardContent>
              </Card>

              {/* Payment Actions */}
              <Card className="border-red-200 bg-white/70">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Pagamento de Parcelas
                  </CardTitle>
                  <CardDescription className="text-red-600">
                    Diminui a dívida do agricultor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {pendingInstallments.slice(0, 2).map((installment) => (
                      <div key={installment.id} className="flex justify-between items-center p-3 border border-red-200 rounded-lg">
                        <div>
                          <p className="font-medium text-red-800">Parcela #{installment.id}</p>
                          <p className="text-sm text-red-600">R$ {installment.amount.toLocaleString()}</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handlePayInstallment(installment.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Pagar
                        </Button>
                      </div>
                    ))}
                  </div>
                  {pendingInstallments.length > 0 && (
                    <Button 
                      onClick={handlePayAllInstallments} 
                      variant="outline" 
                      className="w-full border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Pagar Todas as Parcelas
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="border-green-200 bg-white/70">
                <CardHeader>
                  <CardTitle className="text-green-800">Como Funciona</CardTitle>
                  <CardDescription className="text-green-600">Explicação do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-green-700">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <p><strong>Depósito (Admin):</strong> Simula entrada externa de dinheiro</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p><strong>Doação:</strong> Doadores transferem dinheiro para agricultores</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p><strong>Saque:</strong> Agricultor retira dinheiro do saldo disponível</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <p><strong>Pagamento:</strong> Agricultor paga parcelas e diminui dívida</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <p><strong>Dados:</strong> Salvos no localStorage para persistir durante a sessão</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
