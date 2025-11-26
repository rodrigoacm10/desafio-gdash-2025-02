package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"
	"github.com/joho/godotenv"

	amqp "github.com/rabbitmq/amqp091-go"
)


type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	AccessToken string `json:"accessToken"`
	User        struct {
		ID    string `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
		Role  string `json:"role"`
	} `json:"user"`
}


type AuthClient struct {
	apiURL     string
	email      string
	password   string
	httpClient *http.Client

	mu    sync.Mutex
	token string
}

func NewAuthClient(apiURL, email, password string) *AuthClient {
	return &AuthClient{
		apiURL:   apiURL,
		email:    email,
		password: password,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (a *AuthClient) ensureToken(ctx context.Context) error {
	a.mu.Lock()
	defer a.mu.Unlock()

	if a.token != "" {
		return nil
	}

	log.Println("[WORKER] Nenhum token carregado. Fazendo login na API...")
	return a.login(ctx)
}

func (a *AuthClient) login(ctx context.Context) error {
	body, err := json.Marshal(LoginRequest{
		Email:    a.email,
		Password: a.password,
	})
	if err != nil {
		return fmt.Errorf("erro ao serializar login request: %w", err)
	}

	url := fmt.Sprintf("%s/auth/login", a.apiURL)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("erro ao criar request de login: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := a.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("erro ao chamar /auth/login: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return fmt.Errorf("/auth/login retornou status %d", resp.StatusCode)
	}

	var loginResp LoginResponse
	if err := json.NewDecoder(resp.Body).Decode(&loginResp); err != nil {
		return fmt.Errorf("erro ao decodificar resposta de login: %w", err)
	}

	if loginResp.AccessToken == "" {
		return fmt.Errorf("resposta de login não contém accessToken")
	}

	a.token = loginResp.AccessToken
	log.Println("[WORKER] Login realizado com sucesso. Token carregado.")
	return nil
}

func (a *AuthClient) postWithAuth(ctx context.Context, path string, body []byte) (*http.Response, error) {
	if err := a.ensureToken(ctx); err != nil {
		return nil, err
	}

	// 1ª tentativa
	resp, err := a.doPost(ctx, path, body)
	if err == nil && resp.StatusCode != http.StatusUnauthorized {
		return resp, nil
	}
	if err == nil && resp.StatusCode == http.StatusUnauthorized {
		log.Println("[WORKER] Token expirado ou inválido. Tentando relogar...")
		resp.Body.Close()
	}

	if err := a.login(ctx); err != nil {
		return nil, fmt.Errorf("falha ao relogar: %w", err)
	}

	return a.doPost(ctx, path, body)
}

func (a *AuthClient) doPost(ctx context.Context, path string, body []byte) (*http.Response, error) {
	a.mu.Lock()
	token := a.token
	a.mu.Unlock()

	url := fmt.Sprintf("%s%s", a.apiURL, path)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("erro ao criar request POST %s: %w", url, err)
	}

	req.Header.Set("Content-Type", "application/json")
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}

	resp, err := a.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("erro ao chamar %s: %w", url, err)
	}

	return resp, nil
}


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

	_, err = ch.QueueDeclare(
		queueName,
		true,  // durable
		false, // autoDelete
		false, // exclusive
		false, // noWait
		nil,   // args
	)
	if err != nil {
		log.Fatalf("Erro ao declarar queue %s: %v", queueName, err)
	}

	msgs, err := ch.Consume(
		queueName,
		"weather_worker", // consumer tag
		false,            // autoAck
		false,            // exclusive
		false,            // noLocal
		false,            // noWait
		nil,              // args
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

func handleMessage(authClient *AuthClient, d *amqp.Delivery) error {
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	resp, err := authClient.postWithAuth(ctx, "/weather/snapshot", d.Body)
	if err != nil {
		return fmt.Errorf("erro ao enviar snapshot para API: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return fmt.Errorf("API retornou status %d ao salvar snapshot", resp.StatusCode)
	}

	log.Println("[WORKER] Snapshot enviado com sucesso para /weather/snapshot")
	return nil
}

func getEnvOrFatal(key string) string {
	val := os.Getenv(key)
	if val == "" {
		log.Fatalf("Variável de ambiente obrigatória não encontrada: %s", key)
	}
	return val
}

func getEnvOrDefault(key, def string) string {
	val := os.Getenv(key)
	if val == "" {
		return def
	}
	return val
}
