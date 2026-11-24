"""Cart read/mutate logic plus the subtotal/discount preview the frontend
shows before checkout — same pricing math order_service uses, via
app.utils.pricing, so the numbers never drift between cart and order."""
import uuid
from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, ValidationFailedError
from app.repositories.cart_repository import CartRepository
from app.repositories.coupon_repository import CouponRepository
from app.repositories.product_repository import ProductRepository
from app.utils.pricing import calculate_discount, round_money


class CartService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.carts = CartRepository(db)
        self.coupons = CouponRepository(db)
        self.products = ProductRepository(db)

    async def get_cart(self, user_id: uuid.UUID):
        return await self.carts.get_or_create_for_user(user_id)

    async def add_item(self, user_id: uuid.UUID, variant_id: uuid.UUID, quantity: int):
        cart = await self.carts.get_or_create_for_user(user_id)
        existing = await self.carts.get_item(cart.id, variant_id)
        if existing:
            existing.quantity += quantity
        else:
            from app.models.cart_item import CartItem
            existing = CartItem(cart_id=cart.id, variant_id=variant_id, quantity=quantity)
            self.db.add(existing)
        await self.db.flush()
        return await self.carts.get_or_create_for_user(user_id)

    async def update_item(self, user_id: uuid.UUID, item_id: uuid.UUID, quantity: int):
        cart = await self.carts.get_or_create_for_user(user_id)
        item = next((i for i in cart.items if i.id == item_id), None)
        if not item:
            raise NotFoundError("Cart item not found.")
        item.quantity = quantity
        await self.db.flush()
        return await self.carts.get_or_create_for_user(user_id)

    async def remove_item(self, user_id: uuid.UUID, item_id: uuid.UUID):
        cart = await self.carts.get_or_create_for_user(user_id)
        item = next((i for i in cart.items if i.id == item_id), None)
        if not item:
            raise NotFoundError("Cart item not found.")
        await self.db.delete(item)
        await self.db.flush()
        return await self.carts.get_or_create_for_user(user_id)

    async def apply_coupon(self, user_id: uuid.UUID, code: str):
        coupon = await self.coupons.get_by_code(code)
        if not coupon or not coupon.is_active:
            raise ValidationFailedError("This coupon code is invalid or has expired.")
        cart = await self.carts.get_or_create_for_user(user_id)
        cart.coupon_id = coupon.id
        await self.db.flush()
        return await self.carts.get_or_create_for_user(user_id)

    def compute_totals(self, cart) -> dict:
        subtotal = sum((item.variant.price * item.quantity for item in cart.items), Decimal("0.00"))
        discount = calculate_discount(subtotal, cart.coupon)
        return {
            "subtotal": round_money(subtotal),
            "discount_amount": discount,
            "total": round_money(subtotal - discount),
        }
