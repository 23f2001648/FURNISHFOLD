"""Thin service wrapper around InventoryRepository for admin stock edits
and audit logging; checkout-time reservation lives in order_service.py
since it must run inside the same transaction as order creation."""
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.repositories.inventory_repository import InventoryRepository


class InventoryService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.inventory = InventoryRepository(db)

    async def adjust_stock(self, variant_id: uuid.UUID, delta: int) -> "Inventory":
        record = await self.inventory.get_by_variant(variant_id)
        if not record:
            raise NotFoundError("Inventory record not found for this variant.")
        record.quantity_on_hand = max(0, record.quantity_on_hand + delta)
        await self.db.flush()
        await self.db.refresh(record)
        return record

    async def set_stock(self, variant_id: uuid.UUID, quantity: int) -> "Inventory":
        record = await self.inventory.get_by_variant(variant_id)
        if not record:
            raise NotFoundError("Inventory record not found for this variant.")
        record.quantity_on_hand = max(0, quantity)
        await self.db.flush()
        await self.db.refresh(record)
        return record
