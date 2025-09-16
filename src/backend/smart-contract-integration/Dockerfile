# Use Node.js 20 LTS
FROM node:20-alpine

# Instalar dependências do sistema
RUN apk add --no-cache python3 make g++

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY src/ ./src/

# Construir aplicação
RUN npm run build

# Expor porta
EXPOSE 3004

# Comando para iniciar aplicação
CMD ["npm", "run", "start:prod"]
