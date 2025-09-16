# Sistema de Carteira - AgroFinance

## Visão Geral

Este sistema implementa um sistema de carteira mockado usando JSON para gerenciar saldo, dívidas e transações de agricultores e doadores. Todas as interações são persistidas no localStorage durante a sessão.

## Componentes Principais

### 1. Dados Mockados (`lib/wallet-data.json`)
- **Agricultores**: Dados completos com carteira, transações e parcelas
- **Doadores**: Saldo disponível e histórico de doações
- **Transações**: Histórico completo de movimentações

### 2. Serviço de Carteira (`lib/wallet-service.ts`)
Gerencia todas as operações:
- **Saque**: Diminui saldo do agricultor
- **Pagamento**: Diminui dívida e atualiza parcelas
- **Doação**: Transfere dinheiro do doador para o agricultor
- **Financiamento**: Adiciona fundos ao agricultor

### 3. Páginas Integradas

#### Carteira do Agricultor (`/carteira-agricultor`)
- Exibe saldo disponível, dívida atual e progresso
- Lista transações recentes
- Mostra parcelas pendentes
- Dados atualizados em tempo real

#### Saque (`/saque`)
- Permite sacar dinheiro da carteira
- Valida saldo disponível
- Atualiza saldo e adiciona transação

#### Faturas (`/faturas`)
- Lista todas as parcelas (pagas e pendentes)
- Permite pagar parcelas individuais
- Opção de pagamento antecipado com desconto

#### Doação (`/doar`)
- Permite doadores fazerem doações
- Atualiza saldo de ambos (doador e agricultor)
- Registra transação para ambas as partes

#### Demo (`/demo-carteira`)
- Página interativa para testar todas as funcionalidades
- Permite simular operações sem navegar entre páginas
- Botão para resetar dados ao estado inicial

## Como Funciona

### Fluxo de Dados
1. **Inicialização**: Dados carregados do JSON mockado
2. **Persistência**: Alterações salvas no localStorage
3. **Sincronização**: Páginas se atualizam automaticamente
4. **Reset**: Botão para voltar ao estado inicial

### Operações Suportadas

#### 💵 Depósito (Apenas Sistema/Admin)
```typescript
// Sistema registra entrada de dinheiro externa
WalletService.processDeposit("farmer_001", 2000, "Venda de colheita")
// Resultado:
// - Saldo do agricultor: +R$ 2.000
// - Nova transação de depósito registrada
// Nota: Agricultores NÃO fazem depósitos diretos na interface
```

#### 💰 Doação
```typescript
// Doador doa R$ 1.000 para agricultor
WalletService.processDonation("donor_001", "farmer_001", 1000, "Mensagem")
// Resultado: 
// - Saldo do doador: -R$ 1.000
// - Saldo do agricultor: +R$ 1.000
// - Nova transação registrada para ambos
```

#### 💸 Saque
```typescript
// Agricultor saca R$ 500
WalletService.processWithdrawal("farmer_001", 500, "Banco XYZ")
// Resultado:
// - Saldo do agricultor: -R$ 500
// - Nova transação de saque registrada
```

#### 💳 Pagamento de Parcela
```typescript
// Agricultor paga parcela #1
WalletService.processPayment("farmer_001", 1)
// Resultado:
// - Dívida diminui no valor da parcela
// - Parcela marcada como paga
// - Progresso atualizado
```

#### 💰 Pagamento Antecipado
```typescript
// Agricultor quita todas as parcelas
WalletService.processAllPayments("farmer_001")
// Resultado:
// - Todas as parcelas quitadas
// - 30% de desconto nos juros
// - Dívida zerada
```

## Dados de Exemplo

### Agricultor (farmer_001)
- **Nome**: João Silva Santos
- **Saldo Inicial**: R$ 45.000
- **Dívida Total**: R$ 52.000
- **Parcelas Pendentes**: 3
- **Localização**: São João do Campo - SP

### Doador (donor_001)
- **Nome**: Maria Santos
- **Saldo Inicial**: R$ 25.000
- **Doações Realizadas**: 1 (R$ 15.000)

## Páginas para Testar

1. **`/demo-carteira`** - Página principal para testar tudo (inclui depósito administrativo)
2. **`/carteira-agricultor`** - Visualizar dados do agricultor (apenas saque disponível)
3. **`/depositar`** - ⚠️ Página administrativa (não acessível pelo agricultor)
4. **`/saque`** - Testar funcionalidade de saque do agricultor
5. **`/faturas`** - Testar pagamento de parcelas
6. **`/doar`** - Testar funcionalidade de doação

## Funcionalidades Implementadas

✅ **Sistema de Saldo**: Controla saldo disponível para saque  
✅ **Sistema de Dívidas**: Gerencia parcelas e pagamentos  
✅ **Histórico de Transações**: Registra todas as movimentações  
✅ **Depósitos Administrativos**: Sistema registra entradas externas de dinheiro  
✅ **Saques**: Agricultores podem retirar dinheiro do saldo  
✅ **Doações**: Doadores transferem dinheiro para agricultores  
✅ **Pagamentos**: Individual e antecipado com desconto  
✅ **Controle de Acesso**: Agricultores só podem sacar, não depositar  
✅ **Persistência**: Dados salvos no localStorage  
✅ **Validações**: Saldo insuficiente, valores inválidos  
✅ **Interface Responsiva**: Funciona em desktop e mobile  
✅ **Feedback Visual**: Toasts para todas as operações  

## Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes UI
- **localStorage** - Persistência de dados
- **JSON** - Dados mockados

## Como Usar

1. Acesse `/demo-carteira` para uma demonstração completa
2. Use as abas para alternar entre visões (Agricultor, Doador, Ações)
3. Teste as operações na aba "Ações"
4. Observe as mudanças em tempo real nos dados
5. Use "Resetar Dados" para voltar ao estado inicial

O sistema simula perfeitamente um ambiente real onde:
- **Saldo do agricultor aumenta** apenas via doações e financiamentos externos
- **Agricultores podem apenas sacar** dinheiro do saldo disponível
- **Doadores transferem dinheiro** diretamente para agricultores
- **Pagamentos diminuem a dívida** e atualizam parcelas
- **Depósitos são administrativos** (sistema registra vendas, financiamentos, etc.)
- **Todas as operações geram transações** para auditoria e rastreabilidade

Ideal para demonstrações, testes e desenvolvimento de funcionalidades relacionadas a carteiras digitais no agronegócio.
