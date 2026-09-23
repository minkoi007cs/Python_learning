import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

from app.core.config import settings
from app.models.base import Base
# Import all models to register metadata
import app.models  # noqa: F401

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

# Use application's DATABASE_URL
sync_db_url = settings.DATABASE_URL
if "+asyncpg" in sync_db_url:
    sync_db_url = sync_db_url.replace("+asyncpg", "")
elif "+aiosqlite" in sync_db_url:
    sync_db_url = sync_db_url.replace("+aiosqlite", "")

config.set_main_option("sqlalchemy.url", sync_db_url)


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    from sqlalchemy import create_engine
    connectable = create_engine(config.get_main_option("sqlalchemy.url"))

    with connectable.connect() as connection:
        do_run_migrations(connection)


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
