"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Download,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Receipt,
  Sprout,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TransactionsPage() {
  const [userType, setUserType] = useState<string | null>(null)
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([])
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
    search: "",
  })
  const router = useRouter()

  // Mock comprehensive transaction data
  const allTransactions = [
    {
      id: 1,
      type: "funding",
      amount: 60000,
      date: "2023-08-15",
      status: "completed",
      description: "Financiamento inicial aprovado",
      reference: "FIN-001",
      method: "Transferência",
      category: "Crédito",
    },
    {
      id: 2,
      type: "withdrawal",
      amount: 15000,
      date: "2023-09-01",
      status: "completed",
      description: "Saque para conta corrente",
      reference: "SAQ-001",
      method: "TED",
      category: "Saque",
    },
    {
      id: 3,
      type: "payment",
      amount: 2600,
      date: "2023-10-10",
      status: "completed",
      description: "Pagamento parcela #1",
      reference: "PAG-001",
      method: "Débito Automático",
      category: "Pagamento",
    },
    {
      id: 4,
      type: "withdrawal",
      amount: 10000,
      date: "2023-10-15",
      status: "completed",
      description: "Saque para investimento em equipamentos",
      reference: "SAQ-002",
      method: "PIX",
      category: "Saque",
    },
    {
      id: 5,
      type: "payment",
      amount: 2600,
      date: "2023-11-10",
      status: "completed",
      description: "Pagamento parcela #2",
      reference: "PAG-002",
      method: "PIX",
      category: "Pagamento",
    },
    {
      id: 6,
      type: "fee",
      amount: 50,
      date: "2023-11-15",
      status: "completed",
      description: "Taxa de manutenção mensal",
      reference: "TAX-001",
      method: "Débito",
      category: "Taxa",
    },
    {
      id: 7,
      type: "payment",
      amount: 2600,
      date: "2023-12-10",
      status: "completed",
      description: "Pagamento parcela #3",
      reference: "PAG-003",
      method: "Boleto",
      category: "Pagamento",
    },
    {
      id: 8,
      type: "withdrawal",
      amount: 8000,
      date: "2024-01-05",
      status: "pending",
      description: "Saque solicitado - em processamento",
      reference: "SAQ-003",
      method: "TED",
      category: "Saque",
    },
    {
      id: 9,
      type: "payment",
      amount: 2600,
      date: "2024-01-10",
      status: "completed",
      description: "Pagamento parcela #4",
      reference: "PAG-004",
      method: "PIX",
      category: "Pagamento",
    },
  ]

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType")
    if (!storedUserType || (storedUserType !== "farmer" && storedUserType !== "donor")) {
      router.push("/login")
      return
    }
    setUserType(storedUserType)
    setFilteredTransactions(allTransactions)
  }, [router])

  useEffect(() => {
    let filtered = allTransactions

    if (filters.type !== "all") {
      filtered = filtered.filter((t) => t.type === filters.type)
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((t) => t.status === filters.status)
    }

    if (filters.search) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.reference.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((t) => new Date(t.date) >= new Date(filters.dateFrom))
    }

    if (filters.dateTo) {
      filtered = filtered.filter((t) => new Date(t.date) <= new Date(filters.dateTo))
    }

    setFilteredTransactions(filtered)
  }, [filters])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "funding":
        return <ArrowDownRight className="h-5 w-5 text-green-600" />
      case "withdrawal":
        return <Download className="h-5 w-5 text-blue-600" />
      case "payment":
        return <ArrowUpRight className="h-5 w-5 text-red-600" />
      case "fee":
        return <Receipt className="h-5 w-5 text-orange-600" />
      default:
        return <Wallet className="h-5 w-5 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "funding":
        return "text-green-600"
      case "withdrawal":
        return "text-blue-600"
      case "payment":
      case "fee":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getTotalByType = (type: string) => {
    return allTransactions
      .filter((t) => t.type === type && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0)
  }

  if (!userType) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    )
  }

  const backUrl = userType === "farmer" ? "/carteira-agricultor" : "/carteira-doador"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AgroFinance</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href={backUrl}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Histórico de Transações</h1>
          <p className="text-muted-foreground">Acompanhe todas suas movimentações financeiras</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ {getTotalByType("funding").toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sacado</CardTitle>
              <Download className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">R$ {getTotalByType("withdrawal").toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">R$ {getTotalByType("payment").toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transações</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allTransactions.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Descrição ou referência"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="funding">Financiamento</SelectItem>
                    <SelectItem value="withdrawal">Saque</SelectItem>
                    <SelectItem value="payment">Pagamento</SelectItem>
                    <SelectItem value="fee">Taxa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="failed">Falhou</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data Inicial</Label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Data Final</Label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setFilters({ type: "all", status: "all", dateFrom: "", dateTo: "", search: "" })}
              >
                Limpar Filtros
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Transações ({filteredTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{new Date(transaction.date).toLocaleDateString("pt-BR")}</span>
                        <span>•</span>
                        <span>{transaction.reference}</span>
                        <span>•</span>
                        <span>{transaction.method}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === "funding" ? "+" : "-"}R$ {transaction.amount.toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {transaction.status === "completed"
                        ? "Concluído"
                        : transaction.status === "pending"
                          ? "Pendente"
                          : "Falhou"}
                    </Badge>
                  </div>
                </div>
              ))}

              {filteredTransactions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma transação encontrada com os filtros aplicados</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
