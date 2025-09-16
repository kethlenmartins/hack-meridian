# Notification Service

Serviço responsável pelo envio de notificações por email na plataforma de investimento agrícola.

## Funcionalidades

- ✅ Envio de notificações por email
- ✅ Armazenamento de histórico de notificações
- ✅ Suporte a templates de email (Handlebars)
- ✅ Health check do serviço
- ✅ API REST com documentação Swagger
- ✅ Rate limiting
- ✅ Validação de dados

## Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **Supabase** - Banco de dados
- **Nodemailer** - Envio de emails
- **Handlebars** - Templates de email
- **Swagger** - Documentação da API

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp env.example .env
```

3. Configure as variáveis no arquivo `.env`:
   - `SUPABASE_URL` e `SUPABASE_ANON_KEY` para o banco de dados
   - `SMTP_*` para configuração do servidor de email
   - `JWT_SECRET` para autenticação

4. Execute o serviço:
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## API Endpoints

### Notificações

- `POST /notifications` - Enviar notificação
- `GET /notifications` - Listar notificações

### Health Check

- `GET /health` - Verificar saúde do serviço

## Documentação

A documentação da API está disponível em `/api/docs` quando o serviço estiver rodando.

## Docker

Para executar com Docker:

```bash
docker build -t notification-service .
docker run -p 3003:3003 --env-file .env notification-service
```

## Estrutura do Projeto

```
src/
├── application/          # DTOs e interfaces de aplicação
├── domain/              # Entidades e regras de negócio
│   ├── entities/        # Entidades do domínio
│   ├── repositories/    # Interfaces dos repositórios
│   └── usecases/        # Casos de uso
├── infrastructure/      # Implementações de infraestrutura
│   ├── database/        # Configuração do banco
│   ├── email/           # Serviço de email
│   └── repositories/    # Implementações dos repositórios
└── modules/             # Módulos da aplicação
    ├── notification/    # Módulo de notificações
    └── health/          # Módulo de health check
```
