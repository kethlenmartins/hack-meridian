"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Heart, TrendingUp, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CadastroDoadrPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpfCnpj: "",
    password: "",
    confirmPassword: "",
    type: "donation", // 'donation' or 'investment'
    acceptTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      return
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Erro no cadastro",
        description: "Você deve aceitar os termos e condições.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("userType", "donor")
      localStorage.setItem("userEmail", formData.email)
      localStorage.setItem("donationType", formData.type)

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Bem-vindo à AgroFinance. Redirecionando...",
      })

      router.push("/carteira-doador")
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Cadastro de Apoiador</CardTitle>
              <CardDescription>Junte-se a nós para apoiar a agricultura familiar brasileira</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informações Pessoais</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome completo"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                      <Input
                        id="cpfCnpj"
                        placeholder="000.000.000-00"
                        value={formData.cpfCnpj}
                        onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirme sua senha"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Support Type */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tipo de Apoio</h3>
                  <p className="text-sm text-muted-foreground">Escolha como você gostaria de apoiar os agricultores</p>

                  <RadioGroup
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <div className="flex items-start space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="donation" id="donation" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="donation" className="flex items-center gap-2 font-medium">
                          <Heart className="h-4 w-4 text-red-500" />
                          Doação (Sem Retorno)
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Apoie agricultores sem expectativa de retorno financeiro. Seu dinheiro será usado
                          integralmente para ajudar os projetos.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="investment" id="investment" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="investment" className="flex items-center gap-2 font-medium">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          Investimento (Com Retorno)
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Invista e receba retorno de <strong>10% ao ano</strong> em <strong>2 anos</strong>. Ajude
                          agricultores enquanto faz seu dinheiro crescer.
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                          <Info className="h-3 w-3" />
                          <span>Taxa de administração: 2% sobre o retorno</span>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Terms */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    Concordo com os{" "}
                    <Link href="/termos" className="text-primary hover:underline">
                      Termos de Uso
                    </Link>{" "}
                    e{" "}
                    <Link href="/privacidade" className="text-primary hover:underline">
                      Política de Privacidade
                    </Link>
                    , e estou ciente das taxas aplicáveis.
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Criando conta..." : "Criar Conta"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Já tem uma conta?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Faça login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
