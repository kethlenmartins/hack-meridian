# 📧 Configuração Rápida do EmailJS

## ✅ Status Atual

O notification-service está funcionando perfeitamente! Só precisa das credenciais do EmailJS.

## 🚀 Como Configurar EmailJS

### 1. Criar Conta no EmailJS

1. Acesse [EmailJS](https://www.emailjs.com/)
2. Clique em "Sign Up" e crie uma conta gratuita
3. Confirme seu email

### 2. Configurar Serviço de Email

1. No painel do EmailJS, vá para **"Email Services"**
2. Clique em **"Add New Service"**
3. Escolha seu provedor (Gmail, Outlook, etc.)
4. Siga as instruções para conectar
5. **Anote o Service ID** (ex: `service_1p4rzqo`)

### 3. Criar Template de Email

1. Vá para **"Email Templates"**
2. Clique em **"Create New Template"**
3. Configure o template com estes placeholders:

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

4. **Anote o Template ID** (ex: `template_eqx6y92`)

### 4. Obter Public Key

1. Vá para **"Account"** → **"General"**
2. **Anote a Public Key** (ex: `COfady7bphtUFGdT5`)

### 5. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `src/backend/`:

```env
# EmailJS Configuration
EMAILJS_PUBLIC_KEY=sua_public_key_aqui
EMAILJS_SERVICE_ID=service_1p4rzqo
EMAILJS_TEMPLATE_ID=seu_template_id_aqui

# Outras configurações...
SUPABASE_URL=https://wcquqbjrchhcnrspebpf.supabase.co
SUPABASE_ANON_KEY=sua_chave_supabase_aqui
JWT_SECRET=seu_jwt_secret_aqui
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003
```

### 6. Testar Configuração

```bash
# Teste direto
cd notification-service
EMAILJS_PUBLIC_KEY=sua_key EMAILJS_SERVICE_ID=service_1p4rzqo EMAILJS_TEMPLATE_ID=seu_template npm run test:email

# Teste via API
curl -X POST http://localhost:3003/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "seu-email@exemplo.com",
    "subject": "Teste de Notificação",
    "content": "Esta é uma notificação de teste!"
  }'
```

## ✅ Vantagens do EmailJS

- ✅ **Não usa seu email pessoal**
- ✅ **Interface visual para templates**
- ✅ **200 emails/mês gratuitos**
- ✅ **Fácil de configurar**
- ✅ **Templates personalizáveis**

## 🎉 Resultado

Após configurar, o serviço enviará emails reais sem usar suas credenciais pessoais!

**Status**: ✅ **SERVIÇO FUNCIONANDO - SÓ PRECISA DAS CREDENCIAIS**
