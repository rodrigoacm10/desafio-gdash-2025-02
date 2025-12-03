import os
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
OW_LAT = os.getenv("WEATHER_LAT")
OW_LON = os.getenv("WEATHER_LON")
RABBITMQ_URL = os.getenv("RABBITMQ_URL")
RABBITMQ_QUEUE = os.getenv("RABBITMQ_QUEUE", "weather_snapshots")

LOCATION_CITY = os.getenv("LOCATION_CITY", "Recife")
LOCATION_STATE = os.getenv("LOCATION_STATE", "Pernambuco")
LOCATION_COUNTRY = os.getenv("LOCATION_COUNTRY", "BR")
LOCATION_TIMEZONE = os.getenv("LOCATION_TIMEZONE", "America/Recife")
LOCATION_TZ_OFFSET = int(os.getenv("LOCATION_TZ_OFFSET", "-10800"))

WEATHER_API_BASE_URL = os.getenv("WEATHER_API_BASE_URL")
