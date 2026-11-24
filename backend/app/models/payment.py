"""A payment attempt/record against an order, tied to a gateway transaction."""
import enum
import uuid
from typing import Optional

from sqlalchemy import Enum, ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKeyMixin


class PaymentProvider(str, enum.Enum):
    RAZORPAY = "razorpay"
    CASHFREE = "cashfree"
    COD = "cod"


class PaymentState(str, enum.Enum):
    INITIATED = "initiated"
    SUCCESS = "success"
    FAILED = "failed"
    REFUNDED = "refunded"


class Payment(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "payments"

    order_id: Mapped[uuid.UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"))
    provider: Mapped[PaymentProvider] = mapped_column(Enum(PaymentProvider, name="payment_provider"))
    provider_order_id: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    provider_payment_id: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    state: Mapped[PaymentState] = mapped_column(Enum(PaymentState, name="payment_state"), default=PaymentState.INITIATED)
    failure_reason: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)

    order: Mapped["Order"] = relationship(back_populates="payments")
