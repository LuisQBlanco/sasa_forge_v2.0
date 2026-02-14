from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)

    app_name: str = "SASA Forge API"
    env: str = "dev"
    secret_key: str
    access_token_expire_minutes: int = 60
    database_url: str
    cors_origins: str = "http://localhost:3000,http://localhost:19006"

    upload_max_mb: int = 100
    upload_dir: str = "uploads"
    storage_backend: str = "local"

    stripe_secret_key: str
    stripe_webhook_secret: str
    stripe_success_url: str
    stripe_cancel_url: str

    interac_email: str
    interac_instructions: str


settings = Settings()
