import uuid
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.product import ProductVariantRead


class CartItemCreate(BaseModel):
    variant_id: uuid.UUID
    quantity: int = Field(default=1, ge=1, le=20)


class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1, le=20)


class CartItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    variant: ProductVariantRead
    quantity: int
    line_total: Decimal


class CartRead(BaseModel):
    id: uuid.UUID
    items: list[CartItemRead]
    subtotal: Decimal
    discount_amount: Decimal
    total: Decimal
    coupon_code: str | None = None
