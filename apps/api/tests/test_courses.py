"""Courses and lesson API endpoints tests."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_courses(async_client: AsyncClient):
    response = await async_client.get("/api/v1/courses")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["slug"] == "python-fundamentals"
    assert data[0]["total_modules"] >= 16


@pytest.mark.asyncio
async def test_get_course_detail(async_client: AsyncClient):
    response = await async_client.get("/api/v1/courses/python-fundamentals")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Python Fundamentals"
    assert len(data["modules"]) >= 16


@pytest.mark.asyncio
async def test_get_lesson_detail(async_client: AsyncClient):
    response = await async_client.get("/api/v1/courses/python-fundamentals/lessons/welcome-to-python")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "welcome-to-python"
    assert len(data["sections"]) >= 1
    assert data["next_lesson_slug"] == "multiple-lines-and-syntax"
