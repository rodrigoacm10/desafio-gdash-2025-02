import json
import os
import time
from datetime import datetime, timezone

import pika
import requests
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
OW_LAT = os.getenv("WEATHER_LAT")
OW_LON = os.getenv("WEATHER_LON")
RABBITMQ_URL = os.getenv("RABBITMQ_URL")
RABBITMQ_QUEUE = os.getenv("RABBITMQ_QUEUE", "weather_snapshots")

LOCATION_CITY = os.getenv("LOCATION_CITY", "Recife")
LOCATION_COUNTRY = os.getenv("LOCATION_COUNTRY", "BR")
LOCATION_TIMEZONE = os.getenv("LOCATION_TIMEZONE", "America/Recife")
LOCATION_TZ_OFFSET = int(os.getenv("LOCATION_TZ_OFFSET", "-10800"))


def fetch_openweather_onecall():
    url = "https://api.openweathermap.org/data/2.5/onecall"
    params = {
        "lat": OW_LAT,
        "lon": OW_LON,
        "units": "metric",
        "appid": OPENWEATHER_API_KEY,
    }
    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()
    return resp.json()


def unix_to_iso(dt_unix: int) -> str:
    return datetime.fromtimestamp(dt_unix, tz=timezone.utc).isoformat()


def build_current(raw: dict) -> dict:
    current = raw["current"]
    weather = current.get("weather", [{}])[0] or {}

    rain_last_hour = 0
    if "rain" in current:
        rain_last_hour = current["rain"].get("1h", 0)

    return {
        "timestamp": unix_to_iso(current["dt"]),
        "temperature": current["temp"],
        "feelsLike": current["feels_like"],
        "humidity": current["humidity"],
        "pressure": current["pressure"],
        "dewPoint": current.get("dew_point"),
        "uvi": current.get("uvi"),
        "clouds": current.get("clouds"),
        "visibility": current.get("visibility"),
        "windSpeed": current.get("wind_speed"),
        "windDeg": current.get("wind_deg"),
        "rainLastHour": rain_last_hour,
        "rainProbability": 0,  
        "condition": {
            "id": weather.get("id"),
            "main": weather.get("main"),
            "description": weather.get("description"),
            "icon": weather.get("icon"),
        },
        "metadata": {
            "sourceDt": current["dt"],
            "sunrise": current.get("sunrise"),
            "sunset": current.get("sunset"),
        },
    }


def build_hourly(raw: dict, limit: int = 24) -> list:
    result = []
    for item in raw.get("hourly", [])[:limit]:
        weather = (item.get("weather") or [{}])[0] or {}
        rain_last_hour = 0
        if "rain" in item:
            rain_last_hour = item["rain"].get("1h", 0)

        result.append(
            {
                "timestamp": unix_to_iso(item["dt"]),
                "temperature": item["temp"],
                "feelsLike": item["feels_like"],
                "humidity": item["humidity"],
                "pressure": item["pressure"],
                "dewPoint": item.get("dew_point"),
                "uvi": item.get("uvi"),
                "clouds": item.get("clouds"),
                "visibility": item.get("visibility"),
                "windSpeed": item.get("wind_speed"),
                "windDeg": item.get("wind_deg"),
                "rainLastHour": rain_last_hour,
                "rainProbability": item.get("pop", 0),
                "condition": {
                    "id": weather.get("id"),
                    "main": weather.get("main"),
                    "description": weather.get("description"),
                    "icon": weather.get("icon"),
                },
                "metadata": {"sourceDt": item["dt"]},
            }
        )
    return result


def build_daily(raw: dict, limit: int = 7) -> list:
    result = []
    for item in raw.get("daily", [])[:limit]:
        weather = (item.get("weather") or [{}])[0] or {}
        temp = item.get("temp") or {}
        feels_like = item.get("feels_like") or {}

        result.append(
            {
                "date": unix_to_iso(item["dt"])[:10],   
                "tempMin": temp.get("min"),
                "tempMax": temp.get("max"),
                "tempDay": temp.get("day"),
                "tempNight": temp.get("night"),
                "humidity": item.get("humidity"),
                "pressure": item.get("pressure"),
                "dewPoint": item.get("dew_point"),
                "windSpeed": item.get("wind_speed"),
                "windDeg": item.get("wind_deg"),
                "uvi": item.get("uvi"),
                "clouds": item.get("clouds"),
                "rainProbability": item.get("pop", 0),
                "rainAmount": item.get("rain", 0),
                "condition": {
                    "id": weather.get("id"),
                    "main": weather.get("main"),
                    "description": weather.get("description"),
                    "icon": weather.get("icon"),
                },
                "metadata": {
                    "sourceDt": item["dt"],
                    "sunrise": item.get("sunrise"),
                    "sunset": item.get("sunset"),
                },
            }
        )
    return result


def build_snapshot(raw: dict) -> dict:
    fetched_at = datetime.now(timezone.utc).isoformat()

    snapshot = {
        "provider": "openweather",
        "type": "snapshot",
        "location": {
            "city": LOCATION_CITY,
            "country": LOCATION_COUNTRY,
            "lat": raw["lat"],
            "lon": raw["lon"],
            "timezone": raw.get("timezone", LOCATION_TIMEZONE),
            "timezoneOffset": raw.get("timezone_offset", LOCATION_TZ_OFFSET),
        },
        "fetchedAt": fetched_at,
        "current": build_current(raw),
        "hourly": build_hourly(raw),
        "daily": build_daily(raw),
    }

    return snapshot


def publish_snapshot(snapshot: dict):
    params = pika.URLParameters(RABBITMQ_URL)
    connection = pika.BlockingConnection(params)
    channel = connection.channel()
    channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)

    body = json.dumps(snapshot).encode("utf-8")

    channel.basic_publish(
        exchange="",
        routing_key=RABBITMQ_QUEUE,
        body=body,
        properties=pika.BasicProperties(
            content_type="application/json",
            delivery_mode=2,   
        ),
    )
    print("[PYTHON] Snapshot publicado na fila.")
    connection.close()


def main_loop():
    while True:
        try:
            print("[PYTHON] Buscando dados no OpenWeather...")
            raw = fetch_openweather_onecall()
            print("[RAW] ->", raw)
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
