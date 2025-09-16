#!/bin/bash

# Script para iniciar todos os serviços da plataforma Farm Investment
echo "🚀 Iniciando todos os serviços da plataforma Farm Investment..."

# Verifica se o arquivo .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "📋 Copie o arquivo env.example para .env e configure as variáveis:"
    echo "   cp env.example .env"
    echo "   nano .env"
    exit 1
fi

# Verifica se o docker compose está disponível
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado!"
    exit 1
fi

# Verifica se o docker compose está disponível
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose não está disponível!"
    exit 1
fi

echo "🔧 Construindo e iniciando os serviços..."

# Para e remove containers existentes
echo "🧹 Limpando containers existentes..."
docker compose down

# Constrói e inicia todos os serviços
echo "🏗️  Construindo imagens..."
docker compose build

echo "🚀 Iniciando serviços..."
docker compose up -d

# Aguarda um pouco para os serviços iniciarem
echo "⏳ Aguardando serviços iniciarem..."
sleep 10

# Verifica o status dos serviços
echo "📊 Status dos serviços:"
docker compose ps

echo ""
echo "✅ Serviços iniciados com sucesso!"
echo ""
echo "🌐 URLs dos serviços:"
echo "   👨‍🌾 Farmer Service:    http://localhost:3001"
echo "   💰 Investor Service:   http://localhost:3002"
echo "   📧 Notification Service: http://localhost:3003"
echo ""
echo "📚 Documentação das APIs:"
echo "   👨‍🌾 Farmer API:        http://localhost:3001/api/docs"
echo "   💰 Investor API:       http://localhost:3002/api/docs"
echo "   📧 Notification API:   http://localhost:3003/api/docs"
echo ""
echo "🔍 Para ver os logs:"
echo "   docker compose logs -f [service-name]"
echo ""
echo "🛑 Para parar os serviços:"
echo "   docker compose down"
