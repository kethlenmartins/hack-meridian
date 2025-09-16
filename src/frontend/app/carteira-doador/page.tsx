"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Wallet,
  Plus,
  Heart,
  BarChart3,
  User,
  LogOut,
  ArrowUpRight,
  ArrowDownRight,
  Sprout,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RouteGuard } from "@/components/auth/route-guard"

export default function DonorWalletPage() {
  const [userType, setUserType] = useState<string | null>(null)
  const [donorType, setDonorType] = useState<string | null>(null)
  const router = useRouter()

  // Mock data
  const walletData = {
    totalInvested: 25000,
    currentReturn: 1250,
    expectedReturn: 5000,
    totalDonated: 8000,
    projectsSupported: 12,
    monthlyReturn: 208.33,
  }

  const recentTransactions = [
    { id: 1, type: "investment", amount: 5000, date: "2024-01-15", status: "completed" },
    { id: 2, type: "return", amount: 416.67, date: "2024-01-10", status: "completed" },
    { id: 3, type: "donation", amount: 2000, date: "2024-01-05", status: "completed" },
    { id: 4, type: "investment", amount: 3000, date: "2023-12-28", status: "completed" },
  ]

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType")
    const storedDonorType = localStorage.getItem("donorType")

    if (storedUserType !== "donor") {
      router.push("/login")
      return
    }

    setUserType(storedUserType)
    setDonorType(storedDonorType)
  }, [router])

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  return (
    <RouteGuard allowedUserTypes={["donor"]}>
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
                {donorType === "investment" ? "Investidor" : "Doador"}
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
            <p className="text-green-600">Acompanhe seus investimentos e doações para a agricultura familiar</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {donorType === "investment" ? (
              <>
                <Card className="border-green-200 bg-white/70">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-700">Total Investido</CardTitle>
                    <Wallet className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      R$ {walletData.totalInvested.toLocaleString()}
                    </div>
                    <p className="text-xs text-green-500">Em {walletData.projectsSupported} projetos</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-white/70">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-700">Retorno Atual</CardTitle>
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">
                      R$ {walletData.currentReturn.toLocaleString()}
                    </div>
                    <p className="text-xs text-green-500">+R$ {walletData.monthlyReturn.toFixed(2)}/mês</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-white/70">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-700">Retorno Esperado</CardTitle>
                    <BarChart3 className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-800">
                      R$ {walletData.expectedReturn.toLocaleString()}
                    </div>
                    <p className="text-xs text-green-500">Em 2 anos (10% a.a.)</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-white/70">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-700">Progresso</CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-800">
                      {((walletData.currentReturn / walletData.expectedReturn) * 100).toFixed(1)}%
                    </div>
                    <Progress value={(walletData.currentReturn / walletData.expectedReturn) * 100} className="mt-2" />
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="border-green-200 bg-white/70">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-700">Total Doado</CardTitle>
                    <Heart className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      R$ {walletData.totalDonated.toLocaleString()}
                    </div>
                    <p className="text-xs text-green-500">Para {walletData.projectsSupported} projetos</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-white/70">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-700">Ranking</CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-800">#15</div>
                    <p className="text-xs text-green-500">Entre doadores</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-8">
            <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
              <Link href="/depositar">
                <Plus className="mr-2 h-5 w-5" />
                Adicionar Saldo
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
              asChild
            >
              <Link href={donorType === "investment" ? "/investir" : "/doar"}>
                {donorType === "investment" ? (
                  <>
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Investir Agora
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-5 w-5" />
                    Fazer Doação
                  </>
                )}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
              asChild
            >
              <Link href="/transacoes">
                <BarChart3 className="mr-2 h-5 w-5" />
                Ver Transações
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
            <TabsList className="grid w-full grid-cols-1 bg-green-100">
              <TabsTrigger
                value="transactions"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Transações Recentes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions">
              <Card className="border-green-200 bg-white/70">
                <CardHeader>
                  <CardTitle className="text-green-800">Histórico de Transações</CardTitle>
                  <CardDescription className="text-green-600">Suas últimas movimentações na plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-white/50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === "investment"
                                ? "bg-green-100"
                                : transaction.type === "donation"
                                  ? "bg-red-100"
                                  : "bg-emerald-100"
                            }`}
                          >
                            {transaction.type === "investment" ? (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : transaction.type === "donation" ? (
                              <Heart className="h-5 w-5 text-red-500" />
                            ) : (
                              <ArrowDownRight className="h-5 w-5 text-emerald-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-green-800">
                              {transaction.type === "investment"
                                ? "Investimento"
                                : transaction.type === "donation"
                                  ? "Doação"
                                  : "Retorno de Investimento"}
                            </p>
                            <p className="text-sm text-green-600">
                              {new Date(transaction.date).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${transaction.type === "return" ? "text-emerald-600" : "text-green-800"}`}
                          >
                            {transaction.type === "return" ? "+" : "-"}R$ {transaction.amount.toLocaleString()}
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
          </Tabs>
        </div>
      </div>
    </RouteGuard>
  )
}
