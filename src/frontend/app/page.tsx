import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ArrowRight, Users, TrendingUp, Shield, Heart, DollarSign, Sprout, Star } from "lucide-react"

export default function LandingPage() {
  // Mock data for rankings
  const topFarmers = [
    { name: "Fazenda Verde", location: "São Paulo", funded: 95, goal: 100000 },
    { name: "Cultivo Sustentável", location: "Minas Gerais", funded: 87, goal: 75000 },
    { name: "Agricultura Familiar", location: "Rio Grande do Sul", funded: 78, goal: 50000 },
  ]

  const topInvestors = [
    { name: "Carlos Eduardo Silva", totalInvested: 250000, projects: 15, type: "Investidor" },
    { name: "Maria Fernanda Santos", totalInvested: 180000, projects: 22, type: "Doadora" },
    { name: "João Pedro Oliveira", totalInvested: 150000, projects: 8, type: "Investidor" },
    { name: "Ana Carolina Lima", totalInvested: 120000, projects: 12, type: "Investidora" },
    { name: "Roberto Mendes", totalInvested: 95000, projects: 18, type: "Doador" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[url('/bg.png')] bg-cover bg-center">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
              Conectando <span className="text-green-300">Investidores</span> com{" "}
              <span className="text-yellow-400">Agricultores</span>
            </h1>
            <p className="text-xl text-white mb-8 text-pretty">
              Apoie a agricultura familiar brasileira através de doações ou investimentos seguros. Transparência total,
              impacto real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cadastro-doador">
                <Button size="lg" className="w-full sm:w-auto">
                  <Heart className="mr-2 h-5 w-5" />
                  Quero Apoiar
                </Button>
              </Link>
              <Link href="/cadastro-agricultor">
                <Button size="lg" variant="outline" className="text-white w-full sm:w-auto bg-transparent">
                  <Sprout className="mr-2 h-5 w-5" />
                  Quero Captar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Como Funciona</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Um processo simples e transparente para conectar quem quer ajudar com quem precisa crescer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Invista ou Doe</h3>
              <p className="text-muted-foreground">
                Escolha apoiar agricultores através de doações (sem retorno) ou investimentos (com retorno de 10% ao
                ano)
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Distribuição Automática</h3>
              <p className="text-muted-foreground">
                Nossa plataforma distribui os recursos de forma anônima para agricultores que atingiram suas metas
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Impacto Real</h3>
              <p className="text-muted-foreground">
                Acompanhe o crescimento dos projetos e, no caso de investimentos, receba seus retornos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Farmers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">TOP Agricultores</h2>
            <p className="text-muted-foreground">Projetos que estão próximos de atingir suas metas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topFarmers.map((farmer, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{farmer.name}</CardTitle>
                    <Badge variant="secondary">#{index + 1}</Badge>
                  </div>
                  <CardDescription>{farmer.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Captado</span>
                        <span>R$ {farmer.funded.toLocaleString()}</span>
                      </div>
                      <Progress value={(farmer.funded / farmer.goal) * 100} className="h-2" />
                      <div className="text-right text-sm text-muted-foreground mt-1">
                        Meta: R$ {farmer.goal.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Investors */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">TOP Apoiadores</h2>
            <p className="text-muted-foreground">Maiores contribuidores da plataforma</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  TOP Apoiadores
                </CardTitle>
                <CardDescription>Maiores contribuidores da plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {topInvestors.map((investor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{investor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {investor.type} • {investor.projects} projetos apoiados
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">R$ {investor.totalInvested.toLocaleString()}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        <span className="text-xs text-muted-foreground">Destaque</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Por que Escolher a AgroFinance?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">100% Seguro</h3>
              <p className="text-muted-foreground">Plataforma regulamentada com total transparência nas operações</p>
            </div>

            <div className="text-center">
              <Users className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Anonimato Total</h3>
              <p className="text-muted-foreground">
                Doadores e agricultores não se conhecem, garantindo privacidade para todos
              </p>
            </div>

            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Retorno Atrativo</h3>
              <p className="text-muted-foreground">Investimentos com retorno de 10% ao ano em 2 anos</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Fazer a Diferença?</h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de pessoas que já estão transformando a agricultura brasileira
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro-doador">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
