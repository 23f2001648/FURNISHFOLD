"""
Shared FastAPI dependencies: DB session re-export, current-user
resolution from JWT, and role guards used to separate customer vs
admin access on routes.
"""
from typing import Annotated, Optional
from uuid import UUID

from fastapi import Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.exceptions import ForbiddenError, UnauthorizedError
from app.core.security import decode_token
from app.models.user import User, UserRole
from app.repositories.user_repository import UserRepository

DbSession = Annotated[AsyncSession, Depends(get_db)]


async def _extract_token(authorization: Optional[str] = Header(default=None)) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise UnauthorizedError("Missing or malformed Authorization header.")
    return authorization.split(" ", 1)[1]


async def get_current_user(
    db: DbSession,
    token: Annotated[str, Depends(_extract_token)],
) -> User:
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise UnauthorizedError("Invalid or expired access token.")

    user_id = payload.get("sub")
    user = await UserRepository(db).get_by_id(UUID(user_id))
    if not user or not user.is_active:
        raise UnauthorizedError("User account not found or disabled.")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


async def get_current_admin(current_user: CurrentUser) -> User:
    if current_user.role != UserRole.ADMIN:
        raise ForbiddenError("Admin access required.")
    return current_user


CurrentAdmin = Annotated[User, Depends(get_current_admin)]


async def get_optional_user(
    db: DbSession,
    authorization: Optional[str] = Header(default=None),
) -> Optional[User]:
    """Used on public endpoints (e.g. product listing) that personalise
    output slightly when a user happens to be logged in, but don't require it."""
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    payload = decode_token(authorization.split(" ", 1)[1])
    if not payload or payload.get("type") != "access":
        return None
    user = await UserRepository(db).get_by_id(UUID(payload.get("sub")))
    return user if user and user.is_active else None
