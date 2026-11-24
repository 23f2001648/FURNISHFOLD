"""Registration, login, refresh — public endpoints, no auth required."""
from fastapi import APIRouter, status

from app.core.dependencies import DbSession
from app.schemas.auth import LoginRequest, RefreshRequest, RegisterRequest, TokenResponse
from app.services.auth_service import AuthService
from app.services.notification_service import NotificationService

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest, db: DbSession):
    tokens = await AuthService(db).register(data)
    NotificationService.welcome(data.email, data.name)
    return tokens


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: DbSession):
    return await AuthService(db).login(data)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(data: RefreshRequest, db: DbSession):
    return await AuthService(db).refresh(data.refresh_token)
