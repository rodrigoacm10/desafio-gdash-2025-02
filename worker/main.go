package main

import (
	"log"

	"github.com/joho/godotenv"
	amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
    if err := godotenv.Load(); err != nil {
        log.Println("[WORKER] Aviso: não foi possível carregar .env, seguindo com as variáveis de ambiente do sistema.")
    }

    rabbitURL := getEnvOrFatal("RABBITMQ_URL")
    queueName := getEnvOrDefault("RABBITMQ_QUEUE", "weather_snapshots")
    apiURL := getEnvOrFatal("API_URL")
    loginEmail := getEnvOrFatal("API_LOGIN_EMAIL")
    loginPassword := getEnvOrFatal("API_LOGIN_PASSWORD")

    log.Println("[WORKER] Iniciando worker Go...")
    log.Printf("[WORKER] RabbitMQ: %s | Queue: %s\n", rabbitURL, queueName)
    log.Printf("[WORKER] API_URL: %s\n", apiURL)

    conn, err := amqp.Dial(rabbitURL)
    if err != nil {
        log.Fatalf("Erro ao conectar no RabbitMQ: %v", err)
    }
    defer conn.Close()

    ch, err := conn.Channel()
    if err != nil {
        log.Fatalf("Erro ao abrir canal no RabbitMQ: %v", err)
    }
    defer ch.Close()

    _, err = ch.QueueDeclare(queueName, true, false, false, false, nil)
    if err != nil {
        log.Fatalf("Erro ao declarar queue %s: %v", queueName, err)
    }

    msgs, err := ch.Consume(
        queueName,
        "weather_worker",
        false,
        false,
        false,
        false,
        nil,
    )
    if err != nil {
        log.Fatalf("Erro ao registrar consumidor: %v", err)
    }

    authClient := NewAuthClient(apiURL, loginEmail, loginPassword)
    forever := make(chan struct{})

    go func() {
        for d := range msgs {
            log.Println("---------------------------------------------------------")
            log.Printf("[WORKER] Mensagem recebida. Tamanho: %d bytes\n", len(d.Body))

            if err := handleMessage(authClient, &d); err != nil {
                log.Printf("[WORKER] Erro ao processar mensagem: %v\n", err)
                if err := d.Nack(false, true); err != nil {
                    log.Printf("[WORKER] Erro ao dar Nack: %v\n", err)
                }
                continue
            }

            if err := d.Ack(false); err != nil {
                log.Printf("[WORKER] Erro ao dar Ack: %v\n", err)
            } else {
                log.Println("[WORKER] Mensagem processada e ACK enviada.")
            }
        }
    }()

    log.Println("[WORKER] Aguardando mensagens. Para sair, CTRL+C.")
    <-forever
}
