from fastapi import APIRouter, Depends

from app.api.v1 import (
    auth,
    downloads,
    episodes,
    favorites,
    history,
    notifications,
    search,
    settings,
    status,
)
from app.core.auth import require_api_token

router = APIRouter(prefix="/api/v1")
router.include_router(auth.router)

protected = APIRouter(dependencies=[Depends(require_api_token)])
protected.include_router(search.router)
protected.include_router(episodes.router)
protected.include_router(downloads.router)
protected.include_router(history.router)
protected.include_router(favorites.router)
protected.include_router(notifications.router)
protected.include_router(settings.router)
protected.include_router(status.router)
router.include_router(protected)
