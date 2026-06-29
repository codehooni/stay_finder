import os
from pathlib import Path
from typing import List, Optional

import dj_database_url


def get_bool_env(name: str, default: bool = False) -> bool:
    value = os.environ.get(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def get_csv_env(name: str, default: Optional[List[str]] = None) -> List[str]:
    value = os.environ.get(name)
    if value is None:
        return default or []
    return [item.strip() for item in value.split(",") if item.strip()]


def build_database_config(base_dir: Path) -> dict:
    database_url = os.environ.get("DATABASE_URL")
    if database_url:
        return dj_database_url.parse(database_url, conn_max_age=600)

    return {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": base_dir / "db.sqlite3",
    }
