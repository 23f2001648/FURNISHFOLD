"""Repository for the cart + its line items. Grouped together since a
cart is always read/written as a whole (cart + items) in practice."""
import uuid
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.cart import Cart
from app.models.cart_item import CartItem
from app.models.product_variant import ProductVariant
from app.repositories.base_repository import BaseRepository


class CartRepository(BaseRepository[Cart]):
    model = Cart

    def _with_relations(self):
        return select(Cart).options(
            selectinload(Cart.items).selectinload(CartItem.variant).selectinload(ProductVariant.inventory),
            selectinload(Cart.items).selectinload(CartItem.variant).selectinload(ProductVariant.product),
            selectinload(Cart.coupon),
        )

    async def get_or_create_for_user(self, user_id: uuid.UUID) -> Cart:
        stmt = self._with_relations().where(Cart.user_id == user_id)
        result = await self.db.execute(stmt)
        cart = result.scalar_one_or_none()
        if cart:
            return cart
        cart = Cart(user_id=user_id)
        self.db.add(cart)
        await self.db.flush()
        await self.db.refresh(cart)
        cart.items = []
        return cart

    async def get_item(self, cart_id: uuid.UUID, variant_id: uuid.UUID) -> Optional[CartItem]:
        stmt = select(CartItem).where(CartItem.cart_id == cart_id, CartItem.variant_id == variant_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
