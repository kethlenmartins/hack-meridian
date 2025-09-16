"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Download, Copy, CheckCircle, Calendar, DollarSign, FileText, Printer } from "lucide-react"

interface BoletoModalProps {
  isOpen: boolean
  onClose: () => void
  invoice?: {
    id: number
    amount: number
    dueDate: string
    installment?: number
    description?: string
  }
  type: "single" | "all"
}

export default function BoletoModal({ isOpen, onClose, invoice, type }: BoletoModalProps) {
  const [copied, setCopied] = useState(false)

  // Generate mock barcode
  const generateBarcode = () => {
    return "23793.39126 60000.000000 00000.000000 1 98765432100000" + (invoice?.amount || 0).toString().padStart(8, "0")
  }

  const handleCopyBarcode = () => {
    navigator.clipboard.writeText(generateBarcode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalAmount = type === "all" ? 7800 : invoice?.amount || 0 // Mock total for all installments
  const savings = type === "all" ? 2840 : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {type === "all" ? "Boleto - Antecipação Total" : `Boleto - Parcela #${invoice?.installment}`}
          </DialogTitle>
          <DialogDescription>
            {type === "all"
              ? "Boleto para quitação antecipada de todas as parcelas restantes"
              : "Boleto para pagamento da parcela selecionada"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Boleto Header */}
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">AF</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-green-800">AgroFinance</h3>
                    <p className="text-sm text-green-600">Microfinanças Agrícolas</p>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white">{type === "all" ? "ANTECIPAÇÃO" : "PARCELA"}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-green-600">Beneficiário</p>
                  <p className="font-medium text-green-800">AgroFinance LTDA</p>
                  <p className="text-sm text-green-600">CNPJ: 12.345.678/0001-90</p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Banco</p>
                  <p className="font-medium text-green-800">Banco do Brasil</p>
                  <p className="text-sm text-green-600">Agência: 1234-5 | Conta: 67890-1</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Vencimento</p>
                  <p className="font-medium">
                    {invoice?.dueDate
                      ? new Date(invoice.dueDate).toLocaleDateString("pt-BR")
                      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{type === "all" ? "Valor Total" : "Valor da Parcela"}</p>
                  <p className="font-bold text-lg">R$ {totalAmount.toLocaleString()}</p>
                </div>
              </div>

              {type === "all" && savings > 0 && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600">Economia com antecipação</p>
                  <p className="font-bold text-green-700">R$ {savings.toLocaleString()}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nosso Número</p>
                <p className="font-mono text-sm">000000{invoice?.id || 1}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Documento</p>
                <p className="font-mono text-sm">AGF{Date.now().toString().slice(-6)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Espécie</p>
                <p className="text-sm">Real (R$)</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Barcode Section */}
          <div className="space-y-4">
            <h4 className="font-medium">Código de Barras</h4>

            {/* Visual barcode representation */}
            <div className="bg-white p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-3">
                <div className="flex space-x-px">
                  {Array.from({ length: 50 }, (_, i) => (
                    <div key={i} className={`w-1 ${Math.random() > 0.5 ? "h-8 bg-black" : "h-6 bg-black"}`} />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="font-mono text-sm break-all">{generateBarcode()}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyBarcode} className="flex-1 bg-transparent">
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Código
                  </>
                )}
              </Button>

              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Instruções para Pagamento</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Pague em qualquer banco, lotérica ou app bancário</li>
              <li>• Use o código de barras ou digite a linha digitável</li>
              <li>• Pagamento será processado em até 2 dias úteis</li>
              <li>• Após o pagamento, você receberá confirmação por email</li>
              {type === "all" && (
                <li>
                  • <strong>Antecipação:</strong> Todas as parcelas restantes serão quitadas
                </li>
              )}
            </ul>
          </div>

          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Fechar
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700">Confirmar Geração</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
