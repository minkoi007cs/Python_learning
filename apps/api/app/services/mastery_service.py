"""Deterministic concept mastery tracking and review queue service."""

import math
from datetime import datetime
from typing import Dict, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.mastery import UserConceptMastery
from app.models.progress import UserExerciseAttempt
from app.schemas.progress import ConceptMasteryItem
from app.services.content_loader import content_loader


class MasteryService:
    @staticmethod
    def calculate_score(accuracy: float, hint_score: float, days_since: float) -> float:
        """
        Deterministic mastery formula:
        Mastery = clamp(0.4 * Accuracy + 0.3 * HintScore + 0.3 * RecencyScore, 0.0, 1.0)
        """
        recency_score = math.exp(-days_since / 14.0)
        raw_score = (0.4 * accuracy) + (0.3 * hint_score) + (0.3 * recency_score)
        return round(max(0.0, min(1.0, raw_score)), 2)

    @staticmethod
    async def get_user_mastery(db: AsyncSession, user_id: str) -> List[ConceptMasteryItem]:
        """Aggregate mastery for all concepts encountered by user."""
        stmt = select(UserConceptMastery).where(UserConceptMastery.user_id == user_id)
        records = (await db.execute(stmt)).scalars().all()
        now = datetime.utcnow()

        results = []
        for r in records:
            days_since = (now - r.last_practiced_at).total_seconds() / 86400.0
            accuracy = (r.successful_attempts / r.total_attempts) if r.total_attempts > 0 else 0.0
            hint_score = 0.8  # Normalized default
            score = MasteryService.calculate_score(accuracy, hint_score, days_since)

            parts = r.concept_id.split(".", 1)
            category = parts[0].capitalize()
            name = parts[1].replace("_", " ").title() if len(parts) > 1 else r.concept_id

            results.append(ConceptMasteryItem(
                concept_id=r.concept_id,
                concept_name=name,
                category=category,
                mastery_score=score,
                attempts=r.total_attempts,
                needs_review=(score < 0.70)
            ))

        # Default concepts if user has zero attempts yet
        if not results:
            default_concepts = [
                ("variables.declaration", "Variables", "Syntax & State"),
                ("data_types.primitives", "Data Types", "Numbers & Strings"),
                ("conditionals.branching", "Conditionals", "Control Flow"),
                ("loops.for_while", "Loops", "Control Flow"),
                ("functions.def_return", "Functions", "Modularity"),
            ]
            for cid, cname, cat in default_concepts:
                results.append(ConceptMasteryItem(
                    concept_id=cid,
                    concept_name=cname,
                    category=cat,
                    mastery_score=0.0,
                    attempts=0,
                    needs_review=True
                ))

        return results


mastery_service = MasteryService()
