# 🚀 Configuração Rápida - Notification Service

## ✅ Configuração Gmail

O serviço usa Gmail para envio de emails de forma confiável.

## 🔧 Configuração Necessária

### 1. Configurar Gmail

1. **Ative a verificação em 2 etapas** na sua conta Google
2. **Gere uma senha de app**:
   - Vá para [Conta Google](https://myaccount.google.com/)
   - Segurança → Verificação em duas etapas → Senhas de app
   - Gere uma senha para "Mail"
   - Use essa senha no campo `GMAIL_APP_PASSWORD`

### 2. Configurar Variáveis de Ambiente

Crie o arquivo `.env` na pasta `src/backend/`:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Gmail Configuration
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003
```

### 3. Executar Serviços

```bash
# Opção 1: Script automatizado
./start-all-services.sh

# Opção 2: Comando manual
docker compose up -d
```

### 4. Testar Configuração

```bash
# Teste direto do Gmail
cd notification-service
npm run test:email

# Teste via API
curl -X POST http://localhost:3003/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "seu-email@exemplo.com",
    "subject": "Teste de Notificação",
    "content": "Esta é uma notificação de teste."
  }'
```

## 📧 Template de Exemplo

Use este template no EmailJS:

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

## 🔍 Verificar Status

- **Health Check**: http://localhost:3003/health
- **API Docs**: http://localhost:3003/api/docs
- **Logs**: `docker compose logs -f notification-service`

## ✅ Próximos Passos

1. Configure o Supabase (execute o script SQL)
2. Configure o arquivo `.env` (apenas Supabase e JWT)
3. Execute `./start-all-services.sh`
4. Teste o envio de emails

Configure apenas as credenciais do Gmail! 🎉
