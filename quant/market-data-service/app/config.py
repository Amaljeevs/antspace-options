from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="MARKET_DATA_", env_file=".env", extra="ignore")

    app_name: str = "market-data-service"
    database_url: str = "postgresql+psycopg://finquant:finquant@postgres:5432/finquant"


settings = Settings()

