"""Exercise attempt and submission schemas."""

from typing import List, Optional
from pydantic import BaseModel, Field


class ExerciseAttemptCreate(BaseModel):
    course_slug: str
    lesson_slug: str
    submitted_code: str
    passed: bool
    tests_passed: int
    tests_total: int
    hints_used: int = 0
    solution_viewed: bool = False
    execution_time_ms: float = 0.0


class TestEvaluationResult(BaseModel):
    name: str
    passed: bool
    error_message: Optional[str] = None


class ExerciseSubmissionResult(BaseModel):
    passed: bool
    message: str
    xp_awarded: int = 0
    lesson_completed: bool = False
    new_mastery_scores: dict = Field(default_factory=dict)
    current_streak: int = 0
    next_lesson_slug: Optional[str] = None
