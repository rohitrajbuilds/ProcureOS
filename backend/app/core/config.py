from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ProcureOS"
    api_prefix: str = "/api"
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    database_url: str = "sqlite:///./procureos.db"
    openai_api_key: str | None = None
    frontend_url: str = "http://localhost:3000"
    cors_origins: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    def allowed_origins(self) -> list[str]:
        defaults = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]

        configured = [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]
        frontend_origin = self.frontend_url.strip() if self.frontend_url else ""

        origins = defaults + configured
        if frontend_origin:
            origins.append(frontend_origin)

        # Preserve order while removing duplicates.
        return list(dict.fromkeys(origins))


@lru_cache
def get_settings() -> Settings:
    return Settings()
