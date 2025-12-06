FROM golang:1.22

WORKDIR /app

# Copia os arquivos de dependência primeiro
COPY go.mod go.sum ./
RUN go mod download

# Copia o restante do código
COPY . .

# O mesmo comando que você roda localmente
CMD ["go", "run", "."]
