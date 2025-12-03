from datetime import datetime, timezone

def unix_to_iso(dt_unix: int) -> str:
    return datetime.fromtimestamp(dt_unix, tz=timezone.utc).isoformat()
