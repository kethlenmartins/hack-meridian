"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Sprout } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl text-foreground">AgroFinance</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
              Como Funciona
            </Link>
            <Link href="#contato" className="text-muted-foreground hover:text-foreground transition-colors">
              Ranking
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/cadastro-doador">
              <Button>Quero Apoiar</Button>
            </Link>
            <Link href="/cadastro-agricultor">
              <Button variant="outline">Quero Captar</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
                Como Funciona
              </Link>
              <Link href="/sobre" className="text-muted-foreground hover:text-foreground transition-colors">
                Sobre
              </Link>
              <Link href="/contato" className="text-muted-foreground hover:text-foreground transition-colors">
                Contato
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/login">
                  <Button variant="ghost" className="w-full">
                    Entrar
                  </Button>
                </Link>
                <Link href="/cadastro-doador">
                  <Button className="w-full">Quero Apoiar</Button>
                </Link>
                <Link href="/cadastro-agricultor">
                  <Button variant="outline" className="w-full bg-transparent">
                    Quero Captar
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
