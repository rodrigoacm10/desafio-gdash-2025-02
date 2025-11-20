# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas arquivos de dependência primeiro (cache melhor)
COPY package*.json ./

RUN npm install

# Copia resto do código
COPY . .

# Gera build do NestJS
RUN npm run build

# Etapa de runtime (imagem menor)
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Só dependências necessárias em produção
COPY package*.json ./
RUN npm install --omit=dev

# Copia build gerado
COPY --from=builder /app/dist ./dist

# (Opcional) expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/main.js"]
