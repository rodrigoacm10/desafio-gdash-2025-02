package main

import (
    "context"
    "fmt"
    "log"
    "time"

    amqp "github.com/rabbitmq/amqp091-go"
)

func handleMessage(authClient *AuthClient, d *amqp.Delivery) error {
    ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
    defer cancel()

	log.Printf("[WORKER] Enviando snapshot para API. Tamanho: %d bytes", len(d.Body))

    resp, err := authClient.postWithAuth(ctx, "/weather/snapshot", d.Body)
    if err != nil {
        return fmt.Errorf("erro ao enviar snapshot para API: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != 201 && resp.StatusCode != 200 {
        return fmt.Errorf("API retornou status %d ao salvar snapshot", resp.StatusCode)
    }

    log.Println("[WORKER] Snapshot enviado com sucesso para /weather/snapshot")
    return nil
}
