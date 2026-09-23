"""Progress and exercise submission tests."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_submit_exercise_pass(async_client: AsyncClient):
    payload = {
        "course_slug": "python-fundamentals",
        "lesson_slug": "welcome-to-python",
        "submitted_code": "print('Hello, PyPath!')",
        "passed": True,
        "tests_passed": 2,
        "tests_total": 2,
        "hints_used": 0,
        "solution_viewed": False,
        "execution_time_ms": 12.5
    }

    response = await async_client.post("/api/v1/exercises/ex-intro-01/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["passed"] is True
    assert data["lesson_completed"] is True
    assert data["xp_awarded"] > 0
    assert data["current_streak"] >= 1
    assert data["next_lesson_slug"] == "multiple-lines-and-syntax"


@pytest.mark.asyncio
async def test_progress_summary(async_client: AsyncClient):
    # Retrieve progress
    response = await async_client.get("/api/v1/progress")
    assert response.status_code == 200
    data = response.json()
    assert "total_xp" in data
    assert "current_streak" in data
    assert len(data["courses_progress"]) >= 1


@pytest.mark.asyncio
async def test_dashboard_endpoint(async_client: AsyncClient):
    response = await async_client.get("/api/v1/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["active_course_slug"] == "python-fundamentals"
    assert "next_lesson_slug" in data
