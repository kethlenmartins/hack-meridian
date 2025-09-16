# 📧 Configuração do Notification Service

Este guia explica como configurar o serviço de notificações para envio de emails usando EmailJS.

## 🔧 Configuração Inicial

### 1. Configurar EmailJS

O notification-service usa EmailJS para envio simplificado de emails. Configure as seguintes variáveis no arquivo `.env`:

```env
# EmailJS Configuration
EMAILJS_PUBLIC_KEY=COfady7bphtUFGdT5
EMAILJS_SERVICE_ID=service_1p4rzqo
EMAILJS_TEMPLATE_ID=template_eqx6y92
```

### 2. Configurar Conta EmailJS

1. **Crie uma conta no EmailJS**:
   - Acesse [EmailJS](https://www.emailjs.com/)
   - Registre-se para obter uma conta gratuita

2. **Configure um serviço de email**:
   - No painel do EmailJS, vá para "Email Services"
   - Clique em "Add New Service"
   - Selecione seu provedor de email (Gmail, Outlook, etc.)
   - Siga as instruções para conectar sua conta

3. **Crie um template de email**:
   - Vá para "Email Templates"
   - Clique em "Create New Template"
   - Configure o template com placeholders:
     - `{{to_name}}` - Nome do destinatário
     - `{{from_name}}` - Nome do remetente
     - `{{subject}}` - Assunto do email
     - `{{message}}` - Conteúdo da mensagem

4. **Obtenha as credenciais**:
   - **Public Key**: Encontre em "Account" → "General"
   - **Service ID**: Encontre em "Email Services"
   - **Template ID**: Encontre em "Email Templates"

### 3. Exemplo de Template

```html
<!DOCTYPE html>
<html>
<head>
    <title>{{subject}}</title>
</head>
<body>
    <h2>Olá {{to_name}}!</h2>
    <p>{{message}}</p>
    <p>Atenciosamente,<br>{{from_name}}</p>
</body>
</html>
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

### 2. Testar Configuração EmailJS

```bash
# Teste direto do EmailJS (sem iniciar o serviço)
cd notification-service
npm run test:email

# Ou teste via API (com serviço rodando)
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

1. **Erro de configuração EmailJS**
   - Verifique se `EMAILJS_PUBLIC_KEY`, `EMAILJS_SERVICE_ID` e `EMAILJS_TEMPLATE_ID` estão configurados
   - Confirme se as credenciais estão corretas no painel do EmailJS

2. **Erro de conexão com banco**
   - Verifique `SUPABASE_URL` e `SUPABASE_ANON_KEY`
   - Execute o script SQL no Supabase

3. **Emails não sendo enviados**
   - Verifique os logs do serviço
   - Confirme se o template está configurado corretamente no EmailJS
   - Verifique se o serviço de email está ativo no EmailJS
   - Verifique se o email de destino é válido

4. **Erro de template**
   - Verifique se os placeholders no template correspondem aos enviados
   - Confirme se o template está publicado no EmailJS

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
