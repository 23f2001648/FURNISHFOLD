"""
Application configuration, loaded from environment variables / .env.
Centralising settings here means every other module imports `settings`
instead of reading os.environ directly.
"""
from functools import lru_cache
from typing import List, Optional

from pydantic import AnyHttpUrl, Field, PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # --- App ---
    PROJECT_NAME: str = "FurnishFoldz"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = Field(default="development")  # development | staging | production
    DEBUG: bool = True

    # --- Security / Auth ---
    SECRET_KEY: str = "change-me-in-prod"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 14

    # --- Database ---
    DATABASE_URL: str = "postgresql+psycopg://furnishfoldz:furnishfoldz@localhost:5432/furnishfoldz"
    DATABASE_URL_SYNC: Optional[str] = None  # used by Alembic; falls back to DATABASE_URL

    # --- Redis / Celery ---
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: Optional[str] = None
    CELERY_RESULT_BACKEND: Optional[str] = None

    # --- CORS ---
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "https://furnishfoldz.in"]

    # --- Payments ---
    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None
    CASHFREE_APP_ID: Optional[str] = None
    CASHFREE_SECRET_KEY: Optional[str] = None
    PAYMENT_PROVIDER: str = "razorpay"  # razorpay | cashfree

    # --- Shipping ---
    SHIPROCKET_EMAIL: Optional[str] = None
    SHIPROCKET_PASSWORD: Optional[str] = None
    DELHIVERY_API_TOKEN: Optional[str] = None
    SHIPPING_PROVIDER: str = "shiprocket"  # shiprocket | delhivery

    # --- Email ---
    EMAIL_PROVIDER: str = "smtp"  # smtp | sendgrid | ses
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAIL_FROM: str = "orders@furnishfoldz.in"

    # --- WhatsApp ---
    WHATSAPP_PROVIDER: str = "meta_cloud_api"
    WHATSAPP_PHONE_NUMBER_ID: Optional[str] = None
    WHATSAPP_ACCESS_TOKEN: Optional[str] = None

    # --- File storage ---
    STORAGE_BACKEND: str = "local"  # local | s3
    LOCAL_STORAGE_DIR: str = "./uploads"
    S3_BUCKET_NAME: Optional[str] = None
    S3_REGION: Optional[str] = None
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    PUBLIC_ASSET_BASE_URL: Optional[AnyHttpUrl] = None

    # --- Pagination ---
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    @field_validator("CELERY_BROKER_URL", mode="before")
    @classmethod
    def default_broker(cls, v, info):
        return v or info.data.get("REDIS_URL")

    @field_validator("CELERY_RESULT_BACKEND", mode="before")
    @classmethod
    def default_backend(cls, v, info):
        return v or info.data.get("REDIS_URL")

    @field_validator("DATABASE_URL_SYNC", mode="before")
    @classmethod
    def default_sync_url(cls, v, info):
        return v or info.data.get("DATABASE_URL")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
