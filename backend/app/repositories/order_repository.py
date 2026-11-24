import uuid
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.order import Order
from app.models.order_item import OrderItem
from app.repositories.base_repository import BaseRepository


class OrderRepository(BaseRepository[Order]):
    model = Order

    def _with_relations(self):
        return select(Order).options(
            selectinload(Order.items),
            selectinload(Order.shipping_address),
            selectinload(Order.payments),
            selectinload(Order.shipments),
        )

    async def get_with_relations(self, order_id: uuid.UUID) -> Optional[Order]:
        stmt = self._with_relations().where(Order.id == order_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_order_number(self, order_number: str) -> Optional[Order]:
        stmt = self._with_relations().where(Order.order_number == order_number)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_for_customer(self, customer_id: uuid.UUID) -> list[Order]:
        stmt = self._with_relations().where(Order.customer_id == customer_id).order_by(Order.created_at.desc())
        result = await self.db.execute(stmt)
        return list(result.scalars().unique().all())
