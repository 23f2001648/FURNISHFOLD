"""Books and tracks shipments against the configured carrier, syncing
status back onto the Order row."""
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.integrations.shipping import get_shipping_provider
from app.models.shipment import Shipment, ShipmentStatus
from app.repositories.order_repository import OrderRepository


class ShippingService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.orders = OrderRepository(db)

    async def create_shipment(self, order_id: uuid.UUID, carrier: str | None = None) -> Shipment:
        order = await self.orders.get_with_relations(order_id)
        if not order:
            raise NotFoundError("Order not found.")

        provider = get_shipping_provider(carrier)
        result = await provider.create_shipment(order)

        shipment = Shipment(
            order_id=order.id,
            carrier=result["carrier"],
            tracking_number=result.get("tracking_number"),
            tracking_url=result.get("tracking_url"),
            status=ShipmentStatus.LABEL_CREATED,
        )
        self.db.add(shipment)
        order.shipping_status = "label_created"
        await self.db.flush()
        await self.db.refresh(shipment)
        return shipment

    async def sync_status(self, shipment: Shipment) -> Shipment:
        provider = get_shipping_provider(shipment.carrier)
        if shipment.tracking_number:
            status_data = await provider.track(shipment.tracking_number)
            # Mapping is carrier-specific; left as a TODO for the concrete
            # carrier's status vocabulary once credentials are live.
            _ = status_data
        return shipment
