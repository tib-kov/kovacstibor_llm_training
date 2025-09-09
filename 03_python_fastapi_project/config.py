from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Product API"
    database_url: str = "sqlite+aiosqlite:///./product_app.db"
    debug: bool = True

    class Config:
        env_file = ".env"


settings = Settings()
