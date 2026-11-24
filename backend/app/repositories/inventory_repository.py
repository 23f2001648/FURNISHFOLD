import uuid
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import InsufficientStockError
from app.models.inventory import Inventory
from app.repositories.base_repository import BaseRepository


class InventoryRepository(BaseRepository[Inventory]):
    model = Inventory

    async def get_by_variant(self, variant_id: uuid.UUID) -> Optional[Inventory]:
        result = await self.db.execute(select(Inventory).where(Inventory.variant_id == variant_id))
        return result.scalar_one_or_none()

    async def reserve_stock(self, variant_id: uuid.UUID, quantity: int) -> Inventory:
        """Locks the row to prevent two concurrent checkouts from
        over-selling the last unit of a variant."""
        stmt = select(Inventory).where(Inventory.variant_id == variant_id).with_for_update()
        result = await self.db.execute(stmt)
        inventory = result.scalar_one_or_none()
        if not inventory or inventory.quantity_available < quantity:
            raise InsufficientStockError(
                "Not enough stock for this item.", {"variant_id": str(variant_id), "requested": quantity}
            )
        inventory.quantity_reserved += quantity
        await self.db.flush()
        return inventory

    async def release_reservation(self, variant_id: uuid.UUID, quantity: int) -> None:
        inventory = await self.get_by_variant(variant_id)
        if inventory:
            inventory.quantity_reserved = max(0, inventory.quantity_reserved - quantity)
            await self.db.flush()

    async def commit_stock_deduction(self, variant_id: uuid.UUID, quantity: int) -> None:
        """Called once payment is confirmed: reserved stock becomes a real deduction."""
        inventory = await self.get_by_variant(variant_id)
        if inventory:
            inventory.quantity_on_hand = max(0, inventory.quantity_on_hand - quantity)
            inventory.quantity_reserved = max(0, inventory.quantity_reserved - quantity)
            await self.db.flush()
