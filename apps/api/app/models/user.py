"""User profile models aligned with Supabase Auth."""

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class Profile(Base, TimestampMixin):
    __tablename__ = "profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(100), default="Python Learner", nullable=False)
    experience_level: Mapped[str] = mapped_column(String(30), default="BEGINNER", nullable=False)
    daily_goal_minutes: Mapped[int] = mapped_column(Integer, default=15, nullable=False)
    timezone: Mapped[str] = mapped_column(String(50), default="UTC", nullable=False)
