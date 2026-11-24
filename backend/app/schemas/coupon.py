import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.coupon import DiscountType


class CouponCreate(BaseModel):
    code: str
    discount_type: DiscountType
    discount_value: Decimal
    min_order_amount: Decimal = Decimal(0)
    max_discount_amount: Decimal | None = None
    usage_limit: int | None = None
    valid_from: datetime | None = None
    valid_until: datetime | None = None


class CouponUpdate(BaseModel):
    discount_value: Decimal | None = None
    is_active: bool | None = None
    usage_limit: int | None = None
    valid_until: datetime | None = None


class CouponRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    code: str
    discount_type: DiscountType
    discount_value: Decimal
    min_order_amount: Decimal
    max_discount_amount: Decimal | None
    usage_limit: int | None
    times_used: int
    is_active: bool
    valid_until: datetime | None


class CouponApplyRequest(BaseModel):
    code: str
