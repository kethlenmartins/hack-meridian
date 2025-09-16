# 📧 Configuração do SendGrid (SEM SUA SENHA!)

## ✅ Por que SendGrid?

- **100 emails/dia GRATUITOS** 🎉
- **NÃO precisa da sua senha pessoal** 🔒
- **API Key profissional** 🔑
- **Templates HTML personalizados** 🎨
- **Relatórios de entrega** 📊

## 🚀 Como Configurar (5 minutos)

### 1. Criar Conta SendGrid

1. Acesse [SendGrid](https://sendgrid.com/)
2. Clique em **"Start for Free"**
3. Preencha os dados (pode usar qualquer email)
4. **NÃO precisa verificar o email** para começar

### 2. Obter API Key

1. No painel do SendGrid, vá para **"Settings"** → **"API Keys"**
2. Clique em **"Create API Key"**
3. Escolha **"Restricted Access"**
4. Dê um nome: `Farm Investment Platform`
5. Marque apenas **"Mail Send"** → **"Full Access"**
6. Clique em **"Create & View"**
7. **COPIE A API KEY** (ela só aparece uma vez!)

### 3. Configurar Variáveis

Adicione no arquivo `.env`:

```env
# SendGrid Configuration
SENDGRID_API_KEY=sua_api_key_aqui

# Outras configurações...
SUPABASE_URL=https://wcquqbjrchhcnrspebpf.supabase.co
SUPABASE_ANON_KEY=4a0ddbe01e58abba42d9fc89b51ce40d
JWT_SECRET=seu_jwt_secret_aqui
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003
```

### 4. Testar Configuração

```bash
# Reconstruir o serviço
docker compose up notification-service --build -d

# Testar envio
curl -X POST http://localhost:3003/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "seu-email@exemplo.com",
    "subject": "Teste SendGrid",
    "content": "Esta é uma notificação de teste com SendGrid!"
  }'
```

## 🎨 Template Personalizado

O email já vem com um template lindo baseado no seu design:

- **Header verde** com logo 🌱
- **Conteúdo personalizado** 
- **Footer profissional**
- **Responsivo** para mobile

## 📊 Vantagens do SendGrid

- ✅ **100 emails/dia gratuitos**
- ✅ **Sem senha pessoal**
- ✅ **API profissional**
- ✅ **Templates HTML**
- ✅ **Relatórios de entrega**
- ✅ **Anti-spam automático**

## 🔧 Troubleshooting

### Erro: "API key not configured"
- Verifique se `SENDGRID_API_KEY` está no `.env`
- Reinicie o container: `docker compose restart notification-service`

### Erro: "Unauthorized"
- Verifique se a API key está correta
- Certifique-se que tem permissão "Mail Send"

### Erro: "Forbidden"
- A API key pode estar expirada
- Crie uma nova API key no SendGrid

## 🎉 Resultado Final

Após configurar, você terá:
- **Emails profissionais** enviados automaticamente
- **Template lindo** igual ao seu design
- **100 emails/dia** sem custo
- **Sem usar sua senha pessoal**

**Status**: ✅ **PRONTO PARA USAR - SÓ PRECISA DA API KEY DO SENDGRID**
