package main

import "log"
import "os"

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
