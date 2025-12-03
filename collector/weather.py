import requests
from config import OPENWEATHER_API_KEY, WEATHER_API_BASE_URL, OW_LAT, OW_LON

def fetch_openweather_onecall():
    params = {
        "lat": OW_LAT,
        "lon": OW_LON,
        "units": "metric",
        "appid": OPENWEATHER_API_KEY,
    }
    resp = requests.get(WEATHER_API_BASE_URL, params=params, timeout=10)
    resp.raise_for_status()
    return resp.json()
