"""Concept mastery tracking model."""

from datetime import datetime
from sqlalchemy import Float, Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class UserConceptMastery(Base, TimestampMixin):
    __tablename__ = "user_concept_mastery"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    concept_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    mastery_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)  # 0.0 to 1.0
    total_attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    successful_attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_practiced_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
