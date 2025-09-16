"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Wallet, ArrowLeft, Building, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SaquePage() {
  const [formData, setFormData] = useState({
    amount: "",
    bank: "",
    agency: "",
    account: "",
    accountType: "checking",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const availableBalance = 45000 // Mock available balance

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const amount = Number.parseFloat(formData.amount)

    if (!amount || amount < 50) {
      toast({
        title: "Valor inválido",
        description: "O valor mínimo para saque é R$ 50,00.",
        variant: "destructive",
      })
      return
    }

    if (amount > availableBalance) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não tem saldo suficiente para este saque.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Saque solicitado com sucesso!",
        description: `R$ ${amount.toLocaleString()} será transferido em até 2 dias úteis.`,
      })

      router.push("/carteira-agricultor")
      setIsLoading(false)
    }, 2000)
  }

  const banks = [
    { value: "001", label: "Banco do Brasil" },
    { value: "104", label: "Caixa Econômica Federal" },
    { value: "237", label: "Bradesco" },
    { value: "341", label: "Itaú" },
    { value: "033", label: "Santander" },
    { value: "260", label: "Nu Pagamentos (Nubank)" },
    { value: "077", label: "Banco Inter" },
    { value: "212", label: "Banco Original" },
  ]

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
            <h1 className="text-3xl font-bold text-foreground mb-2">Solicitar Saque</h1>
            <p className="text-muted-foreground">Transfira seus recursos para sua conta bancária</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Dados do Saque
              </CardTitle>
              <CardDescription>Saldo disponível: R$ {availableBalance.toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor do Saque (R$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0,00"
                    min="50"
                    max={availableBalance}
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="text-xl h-12"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Valor mínimo: R$ 50,00 | Valor máximo: R$ {availableBalance.toLocaleString()}
                  </p>
                </div>

                {/* Bank Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Dados Bancários
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank">Banco</Label>
                      <Select
                        value={formData.bank}
                        onValueChange={(value) => setFormData({ ...formData, bank: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o banco" />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map((bank) => (
                            <SelectItem key={bank.value} value={bank.value}>
                              {bank.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agency">Agência</Label>
                      <Input
                        id="agency"
                        placeholder="0000"
                        value={formData.agency}
                        onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="account">Número da Conta</Label>
                      <Input
                        id="account"
                        placeholder="00000-0"
                        value={formData.account}
                        onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountType">Tipo de Conta</Label>
                      <Select
                        value={formData.accountType}
                        onValueChange={(value) => setFormData({ ...formData, accountType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checking">Conta Corrente</SelectItem>
                          <SelectItem value="savings">Conta Poupança</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Informações Importantes</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• O saque será processado em até 2 dias úteis</li>
                        <li>• A conta bancária deve estar no mesmo CPF/CNPJ do cadastro</li>
                        <li>• Não há taxa para saques acima de R$ 100,00</li>
                        <li>• Saques abaixo de R$ 100,00 têm taxa de R$ 2,50</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                {formData.amount && (
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <h3 className="font-semibold mb-2">Resumo do Saque</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Valor solicitado:</span>
                        <span>R$ {Number.parseFloat(formData.amount || "0").toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxa:</span>
                        <span>{Number.parseFloat(formData.amount || "0") >= 100 ? "R$ 0,00" : "R$ 2,50"}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-1">
                        <span>Valor a receber:</span>
                        <span>
                          R${" "}
                          {(
                            Number.parseFloat(formData.amount || "0") -
                            (Number.parseFloat(formData.amount || "0") >= 100 ? 0 : 2.5)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full h-12" disabled={isLoading}>
                  {isLoading
                    ? "Processando..."
                    : `Solicitar Saque de R$ ${Number.parseFloat(formData.amount || "0").toLocaleString()}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
