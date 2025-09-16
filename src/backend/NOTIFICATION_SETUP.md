# 📧 Configuração do Notification Service

Este guia explica como configurar o serviço de notificações para envio de emails.

## 🔧 Configuração Inicial

### 1. Configurar SMTP

O notification-service precisa de credenciais SMTP para enviar emails. Configure as seguintes variáveis no arquivo `.env`:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@farminvestment.com
```

### 2. Configurar Gmail (Recomendado)

Para usar Gmail como provedor SMTP:

1. **Ative a verificação em 2 etapas** na sua conta Google
2. **Gere uma senha de app**:
   - Vá para [Conta Google](https://myaccount.google.com/)
   - Segurança → Verificação em duas etapas → Senhas de app
   - Gere uma senha para "Mail"
   - Use essa senha no campo `SMTP_PASS`

### 3. Outros Provedores SMTP

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your_mailgun_username
SMTP_PASS=your_mailgun_password
```

#### Amazon SES
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your_ses_username
SMTP_PASS=your_ses_password
```

## 🗄️ Configuração do Banco de Dados

### 1. Executar Script SQL

Execute o script SQL no Supabase para criar a tabela de notificações:

```sql
-- Execute o conteúdo do arquivo supabase-notifications-schema.sql
-- no SQL Editor do Supabase Dashboard
```

### 2. Verificar Tabela

A tabela `notifications` deve ter a seguinte estrutura:

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'email',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);
```

## 🚀 Testando o Serviço

### 1. Health Check

```bash
curl http://localhost:3003/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": "ok",
    "email": "ok"
  }
}
```

### 2. Enviar Notificação de Teste

```bash
curl -X POST http://localhost:3003/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "test@example.com",
    "subject": "Teste de Notificação",
    "content": "Esta é uma notificação de teste do sistema."
  }'
```

### 3. Listar Notificações

```bash
curl http://localhost:3003/notifications
```

## 📧 Funcionalidades

### Envio de Emails Simples

```typescript
const notification = await notificationService.sendNotification({
  recipientEmail: 'user@example.com',
  subject: 'Bem-vindo!',
  content: 'Obrigado por se cadastrar em nossa plataforma.'
});
```

### Envio com Template (Futuro)

```typescript
const notification = await notificationService.sendNotification({
  recipientEmail: 'user@example.com',
  subject: 'Relatório Mensal',
  content: 'Seu relatório está pronto.',
  template: 'monthly-report',
  templateData: {
    userName: 'João Silva',
    reportUrl: 'https://example.com/report'
  }
});
```

## 🔍 Monitoramento

### Logs do Serviço

```bash
# Ver logs em tempo real
docker compose logs -f notification-service

# Ver logs específicos
docker compose logs notification-service | grep ERROR
```

### Status das Notificações

- **pending**: Aguardando envio
- **sent**: Enviada com sucesso
- **failed**: Falha no envio (verificar `error_message`)

## 🛠️ Troubleshooting

### Problemas Comuns

1. **Erro de autenticação SMTP**
   - Verifique as credenciais no arquivo `.env`
   - Para Gmail, use senha de app, não a senha da conta

2. **Erro de conexão com banco**
   - Verifique `SUPABASE_URL` e `SUPABASE_ANON_KEY`
   - Execute o script SQL no Supabase

3. **Emails não sendo enviados**
   - Verifique os logs do serviço
   - Teste a conectividade SMTP
   - Verifique se o email de destino é válido

### Logs de Debug

```bash
# Habilitar logs detalhados
docker compose logs notification-service | grep -E "(ERROR|WARN|INFO)"
```

## 📚 Documentação da API

Acesse a documentação completa em: http://localhost:3003/api/docs

### Endpoints Disponíveis

- `POST /notifications` - Enviar notificação
- `GET /notifications` - Listar notificações
- `GET /health` - Health check

### Exemplo de Uso com cURL

```bash
# Enviar notificação
curl -X POST http://localhost:3003/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "farmer@example.com",
    "subject": "Nova Oportunidade de Investimento",
    "content": "Uma nova fazenda está disponível para investimento em sua região."
  }'

# Listar notificações por email
curl "http://localhost:3003/notifications?recipientEmail=farmer@example.com"

# Listar notificações por status
curl "http://localhost:3003/notifications?status=failed"
```
