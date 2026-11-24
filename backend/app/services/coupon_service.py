"""Admin-facing coupon CRUD plus the customer-facing apply/validate path
(validate reused from cart_service for the discount math)."""
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, NotFoundError
from app.repositories.coupon_repository import CouponRepository
from app.schemas.coupon import CouponCreate, CouponUpdate


class CouponService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.coupons = CouponRepository(db)

    async def create(self, data: CouponCreate):
        if await self.coupons.get_by_code(data.code):
            raise ConflictError("A coupon with this code already exists.")
        payload = data.model_dump()
        payload["code"] = payload["code"].upper()
        return await self.coupons.create(**payload)

    async def update(self, coupon_id: uuid.UUID, data: CouponUpdate):
        coupon = await self.coupons.get_by_id(coupon_id)
        if not coupon:
            raise NotFoundError("Coupon not found.")
        return await self.coupons.update(coupon, **data.model_dump(exclude_unset=True))

    async def list_all(self):
        return await self.coupons.list_all(limit=200)
