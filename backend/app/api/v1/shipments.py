"""Shipment booking (admin) + tracking lookup (customer, via their order)."""
from uuid import UUID

from fastapi import APIRouter

from app.core.dependencies import CurrentAdmin, CurrentUser, DbSession
from app.core.exceptions import ForbiddenError, NotFoundError
from app.schemas.shipment import ShipmentCreate, ShipmentRead
from app.services.shipping_service import ShippingService

router = APIRouter()


@router.post("/{order_id}", response_model=ShipmentRead)
async def create_shipment(order_id: UUID, data: ShipmentCreate, _: CurrentAdmin, db: DbSession):
    return await ShippingService(db).create_shipment(order_id, data.carrier)


@router.get("/order/{order_id}", response_model=list[ShipmentRead])
async def get_order_shipments(order_id: UUID, current_user: CurrentUser, db: DbSession):
    from app.repositories.order_repository import OrderRepository
    order = await OrderRepository(db).get_with_relations(order_id)
    if not order:
        raise NotFoundError("Order not found.")
    if order.customer_id != current_user.id and current_user.role.value != "admin":
        raise ForbiddenError("You don't have access to this order.")
    return order.shipments
