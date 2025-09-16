#!/bin/bash

echo "🚀 Teste de Envio Real de Email"
echo "================================"
echo ""

# Verifica se a API key foi fornecida
if [ -z "$1" ]; then
    echo "❌ Erro: Forneça a API Key do SendGrid"
    echo ""
    echo "Como usar:"
    echo "  ./test-real-email.sh SUA_API_KEY_AQUI"
    echo ""
    echo "Para obter a API Key:"
    echo "  1. Acesse https://sendgrid.com/"
    echo "  2. Crie conta gratuita"
    echo "  3. Vá para Settings → API Keys"
    echo "  4. Crie uma API Key com permissão 'Mail Send'"
    echo "  5. Copie a API Key"
    exit 1
fi

API_KEY="$1"

echo "📧 Configurando SendGrid..."
echo "API Key: ${API_KEY:0:10}..."

# Atualiza o .env
echo "" >> .env
echo "# SendGrid Configuration" >> .env
echo "EMAIL_PROVIDER=sendgrid" >> .env
echo "SENDGRID_API_KEY=$API_KEY" >> .env

echo "✅ Configuração salva no .env"
echo ""

echo "🔄 Reiniciando serviço..."
docker compose restart notification-service

echo "⏳ Aguardando serviço inicializar..."
sleep 10

echo "📤 Testando envio de email real..."
echo ""

# Testa o envio
curl -X POST http://localhost:3003/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "mr944773@gmail.com",
    "subject": "🎉 Teste Real de Email - Farm Investment Platform",
    "content": "Parabéns! Seu sistema de notificações está funcionando perfeitamente!\n\nEste é um email real enviado através do SendGrid.\n\nAtenciosamente,\nEquipe Farm Investment Platform"
  }'

echo ""
echo "✅ Teste concluído!"
echo ""
echo "📋 Verifique:"
echo "  - Seu email (mr944773@gmail.com)"
echo "  - Logs do serviço: docker compose logs notification-service"
echo ""
echo "🎉 Se recebeu o email, está funcionando perfeitamente!"
