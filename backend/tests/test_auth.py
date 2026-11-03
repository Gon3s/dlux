from unittest.mock import MagicMock

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect

from app.api.ws import router as ws_router
from app.config import settings
from app.core.auth import AUTH_COOKIE_NAME, websocket_is_authenticated


class TestHttpAuthentication:
    async def test_protected_endpoint_rejects_missing_token(
        self, unauthenticated_client
    ) -> None:
        response = await unauthenticated_client.get("/api/v1/status")

        assert response.status_code == 401
        assert response.headers["www-authenticate"] == "Bearer"

    async def test_protected_endpoint_rejects_invalid_token(
        self, unauthenticated_client
    ) -> None:
        response = await unauthenticated_client.get(
            "/api/v1/status",
            headers={"Authorization": "Bearer wrong-token"},
        )

        assert response.status_code == 401

    async def test_login_sets_http_only_cookie(self, unauthenticated_client) -> None:
        response = await unauthenticated_client.post(
            "/api/v1/auth/login", json={"token": "test-api-token"}
        )

        assert response.status_code == 204
        assert AUTH_COOKIE_NAME in response.cookies
        assert "HttpOnly" in response.headers["set-cookie"]
        session = await unauthenticated_client.get("/api/v1/auth/session")
        assert session.status_code == 204

    async def test_login_rejects_invalid_token(self, unauthenticated_client) -> None:
        response = await unauthenticated_client.post(
            "/api/v1/auth/login", json={"token": "wrong-token"}
        )

        assert response.status_code == 401

    async def test_missing_server_configuration_fails_closed(
        self, unauthenticated_client, monkeypatch
    ) -> None:
        monkeypatch.setattr(settings, "api_token", "")

        response = await unauthenticated_client.get("/api/v1/status")

        assert response.status_code == 503


class TestWebSocketAuthentication:
    def test_cookie_authenticates_websocket(self) -> None:
        websocket = MagicMock()
        websocket.headers = {}
        websocket.cookies = {AUTH_COOKIE_NAME: "test-api-token"}
        websocket.query_params = {}

        assert websocket_is_authenticated(websocket)

    def test_missing_token_rejects_websocket(self) -> None:
        websocket = MagicMock()
        websocket.headers = {}
        websocket.cookies = {}
        websocket.query_params = {}

        assert not websocket_is_authenticated(websocket)

    def test_websocket_route_closes_unauthenticated_connection(self) -> None:
        app = FastAPI()
        app.include_router(ws_router)

        with TestClient(app) as client:
            with pytest.raises(WebSocketDisconnect) as exc_info:
                with client.websocket_connect("/ws/queue"):
                    pass

        assert exc_info.value.code == 1008
