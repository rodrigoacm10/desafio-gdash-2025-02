import time
from weather import fetch_openweather_onecall
from snapshot import build_snapshot
from rabbitmq import publish_snapshot
from config import *

def main_loop():
    while True:
        try:
            print("[PYTHON] Buscando dados no OpenWeather...")
            raw = fetch_openweather_onecall()
            snapshot = build_snapshot(raw)
            print("[SNAPSHOT] ->", snapshot)
            publish_snapshot(snapshot)
            print("[PYTHON] OK. Aguardando 1h para próxima coleta.")
        except Exception as e:
            print("[PYTHON] ERRO:", e)

        # 1 hora
        time.sleep(3600)

if __name__ == "__main__":
    main_loop()
