"""The logged-in customer's cart: view, add/update/remove items, apply a coupon."""
from uuid import UUID

from fastapi import APIRouter

from app.core.dependencies import CurrentUser, DbSession
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartRead
from app.schemas.coupon import CouponApplyRequest
from app.services.cart_service import CartService

router = APIRouter()


def _to_cart_read(cart, totals) -> CartRead:
    return CartRead(
        id=cart.id,
        items=[
            {"id": i.id, "variant": i.variant, "quantity": i.quantity, "line_total": i.variant.price * i.quantity}
            for i in cart.items
        ],
        subtotal=totals["subtotal"],
        discount_amount=totals["discount_amount"],
        total=totals["total"],
        coupon_code=cart.coupon.code if cart.coupon else None,
    )


@router.get("", response_model=CartRead)
async def get_cart(current_user: CurrentUser, db: DbSession):
    service = CartService(db)
    cart = await service.get_cart(current_user.id)
    return _to_cart_read(cart, service.compute_totals(cart))


@router.post("/items", response_model=CartRead)
async def add_item(data: CartItemCreate, current_user: CurrentUser, db: DbSession):
    service = CartService(db)
    cart = await service.add_item(current_user.id, data.variant_id, data.quantity)
    return _to_cart_read(cart, service.compute_totals(cart))


@router.patch("/items/{item_id}", response_model=CartRead)
async def update_item(item_id: UUID, data: CartItemUpdate, current_user: CurrentUser, db: DbSession):
    service = CartService(db)
    cart = await service.update_item(current_user.id, item_id, data.quantity)
    return _to_cart_read(cart, service.compute_totals(cart))


@router.delete("/items/{item_id}", response_model=CartRead)
async def remove_item(item_id: UUID, current_user: CurrentUser, db: DbSession):
    service = CartService(db)
    cart = await service.remove_item(current_user.id, item_id)
    return _to_cart_read(cart, service.compute_totals(cart))


@router.post("/coupon", response_model=CartRead)
async def apply_coupon(data: CouponApplyRequest, current_user: CurrentUser, db: DbSession):
    service = CartService(db)
    cart = await service.apply_coupon(current_user.id, data.code)
    return _to_cart_read(cart, service.compute_totals(cart))
