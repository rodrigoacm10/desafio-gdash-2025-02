FROM python:3.12-slim

WORKDIR /app

# Instala dependências do sistema se precisar (ex: ca-certificates, tzdata)
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

# Copia requirements primeiro para aproveitar cache
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código
COPY . .

# Por padrão, vai rodar exatamente o que você faz localmente
CMD ["python", "main.py"]
