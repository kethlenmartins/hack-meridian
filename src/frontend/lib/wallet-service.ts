import walletData from './wallet-data.json'

export type TransactionType = 'donation' | 'withdrawal' | 'payment' | 'funding'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  date: string
  status: 'completed' | 'pending' | 'failed'
  description: string
  reference: string
  donorName?: string
  bankAccount?: string
  installmentId?: number
  investorName?: string
}

export interface Installment {
  id: number
  dueDate: string
  amount: number
  interest: number
  principal: number
  status: 'pending' | 'paid' | 'overdue'
  overdue: boolean
  paidDate?: string
}

export interface Wallet {
  balance: number
  totalDebt: number
  originalAmount: number
  interestRate: number
  monthlyPayment: number
  paidAmount: number
  remainingAmount: number
  nextPaymentDate: string
  remainingMonths: number
  projectDescription: string
  projectArea: string
  requestedAmount: number
}

export interface Farmer {
  id: string
  name: string
  email: string
  cpf: string
  phone: string
  location: string
  wallet: Wallet
  transactions: Transaction[]
  installments: Installment[]
}

export interface Donor {
  id: string
  name: string
  email: string
  cpf: string
  phone: string
  wallet: {
    balance: number
  }
  donations: Array<{
    id: string
    farmerId: string
    amount: number
    date: string
    status: string
    message: string
  }>
}

// Simulate localStorage persistence
let currentData = structuredClone(walletData)

// Helper functions to simulate localStorage
const saveToStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('walletData', JSON.stringify(currentData))
  }
}

const loadFromStorage = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('walletData')
    if (stored) {
      currentData = JSON.parse(stored)
    }
  }
}

// Initialize data from localStorage if available
if (typeof window !== 'undefined') {
  loadFromStorage()
}

export class WalletService {
  // Get farmer by ID
  static getFarmer(farmerId: string): Farmer | null {
    return currentData.farmers[farmerId as keyof typeof currentData.farmers] || null
  }

  // Get donor by ID
  static getDonor(donorId: string): Donor | null {
    return currentData.donors[donorId as keyof typeof currentData.donors] || null
  }

  // Get all farmers
  static getAllFarmers(): Farmer[] {
    return Object.values(currentData.farmers)
  }

  // Get all donors
  static getAllDonors(): Donor[] {
    return Object.values(currentData.donors)
  }

  // Process withdrawal
  static processWithdrawal(farmerId: string, amount: number, bankAccount: string): boolean {
    const farmer = this.getFarmer(farmerId)
    if (!farmer) {
      throw new Error('Agricultor não encontrado')
    }

    if (amount <= 0) {
      throw new Error('Valor do saque deve ser maior que zero')
    }

    if (farmer.wallet.balance < amount) {
      throw new Error('Saldo insuficiente')
    }

    // Update balance
    farmer.wallet.balance -= amount

    // Add transaction
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      type: 'withdrawal',
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      description: 'Saque para conta corrente',
      reference: `SAQ${Date.now().toString().slice(-6)}`,
      bankAccount
    }

