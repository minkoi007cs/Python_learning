"""Mastery calculation and practice mode tests."""

import pytest
from httpx import AsyncClient
from app.services.mastery_service import MasteryService


def test_deterministic_mastery_calculation():
    # Perfect score: 1.0 accuracy, 1.0 hint score, 0 days elapsed
    score_perfect = MasteryService.calculate_score(1.0, 1.0, 0.0)
    assert score_perfect == 1.0

    # Half accuracy, some hints, 7 days elapsed
    score_mid = MasteryService.calculate_score(0.5, 0.6, 7.0)
    assert 0.0 <= score_mid <= 1.0

    # Old decayed score
    score_old = MasteryService.calculate_score(0.2, 0.2, 60.0)
    assert score_old < 0.3


@pytest.mark.asyncio
async def test_get_mastery_endpoint(async_client: AsyncClient):
    response = await async_client.get("/api/v1/mastery")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "concept_id" in data[0]
    assert "mastery_score" in data[0]


@pytest.mark.asyncio
async def test_practice_mode_filter(async_client: AsyncClient):
    response = await async_client.get("/api/v1/practice?difficulty=EASY")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    for ex in data:
        assert ex["difficulty"] == "EASY"
