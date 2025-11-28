package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/cookiejar"
	"sync"
	"time"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct {
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

	mu          sync.Mutex
	accessToken string
}

func NewAuthClient(apiURL, email, password string) *AuthClient {
	jar, err := cookiejar.New(nil)
	if err != nil {
		log.Fatalf("[WORKER] Erro ao criar cookie jar: %v", err)
	}

	return &AuthClient{
		apiURL:   apiURL,
		email:    email,
		password: password,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
			Jar:     jar, // guarda o cookie HttpOnly do refresh token
		},
	}
}

// Corrigido: não segura o mutex enquanto chama login (evita deadlock)
func (a *AuthClient) ensureToken(ctx context.Context) error {
	// Lê o token com lock curto
	a.mu.Lock()
	hasToken := a.accessToken != ""
	a.mu.Unlock()

	if hasToken {
		return nil
	}

	log.Println("[WORKER] Nenhum access token carregado. Fazendo login na API...")
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

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("/auth/login retornou status %d", resp.StatusCode)
	}

	var authResp AuthResponse
	if err := json.NewDecoder(resp.Body).Decode(&authResp); err != nil {
		return fmt.Errorf("erro ao decodificar resposta de login: %w", err)
	}

	if authResp.AccessToken == "" {
		return fmt.Errorf("resposta de login não contém accessToken")
	}

	a.mu.Lock()
	a.accessToken = authResp.AccessToken
	a.mu.Unlock()

	log.Println("[WORKER] Login realizado com sucesso. Access token carregado.")
	return nil
}

// Usa o refresh token (no cookie) para obter novo access token
func (a *AuthClient) refresh(ctx context.Context) error {
	url := fmt.Sprintf("%s/auth/refresh", a.apiURL)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, nil)
	if err != nil {
		return fmt.Errorf("erro ao criar request de refresh: %w", err)
	}
	// não precisa de body; cookie com refresh token vai automático via CookieJar

	resp, err := a.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("erro ao chamar /auth/refresh: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("/auth/refresh retornou status %d", resp.StatusCode)
	}

	var authResp AuthResponse
	if err := json.NewDecoder(resp.Body).Decode(&authResp); err != nil {
		return fmt.Errorf("erro ao decodificar resposta de refresh: %w", err)
	}

	if authResp.AccessToken == "" {
		return fmt.Errorf("resposta de refresh não contém accessToken")
	}

	a.mu.Lock()
	a.accessToken = authResp.AccessToken
	a.mu.Unlock()

	log.Println("[WORKER] Refresh realizado com sucesso. Novo access token carregado.")
	return nil
}

func (a *AuthClient) postWithAuth(ctx context.Context, path string, body []byte) (*http.Response, error) {
	// Garante que temos um access token inicial
	if err := a.ensureToken(ctx); err != nil {
		return nil, err
	}

	// 1ª tentativa com access token atual
	resp, err := a.doPost(ctx, path, body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusUnauthorized {
		return resp, nil
	}

	// 401: token expirado/inválido → tenta refresh primeiro
	log.Println("[WORKER] Recebido 401. Tentando renovar access token via /auth/refresh...")
	resp.Body.Close()

	if err := a.refresh(ctx); err != nil {
		log.Printf("[WORKER] Erro ao fazer refresh: %v. Tentando relogar...", err)

		// se o refresh falhar, tenta login completo de novo
		if err := a.login(ctx); err != nil {
			return nil, fmt.Errorf("falha ao relogar após erro no refresh: %w", err)
		}
	}

	// Tenta novamente após refresh ou relogin
	return a.doPost(ctx, path, body)
}

func (a *AuthClient) doPost(ctx context.Context, path string, body []byte) (*http.Response, error) {
	a.mu.Lock()
	token := a.accessToken
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
