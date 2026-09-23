"""Core configuration settings using Pydantic Settings."""

import os
from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ENVIRONMENT: str = Field(default="development")
    LOG_LEVEL: str = Field(default="info")

    API_HOST: str = Field(default="0.0.0.0")
    API_PORT: int = Field(default=8000)
    CORS_ORIGINS: Union[str, List[str]] = Field(default="http://localhost:3000,http://127.0.0.1:3000")

    # Database URL: defaults to local async SQLite for zero-config development/tests, or PostgreSQL in production
    DATABASE_URL: str = Field(default="sqlite+aiosqlite:///./pypath.db")

    # Supabase Authentication
    SUPABASE_URL: str = Field(default="https://placeholder.supabase.co")
    SUPABASE_ANON_KEY: str = Field(default="placeholder-anon-key")
    SUPABASE_JWT_SECRET: str = Field(default="dev-jwt-secret-at-least-32-characters-long")

    # Path to curriculum files
    CONTENT_DIR: str = Field(default=os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../content")))

    # AI Tutor Configuration
    AI_TUTOR_PROVIDER: str = Field(default="disabled")
    AI_TUTOR_API_KEY: str = Field(default="")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [i.strip() for i in v.split(",") if i.strip()]
        return v


settings = Settings()
