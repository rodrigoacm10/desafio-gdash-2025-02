import time
import traceback
from weather import fetch_openweather_onecall
from snapshot import build_snapshot
from rabbitmq import publish_snapshot
from config import RABBITMQ_URL, RABBITMQ_QUEUE, WEATHER_POLL_INTERVAL_SECONDS

POLL_INTERVAL = int(WEATHER_POLL_INTERVAL_SECONDS) if 'WEATHER_POLL_INTERVAL_SECONDS' in globals() else 3600

def main_loop():
    while True:
        print("\n[PYTHON] ========= NOVO CICLO DE COLETA =========")
        print(f"[PYTHON] RabbitMQ config -> URL={RABBITMQ_URL} | QUEUE={RABBITMQ_QUEUE}")
        try:
            print("[PYTHON] Buscando dados no OpenWeather...")
            raw = fetch_openweather_onecall()
            print("[PYTHON] Raw recebido. Chaves principais:", list(raw.keys()))

            snapshot = build_snapshot(raw)
            print("[PYTHON] Snapshot montado.")
            publish_snapshot(snapshot)
            print("[PYTHON] OK. Snapshot enviado para RabbitMQ com sucesso.")

        except Exception as e:
            print("[PYTHON] ERRO NO LOOP PRINCIPAL:", e)
            traceback.print_exc()

        print(f"[PYTHON] Aguardando {POLL_INTERVAL} segundos para próxima coleta.\n")
        time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    main_loop()
