#!/bin/bash

# Hack Meridian Backend Setup Script
echo "🚀 Setting up Hack Meridian Backend Services..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your Supabase credentials before running docker-compose"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p auth-service/src
mkdir -p file-service/src

# Install dependencies for both services
echo "📦 Installing dependencies for auth-service..."
cd auth-service
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

echo "📦 Installing dependencies for file-service..."
cd file-service
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

echo "✅ Setup completed!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your Supabase credentials"
echo "2. Run 'docker-compose up -d' to start all services"
echo "3. Execute the SQL schema in your Supabase project"
echo "4. Configure storage bucket and policies in Supabase Dashboard"
echo ""
echo "Services will be available at:"
echo "- Auth Service: http://localhost:3001"
echo "- File Service: http://localhost:3002"
echo "- API Docs: http://localhost:3001/api/docs and http://localhost:3002/api/docs"
