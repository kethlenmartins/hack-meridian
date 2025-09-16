# Farm Investment Platform Backend Services

Este projeto contém três serviços NestJS separados para a plataforma de investimento agrícola, integrados com Supabase e PostgreSQL.

## 🏗️ Arquitetura

- **farmer-service**: Serviço de gerenciamento de agricultores, fazendas, culturas e upload de arquivos
- **investor-service**: Serviço de gerenciamento de investidores e investimentos
- **notification-service**: Serviço de envio de notificações por email
- **PostgreSQL**: Banco de dados Supabase para produção
- **Docker Compose**: Orquestração de todos os serviços

## 🚀 Configuração Rápida

### 1. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp env.local .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres.wcquqbjrchhcnrspebpf:[YOUR-PASSWORD]@aws-1-sa-east-1.pooler.supabase.com:5432/postgres

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Service Ports
FARMER_SERVICE_PORT=3001
INVESTOR_SERVICE_PORT=3002
NOTIFICATION_SERVICE_PORT=3003

# EmailJS Configuration (for notification service)
EMAILJS_PUBLIC_KEY=COfady7bphtUFGdT5
EMAILJS_SERVICE_ID=service_1p4rzqo
EMAILJS_TEMPLATE_ID=template_eqx6y92
```

### 2. Configurar Banco de Dados

1. Execute o script SQL no seu projeto Supabase:
   ```sql
   -- Execute o conteúdo do arquivo supabase-schema.sql no SQL Editor do Supabase
   ```

2. (Opcional) Se precisar de upload de arquivos, configure o storage no Supabase Dashboard

### 3. Executar com Docker Compose

```bash
# Opção 1: Usar o script automatizado
./start-all-services.sh

# Opção 2: Comandos manuais
# Subir todos os serviços
docker compose up -d

# Ver logs
docker compose logs -f

# Parar serviços
docker compose down
```

### 4. Executar em Desenvolvimento

```bash
# Instalar dependências
cd farmer-service && npm install
cd ../investor-service && npm install

# Executar farmer-service
cd farmer-service
npm run start:dev

# Executar investor-service (em outro terminal)
cd investor-service
npm run start:dev

# Executar notification-service (em outro terminal)
cd notification-service
npm run start:dev
```

## 📚 Documentação da API

Após iniciar os serviços, acesse:

- **Farmer Service**: http://localhost:3001/api/docs
- **Investor Service**: http://localhost:3002/api/docs
- **Notification Service**: http://localhost:3003/api/docs

## 🔧 Endpoints Principais

### Farmer Service (Porta 3001)

- `POST /farmers` - Criar agricultor
- `GET /farmers` - Listar agricultores
- `GET /farmers/:id` - Obter agricultor por ID
- `PUT /farmers/:id` - Atualizar agricultor
- `DELETE /farmers/:id` - Deletar agricultor
- `GET /farmers/state/:state` - Listar agricultores por estado
- `GET /farmers/certification/:certification` - Listar agricultores por certificação
- `GET /farms` - Listar fazendas
- `GET /crops` - Listar culturas
- `GET /health` - Health check

### Investor Service (Porta 3002)

- `GET /investors` - Listar investidores
- `GET /investments` - Listar investimentos
- `GET /portfolios` - Listar portfólios
- `GET /health` - Health check

### Notification Service (Porta 3003)

- `POST /notifications` - Enviar notificação por email
- `GET /notifications` - Listar notificações
- `GET /health` - Health check

## 🔐 Autenticação

O sistema usa JWT para autenticação. Para usar os endpoints protegidos:

1. Faça login via endpoint de autenticação (a ser implementado)
2. Use o token retornado no header `Authorization: Bearer <token>`
3. Para operações específicas, inclua o header `x-user-id: <user_id>`

## 📁 Estrutura de Arquivos

```
backend/
├── farmer-service/        # Serviço de agricultores
│   ├── src/
│   │   ├── domain/        # Entidades e regras de negócio
│   │   ├── application/   # DTOs e casos de uso
│   │   ├── infrastructure/ # Repositórios e serviços externos
│   │   └── modules/       # Módulos NestJS
│   ├── Dockerfile
│   └── package.json
├── investor-service/      # Serviço de investidores
│   ├── src/
│   │   ├── domain/        # Entidades e regras de negócio
│   │   ├── application/   # DTOs e casos de uso
│   │   ├── infrastructure/ # Repositórios e serviços externos
│   │   └── modules/       # Módulos NestJS
│   ├── Dockerfile
│   └── package.json
├── notification-service/  # Serviço de notificações
│   ├── src/
│   │   ├── domain/        # Entidades e regras de negócio
│   │   ├── application/   # DTOs e casos de uso
│   │   ├── infrastructure/ # Repositórios e serviços externos
│   │   └── modules/       # Módulos NestJS
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml     # Orquestração dos serviços
├── supabase-schema.sql    # Schema do banco de dados
└── env.local             # Exemplo de variáveis de ambiente
```

## 🛠️ Desenvolvimento

### Adicionando Novos Endpoints

1. Crie os DTOs necessários em `dto/`
2. Implemente a lógica no service
3. Crie o controller com decorators do Swagger
4. Adicione validações e tratamento de erros

### Testando

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com Supabase**: Verifique as variáveis de ambiente
2. **Erro de upload de arquivo**: Verifique se o bucket existe e as políticas estão configuradas
3. **Erro de autenticação**: Verifique se o JWT_SECRET está configurado

### Logs

```bash
# Ver logs de um serviço específico
docker-compose logs -f auth-service
docker-compose logs -f file-service

# Ver logs de todos os serviços
docker-compose logs -f
```

## 📝 Notas Importantes

- O file-service tem limite de 10MB por arquivo
- Os arquivos são organizados por usuário e pasta opcional
- O sistema usa UUIDs para identificação única
- Todas as operações são auditadas com timestamps
- O sistema implementa Row Level Security (RLS) no Supabase
