#!/bin/bash

echo "📧 Teste de Envio Real com Gmail"
echo "================================"
echo ""

# Verifica se as credenciais foram fornecidas
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "❌ Erro: Forneça email e App Password do Gmail"
    echo ""
    echo "Como usar:"
    echo "  ./test-gmail-email.sh seu_email@gmail.com sua_app_password"
    echo ""
    echo "Para obter App Password:"
    echo "  1. Acesse https://myaccount.google.com/"
    echo "  2. Vá para Security → 2-Step Verification"
    echo "  3. Clique em App passwords"
    echo "  4. Selecione Mail → Other (Custom name)"
    echo "  5. Digite: Farm Investment Platform"
    echo "  6. Copie a senha gerada (16 caracteres)"
    echo ""
    echo "Exemplo:"
    echo "  ./test-gmail-email.sh matheus@gmail.com abcd efgh ijkl mnop"
    exit 1
fi

GMAIL_USER="$1"
GMAIL_PASS="$2"

echo "📧 Configurando Gmail..."
echo "Email: $GMAIL_USER"
echo "App Password: ${GMAIL_PASS:0:4}..."

# Atualiza o .env
echo "" >> .env
echo "# Gmail Configuration" >> .env
echo "EMAIL_PROVIDER=gmail" >> .env
echo "GMAIL_USER=$GMAIL_USER" >> .env
echo "GMAIL_APP_PASSWORD=$GMAIL_PASS" >> .env

echo "✅ Configuração salva no .env"
echo ""

echo "🔄 Reiniciando serviço..."
docker compose restart notification-service

echo "⏳ Aguardando serviço inicializar..."
sleep 15

echo "📤 Testando envio de email real..."
echo ""

# Testa o envio
curl -X POST http://localhost:3003/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "mr944773@gmail.com",
    "subject": "🎉 Teste Real de Email - Farm Investment Platform",
    "content": "Parabéns! Seu sistema de notificações está funcionando perfeitamente!\n\nEste é um email real enviado através do Gmail.\n\nAtenciosamente,\nEquipe Farm Investment Platform"
  }'

echo ""
echo "✅ Teste concluído!"
echo ""
echo "📋 Verifique:"
echo "  - Seu email (mr944773@gmail.com)"
echo "  - Logs do serviço: docker compose logs notification-service"
echo ""
echo "🎉 Se recebeu o email, está funcionando perfeitamente!"
