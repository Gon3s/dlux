from hmac import compare_digest

from fastapi import HTTPException, Request, WebSocket, status

from app.config import settings

AUTH_COOKIE_NAME = "dlux_session"


def _bearer_token(authorization: str | None) -> str:
    if not authorization:
        return ""
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer":
        return ""
    return token.strip()


def is_valid_api_token(token: str) -> bool:
    return bool(settings.api_token) and compare_digest(token, settings.api_token)


async def require_api_token(request: Request) -> None:
    if not settings.api_token:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="API authentication is not configured",
        )

    token = _bearer_token(request.headers.get("authorization"))
    if not token:
        token = request.cookies.get(AUTH_COOKIE_NAME, "")
    if not is_valid_api_token(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def websocket_is_authenticated(websocket: WebSocket) -> bool:
    token = _bearer_token(websocket.headers.get("authorization"))
    if not token:
        token = websocket.cookies.get(AUTH_COOKIE_NAME, "")
    return is_valid_api_token(token)
