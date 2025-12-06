FROM node:22-alpine

WORKDIR /app

# Copia arquivos de dependência primeiro
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia o resto do código
COPY . .

# Porta do Vite dev server
EXPOSE 5173

# Sobe o Vite dev server acessível de fora do container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
