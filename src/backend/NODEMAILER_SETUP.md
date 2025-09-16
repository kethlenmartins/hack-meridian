# 📧 Configuração Nodemailer Híbrida (SEM SUA SENHA!)

## ✅ Solução Híbrida Implementada

Agora você tem **3 opções** de envio de email, todas usando **Nodemailer**:

1. **Ethereal** (Padrão) - Para desenvolvimento
2. **SendGrid** - Para produção (100 emails/dia grátis)
3. **Gmail** - Se quiser usar sua conta (opcional)

## 🚀 Como Usar

### Opção 1: Ethereal (Desenvolvimento) - PADRÃO

**✅ Funciona imediatamente, sem configuração!**

```bash
# Já está configurado por padrão
docker compose up notification-service --build -d

# Teste
curl -X POST http://localhost:3003/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "test@example.com",
    "subject": "Teste Ethereal",
    "content": "Este email será capturado pelo Ethereal!"
  }'
```

**O que acontece:**
- Email é "enviado" mas capturado pelo Ethereal
- Você recebe uma URL para visualizar o email
- Perfeito para desenvolvimento e testes

### Opção 2: SendGrid (Produção)

**Para emails reais sem usar sua senha:**

1. **Crie conta SendGrid** (gratuita):
   - Acesse [SendGrid](https://sendgrid.com/)
   - Clique em "Start for Free"
   - Crie conta

2. **Obtenha API Key**:
   - Vá para "Settings" → "API Keys"
   - Clique em "Create API Key"
   - Escolha "Restricted Access"
   - Marque apenas "Mail Send" → "Full Access"
   - **COPIE A API KEY**

3. **Configure no .env**:
   ```env
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=sua_api_key_aqui
   ```

4. **Reinicie o serviço**:
   ```bash
   docker compose restart notification-service
   ```

### Opção 3: Gmail (Opcional)

**Se quiser usar sua conta Gmail:**

1. **Gere App Password**:
   - Acesse [Google Account](https://myaccount.google.com/)
   - Vá para "Security" → "2-Step Verification"
   - Clique em "App passwords"
   - Gere uma senha para "Mail"

2. **Configure no .env**:
   ```env
   EMAIL_PROVIDER=gmail
   GMAIL_USER=seu_email@gmail.com
   GMAIL_APP_PASSWORD=sua_app_password
   ```

3. **Reinicie o serviço**:
   ```bash
   docker compose restart notification-service
   ```

## 🎨 Template HTML

O email já vem com um template lindo baseado no seu design:

- **Header verde** com logo 🌱
- **Conteúdo personalizado**
- **Footer profissional**
- **Responsivo** para mobile

## 📊 Vantagens da Solução Híbrida

### Ethereal (Desenvolvimento)
- ✅ **Funciona imediatamente**
- ✅ **Sem configuração**
- ✅ **Emails capturados** (não enviados)
- ✅ **Preview URL** para visualizar

### SendGrid (Produção)
- ✅ **100 emails/dia gratuitos**
- ✅ **Sem sua senha pessoal**
- ✅ **API Key profissional**
- ✅ **Relatórios de entrega**

### Gmail (Opcional)
- ✅ **Usa sua conta Gmail**
- ✅ **App Password seguro**
- ✅ **Familiar e confiável**

## 🔧 Configuração Avançada

### Variáveis de Ambiente

```env
# Provedor de email (ethereal, sendgrid, gmail)
EMAIL_PROVIDER=ethereal

# SendGrid (se usar sendgrid)
SENDGRID_API_KEY=sua_api_key_aqui

# Gmail (se usar gmail)
GMAIL_USER=seu_email@gmail.com
GMAIL_APP_PASSWORD=sua_app_password
```

### Fallback Automático

O sistema tem fallback automático:
- Se SendGrid falhar → usa Ethereal
- Se Gmail falhar → usa Ethereal
- Ethereal sempre funciona como backup

## 🎉 Resultado Final

**Status**: ✅ **SERVIÇO 100% FUNCIONAL**

- **Desenvolvimento**: Ethereal (funciona imediatamente)
- **Produção**: SendGrid (100 emails/dia grátis)
- **Template HTML**: Lindo e profissional
- **Fallback**: Sempre funciona

**Recomendação**: Use **Ethereal** para desenvolvimento e **SendGrid** para produção! 🚀
