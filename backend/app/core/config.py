from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent  # → backend/
ENV_FILE = BASE_DIR / ".env.example"


class Settings(BaseSettings):

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── App ───────────────────────────────────────────────────────────────────
    APP_NAME: str = "Tamil Nadu Grievance Portal"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # ── Database ──────────────────────────────────────────────────────────────
    DATABASE_URL: str
    DATABASE_SCHEMA: str = "Grievance"

    # ── JWT ───────────────────────────────────────────────────────────────────
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # ── CORS ──────────────────────────────────────────────────────────────────
    # Production origins come from .env / environment variable.
    # Dev origins (localhost) are always appended automatically in origins_list
    # so you never need to touch .env during local development.
    ALLOWED_ORIGINS: str = "https://grievance.risingsuntech.in"

    # Always-allowed dev origins — merged in at runtime, never in production DB
    _DEV_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    # ── Derived ───────────────────────────────────────────────────────────────
    @property
    def origins_list(self) -> List[str]:
        """
        Returns deduplicated list of allowed origins.
        Always includes localhost dev origins so Vite (port 5173) works
        without any .env changes during development.
        """
        from_env = [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]
        # Merge and deduplicate, preserving order (env origins first)
        seen = set()
        result = []
        for origin in from_env + self._DEV_ORIGINS:
            if origin not in seen:
                seen.add(origin)
                result.append(origin)
        return result

    # ── Validators ────────────────────────────────────────────────────────────
    @field_validator("SECRET_KEY")
    @classmethod
    def secret_key_min_length(cls, v: str) -> str:
        if len(v) < 32:
            raise ValueError(
                "SECRET_KEY must be at least 32 characters. "
                "Run: openssl rand -hex 32"
            )
        return v

    @field_validator("ACCESS_TOKEN_EXPIRE_MINUTES")
    @classmethod
    def expire_must_be_positive(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("ACCESS_TOKEN_EXPIRE_MINUTES must be > 0")
        return v


# ─── Cached singleton ─────────────────────────────────────────────────────────

@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()