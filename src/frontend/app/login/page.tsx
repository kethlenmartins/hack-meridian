"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sprout, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock authentication logic
      if (email && password) {
        // Store user type in localStorage for demo purposes
        const userType = email.includes("agricultor") ? "farmer" : "donor"
        localStorage.setItem("userType", userType)
        localStorage.setItem("userEmail", email)

        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para sua carteira...",
        })

        // Redirect based on user type
        if (userType === "farmer") {
          router.push("/carteira-agricultor")
        } else {
          router.push("/carteira-doador")
        }
      } else {
        toast({
          title: "Erro no login",
          description: "Verifique suas credenciais e tente novamente.",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Sprout className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Entrar na AgroFinance</CardTitle>
              <CardDescription>Acesse sua conta para gerenciar seus investimentos ou captações</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-4">
                <Link href="/esqueci-senha" className="text-sm text-primary hover:underline">
                  Esqueci minha senha
                </Link>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-4">Ainda não tem uma conta?</p>
                  <div className="space-y-2">
                    <Link href="/cadastro-doador" className="block">
                      <Button variant="outline" className="w-full bg-transparent">
                        Cadastrar como Apoiador
                      </Button>
                    </Link>
                    <Link href="/cadastro-agricultor" className="block">
                      <Button variant="outline" className="w-full bg-transparent">
                        Cadastrar como Agricultor
                      </Button>
                    </Link>
                  </div>
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
