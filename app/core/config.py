from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str
    jwt_secret: str
    BASE_URL: str
    STORAGE_BACKEND: str
    UPLOAD_DIR: str
    SENDGRID_API_KEY: str
    SENDGRID_FROM_EMAIL: str

    S3_ENDPOINT_URL: str = "http://minio:9000"
    AWS_ACCESS_KEY_ID: str = "minioadmin"
    AWS_SECRET_ACCESS_KEY: str = "minioadmin"
    S3_BUCKET_NAME: str = "my-app-bucket"
    PUBLIC_S3_ENDPOINT_URL: str = "http://localhost:9000"

    @field_validator("database_url", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: str) -> str:
        if isinstance(v, str):
            if v.startswith("postgres://"):
                return v.replace("postgres://", "postgresql+asyncpg://", 1)
            if v.startswith("postgresql://") and not v.startswith("postgresql+asyncpg://"):
                return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v


settings = Settings()  # type: ignore[call-arg]
