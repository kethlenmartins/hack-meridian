# Stellar Smart Contract Integration Service

Serviço de integração com smart contracts na rede Stellar usando o [Stellar SDK](https://stellar.github.io/js-stellar-sdk/).

## 🚀 Funcionalidades

- ✅ Conexão com a rede Stellar (Testnet/Mainnet)
- ✅ Invocação de funções de smart contracts
- ✅ Simulação de transações (sem custo)
- ✅ Deploy de novos contratos
- ✅ Consulta de informações de contratos
- ✅ Histórico de transações
- ✅ Utilitários para gerenciamento de contas
- ✅ API REST completa com Swagger
- ✅ Containerização com Docker

## 🛠️ Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `env.example` para `env.local` e configure:

```bash
cp env.example env.local
```

```env
# Configurações do Serviço
NODE_ENV=development
PORT=3004

# Configurações da Rede Stellar
STELLAR_NETWORK=testnet  # ou 'mainnet'

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 2. Instalação de Dependências

```bash
npm install
```

### 3. Execução

#### Modo Desenvolvimento
```bash
npm run start:dev
```

#### Modo Produção
```bash
npm run build
npm run start:prod
```

#### Com Docker
```bash
# Construir e executar o serviço individual
docker build -t stellar-contract-service .
docker run -p 3004:3004 stellar-contract-service

# Ou usar o docker-compose (recomendado)
cd ../
docker compose up stellar-contract-service
```

## 📚 API Documentation

Após iniciar o serviço, acesse a documentação Swagger em:
- **Local**: http://localhost:3004/api
- **Health Check**: http://localhost:3004/health

## 🔧 Endpoints Principais

### 1. Invocação de Contratos

```bash
POST /contracts/invoke
```

**Exemplo de payload:**
```json
{
  "contractId": "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHAGK5RXVZ",
  "functionName": "transfer",
  "args": ["GABC123...", 1000],
  "secretKey": "SABC123..."
}
```

### 2. Simulação de Contratos

```bash
POST /contracts/simulate
```

**Exemplo de payload:**
```json
{
  "contractId": "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHAGK5RXVZ",
  "functionName": "balance",
  "args": ["GABC123..."],
  "publicKey": "GABC123..."
}
```

### 3. Informações do Contrato

```bash
GET /contracts/{contractId}
```

### 4. Histórico de Transações

```bash
GET /contracts/{contractId}/history?limit=10
```

### 5. Utilitários

```bash
# Criar novo par de chaves
GET /contracts/utils/create-keypair

# Verificar conta
GET /contracts/utils/check-account/{publicKey}
```

## 🔐 Segurança

⚠️ **IMPORTANTE**: 
- Nunca exponha chaves secretas em logs ou repositórios
- Use variáveis de ambiente para chaves sensíveis
- Para produção, implemente autenticação adequada
- Considere usar um serviço de gerenciamento de chaves

## 💡 Exemplos de Uso

### Exemplo 1: Verificar Conta

```bash
curl -X GET "http://localhost:3004/contracts/utils/check-account/GABC123..."
```

### Exemplo 2: Criar Novo Keypair

```bash
curl -X GET "http://localhost:3004/contracts/utils/create-keypair"
```

### Exemplo 3: Simular Função de Contrato

```bash
curl -X POST "http://localhost:3004/contracts/simulate" \
  -H "Content-Type: application/json" \
  -d '{
    "contractId": "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHAGK5RXVZ",
    "functionName": "balance",
    "args": ["GABC123..."],
    "publicKey": "GABC123..."
  }'
```

### Exemplo 4: Invocar Função de Contrato

```bash
curl -X POST "http://localhost:3004/contracts/invoke" \
  -H "Content-Type: application/json" \
  -d '{
    "contractId": "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHAGK5RXVZ",
    "functionName": "transfer",
    "args": ["GDEST123...", 1000],
    "secretKey": "SABC123..."
  }'
```

## 🔄 Integração com Outros Serviços

Este serviço pode ser facilmente integrado com os outros serviços do projeto:

### Farmer Service
```javascript
// Registrar uma fazenda no blockchain
const response = await fetch('http://stellar-contract-service:3004/contracts/invoke', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contractId: 'FARM_CONTRACT_ID',
    functionName: 'register_farm',
    args: [farmId, farmerAddress, cropType],
    secretKey: farmerSecretKey
  })
});
```

### Investor Service
```javascript
// Fazer um investimento via smart contract
const response = await fetch('http://stellar-contract-service:3004/contracts/invoke', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contractId: 'INVESTMENT_CONTRACT_ID',
    functionName: 'invest',
    args: [farmId, amount],
    secretKey: investorSecretKey
  })
});
```

## 🧪 Testnet vs Mainnet

### Testnet (Desenvolvimento)
- **Network**: `testnet`
- **Horizon**: https://horizon-testnet.stellar.org
- **RPC**: https://soroban-rpc.stellar.org:443
- **Faucet**: https://laboratory.stellar.org/#account-creator

### Mainnet (Produção)
- **Network**: `mainnet`
- **Horizon**: https://horizon.stellar.org
- **RPC**: https://soroban-rpc.stellar.org
- **Cuidado**: Transações reais com XLM real

## 🔍 Logs e Monitoramento

O serviço inclui logs detalhados:

```bash
# Visualizar logs do container
docker compose logs -f stellar-contract-service

# Logs em tempo real durante desenvolvimento
npm run start:dev
```

## 🚨 Troubleshooting

### Erro: "Account does not exist"
- Certifique-se de que a conta foi criada e financiada na rede
- Para testnet, use o [Stellar Laboratory](https://laboratory.stellar.org/#account-creator)

### Erro: "Contract not found"
- Verifique se o contractId está correto
- Confirme se está na rede correta (testnet/mainnet)

### Erro: "Insufficient funds"
- A conta precisa ter saldo suficiente para pagar as taxas
- Taxas típicas: ~0.00001 XLM por operação

### Erro: "Invalid secret key"
- Verifique se a chave secreta está no formato correto
- Chaves secretas começam com 'S'

## 📖 Recursos Adicionais

- [Stellar SDK Documentation](https://stellar.github.io/js-stellar-sdk/)
- [Soroban Smart Contracts](https://soroban.stellar.org/)
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Stellar Network Status](https://status.stellar.org/)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
