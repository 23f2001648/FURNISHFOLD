"""Admin coupon management. Customer-facing apply lives on cart.py
since applying is really a cart mutation."""
from uuid import UUID

from fastapi import APIRouter, status

from app.core.dependencies import CurrentAdmin, DbSession
from app.schemas.coupon import CouponCreate, CouponRead, CouponUpdate
from app.services.coupon_service import CouponService

router = APIRouter()


@router.get("", response_model=list[CouponRead])
async def list_coupons(_: CurrentAdmin, db: DbSession):
    return await CouponService(db).list_all()


@router.post("", response_model=CouponRead, status_code=status.HTTP_201_CREATED)
async def create_coupon(data: CouponCreate, _: CurrentAdmin, db: DbSession):
    return await CouponService(db).create(data)


@router.patch("/{coupon_id}", response_model=CouponRead)
async def update_coupon(coupon_id: UUID, data: CouponUpdate, _: CurrentAdmin, db: DbSession):
    return await CouponService(db).update(coupon_id, data)
