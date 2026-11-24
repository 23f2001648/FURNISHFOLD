import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.order import OrderStatus, PaymentStatus
from app.schemas.address import AddressRead


class OrderCreate(BaseModel):
    shipping_address_id: uuid.UUID
    billing_address_id: uuid.UUID | None = None
    coupon_code: str | None = None
    customer_note: str | None = None
    payment_provider: str = "razorpay"  # razorpay | cashfree | cod


class OrderItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    product_title_snapshot: str
    variant_label_snapshot: str
    unit_price: Decimal
    quantity: int
    line_total: Decimal


class OrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    order_number: str
    status: OrderStatus
    payment_status: PaymentStatus
    shipping_status: str
    subtotal: Decimal
    discount_amount: Decimal
    shipping_amount: Decimal
    tax_amount: Decimal
    total_amount: Decimal
    items: list[OrderItemRead]
    shipping_address: AddressRead
    created_at: datetime


class OrderStatusUpdate(BaseModel):
    status: OrderStatus | None = None
    shipping_status: str | None = None
