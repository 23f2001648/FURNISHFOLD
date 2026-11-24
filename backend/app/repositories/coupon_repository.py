from typing import Optional

from sqlalchemy import select

from app.models.coupon import Coupon
from app.repositories.base_repository import BaseRepository


class CouponRepository(BaseRepository[Coupon]):
    model = Coupon

    async def get_by_code(self, code: str) -> Optional[Coupon]:
        result = await self.db.execute(select(Coupon).where(Coupon.code == code.upper()))
        return result.scalar_one_or_none()