    farmer.transactions.unshift(transaction)
    saveToStorage()
    return true
  }

  // Process payment
  static processPayment(farmerId: string, installmentId: number): boolean {
    const farmer = this.getFarmer(farmerId)
    if (!farmer) return false

    const installment = farmer.installments.find(i => i.id === installmentId)
    if (!installment || installment.status === 'paid') return false

    // Update installment
    installment.status = 'paid'
    installment.paidDate = new Date().toISOString().split('T')[0]

    // Update wallet debt
    farmer.wallet.paidAmount += installment.amount
    farmer.wallet.remainingAmount -= installment.amount
    farmer.wallet.remainingMonths = farmer.installments.filter(i => i.status === 'pending').length

    // Update next payment date
    const nextPendingInstallment = farmer.installments
      .filter(i => i.status === 'pending')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
    
    if (nextPendingInstallment) {
      farmer.wallet.nextPaymentDate = nextPendingInstallment.dueDate
    }

    // Add transaction
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      type: 'payment',
      amount: installment.amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      description: `Pagamento parcela #${installmentId}`,
      reference: `PAG${Date.now().toString().slice(-6)}`,
      installmentId
    }

    farmer.transactions.unshift(transaction)
    saveToStorage()
    return true
  }

  // Process all payments (early payment)
  static processAllPayments(farmerId: string): { success: boolean; totalAmount: number; savings: number } {
    const farmer = this.getFarmer(farmerId)
    if (!farmer) return { success: false, totalAmount: 0, savings: 0 }

    const pendingInstallments = farmer.installments.filter(i => i.status === 'pending')
    if (pendingInstallments.length === 0) {
      return { success: false, totalAmount: 0, savings: 0 }
    }

    const totalAmount = pendingInstallments.reduce((sum, i) => sum + i.amount, 0)
    const totalInterest = pendingInstallments.reduce((sum, i) => sum + i.interest, 0)
    const savings = totalInterest * 0.3 // 30% discount on early payment
    const finalAmount = totalAmount - savings

    // Update all installments
    pendingInstallments.forEach(installment => {
      installment.status = 'paid'
      installment.paidDate = new Date().toISOString().split('T')[0]
    })

    // Update wallet debt
    farmer.wallet.paidAmount += finalAmount
    farmer.wallet.remainingAmount = 0
    farmer.wallet.remainingMonths = 0
    farmer.wallet.nextPaymentDate = ''

    // Add transaction
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      type: 'payment',
      amount: finalAmount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      description: `Pagamento antecipado de todas as parcelas (${pendingInstallments.length} parcelas)`,
      reference: `PAG${Date.now().toString().slice(-6)}`,
      installmentId: -1 // Special ID for bulk payment
    }

    farmer.transactions.unshift(transaction)
    saveToStorage()
    return { success: true, totalAmount: finalAmount, savings }
  }

  // Process donation
  static processDonation(
    donorId: string, 
    farmerId: string, 
    amount: number, 
    message: string = ''
  ): boolean {
    const donor = this.getDonor(donorId)
    const farmer = this.getFarmer(farmerId)
    
    if (!donor || !farmer) return false

    if (donor.wallet.balance < amount) {
      throw new Error('Saldo insuficiente do doador')
    }

    // Update donor balance
    donor.wallet.balance -= amount

    // Update farmer balance
    farmer.wallet.balance += amount

    // Add donation to donor
    const donation = {
      id: `don_${Date.now()}`,
      farmerId,
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      message
    }
    donor.donations.unshift(donation)

    // Add transaction to farmer
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      type: 'donation',
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      description: `Doação recebida - ${donor.name}`,
      reference: `DOA${Date.now().toString().slice(-6)}`,
      donorName: donor.name
    }

    farmer.transactions.unshift(transaction)
    saveToStorage()
    return true
  }

  // Process deposit
  static processDeposit(farmerId: string, amount: number, source: string = 'Depósito bancário'): boolean {
    const farmer = this.getFarmer(farmerId)
    if (!farmer) return false

    if (amount <= 0) {
      throw new Error('Valor do depósito deve ser maior que zero')
    }

    // Update farmer balance
    farmer.wallet.balance += amount

    // Add transaction
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      type: 'funding',
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      description: `Depósito realizado - ${source}`,
      reference: `DEP${Date.now().toString().slice(-6)}`,
      investorName: source
    }

    farmer.transactions.unshift(transaction)
    saveToStorage()
    return true
  }

  // Add funding (investment)
  static addFunding(farmerId: string, amount: number, investorName: string): boolean {
    const farmer = this.getFarmer(farmerId)
    if (!farmer) return false

    // Update farmer balance
    farmer.wallet.balance += amount

    // Add transaction
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      type: 'funding',
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      description: `Financiamento recebido - ${investorName}`,
      reference: `FIN${Date.now().toString().slice(-6)}`,
      investorName
    }

    farmer.transactions.unshift(transaction)
    saveToStorage()
    return true
  }

  // Get transaction history for farmer
  static getFarmerTransactions(farmerId: string, limit?: number): Transaction[] {
    const farmer = this.getFarmer(farmerId)
    if (!farmer) return []

    const transactions = [...farmer.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return limit ? transactions.slice(0, limit) : transactions
  }

  // Get pending installments for farmer
  static getPendingInstallments(farmerId: string): Installment[] {
    const farmer = this.getFarmer(farmerId)
    if (!farmer) return []

    return farmer.installments
      .filter(i => i.status === 'pending')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }

  // Reset data to initial state (for testing)
  static resetData(): void {
    currentData = structuredClone(walletData)
    saveToStorage()
  }

  // Get current data (for debugging)
  static getCurrentData() {
    return currentData
  }
}

export default WalletService
