from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database settings
    POSTGRESQL_URL: str = "postgresql://postgres:postgres@localhost:5432/paircode"
    SQLITE_DB_PATH: str = "paircode.db"  # SQLite database file path
    
    # Application settings
    APP_NAME: str = "PairCode API"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

