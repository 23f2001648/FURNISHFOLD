"""An order: the immutable record created once a cart is checked out.
Line-item pricing is snapshotted onto OrderItem so later catalogue
price changes never alter historical orders."""
import enum
import uuid
from typing import List, Optional

from sqlalchemy import Enum, ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKeyMixin


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


class Order(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "orders"

    order_number: Mapped[str] = mapped_column(String(32), unique=True, index=True, nullable=False)
    customer_id: Mapped[uuid.UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("users.id"))
    shipping_address_id: Mapped[uuid.UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("addresses.id"))
    billing_address_id: Mapped[Optional[uuid.UUID]] = mapped_column(PGUUID(as_uuid=True), ForeignKey("addresses.id"), nullable=True)
    coupon_id: Mapped[Optional[uuid.UUID]] = mapped_column(PGUUID(as_uuid=True), ForeignKey("coupons.id"), nullable=True)

    subtotal: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    discount_amount: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    shipping_amount: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    tax_amount: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    total_amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)

    status: Mapped[OrderStatus] = mapped_column(Enum(OrderStatus, name="order_status"), default=OrderStatus.PENDING)
    payment_status: Mapped[PaymentStatus] = mapped_column(Enum(PaymentStatus, name="payment_status"), default=PaymentStatus.PENDING)
    shipping_status: Mapped[str] = mapped_column(String(40), default="not_shipped")
    customer_note: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    customer: Mapped["User"] = relationship(back_populates="orders")
    shipping_address: Mapped["Address"] = relationship(foreign_keys=[shipping_address_id])
    billing_address: Mapped[Optional["Address"]] = relationship(foreign_keys=[billing_address_id])
    coupon: Mapped[Optional["Coupon"]] = relationship()
    items: Mapped[List["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")
    payments: Mapped[List["Payment"]] = relationship(back_populates="order", cascade="all, delete-orphan")
    shipments: Mapped[List["Shipment"]] = relationship(back_populates="order", cascade="all, delete-orphan")
