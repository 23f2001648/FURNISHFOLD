"""Payment initiation + gateway callback verification."""
from uuid import UUID

from fastapi import APIRouter

from app.core.dependencies import CurrentUser, DbSession
from app.schemas.payment import PaymentInitiateResponse, PaymentRead, PaymentVerifyRequest
from app.services.payment_service import PaymentService

router = APIRouter()


@router.post("/{order_id}/initiate", response_model=PaymentInitiateResponse)
async def initiate_payment(order_id: UUID, provider: str, current_user: CurrentUser, db: DbSession):
    return await PaymentService(db).initiate(order_id, provider)


@router.post("/verify", response_model=PaymentRead)
async def verify_payment(data: PaymentVerifyRequest, current_user: CurrentUser, db: DbSession):
    return await PaymentService(db).verify(data)
