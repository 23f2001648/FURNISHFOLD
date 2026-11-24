import uuid
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.payment import PaymentProvider, PaymentState


class PaymentInitiateResponse(BaseModel):
    """What the frontend needs to open the gateway's checkout widget."""
    payment_id: uuid.UUID
    provider: PaymentProvider
    provider_order_id: str | None
    amount: Decimal
    currency: str = "INR"
    key_id: str | None = None  # public key for Razorpay/Cashfree client SDK


class PaymentVerifyRequest(BaseModel):
    payment_id: uuid.UUID
    provider_payment_id: str
    provider_signature: str


class PaymentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    provider: PaymentProvider
    amount: Decimal
    state: PaymentState
