"""Integration test for register -> login -> /users/me, exercising the
real FastAPI app, routing, and auth dependency chain end-to-end."""
import pytest

pytestmark = pytest.mark.asyncio


async def test_register_login_and_me(client):
    register_payload = {
        "name": "Test Customer",
        "email": "test.customer@example.com",
        "password": "StrongPass123",
    }
    register_resp = await client.post("/api/v1/auth/register", json=register_payload)
    assert register_resp.status_code == 201
    tokens = register_resp.json()
    assert "access_token" in tokens

    me_resp = await client.get(
        "/api/v1/users/me", headers={"Authorization": f"Bearer {tokens['access_token']}"}
    )
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == register_payload["email"]


async def test_health_check(client):
    resp = await client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"
