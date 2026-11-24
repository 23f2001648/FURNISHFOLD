"""Everything that only makes sense as an admin operation and doesn't
naturally belong on a resource's own router: the dashboard summary,
cross-customer order management, and inventory adjustment. Every route
here is gated by CurrentAdmin.

Product create/update/variant/image management lives on api/v1/products.py
(also CurrentAdmin-gated) to keep one router per resource; this file is
specifically the admin console's own cross-cutting views."""
from uuid import UUID

from fastapi import APIRouter, Query
from sqlalchemy import func, select

from app.core.dependencies import CurrentAdmin, DbSession
from app.models.order import Order, OrderStatus
from app.models.product import Product
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.order import OrderRead, OrderStatusUpdate
from app.services.inventory_service import InventoryService
from app.services.notification_service import NotificationService
from app.utils.pagination import paginate

router = APIRouter()


@router.get("/dashboard")
async def dashboard_summary(_: CurrentAdmin, db: DbSession):
    total_orders = (await db.execute(select(func.count(Order.id)))).scalar_one()
    total_revenue = (await db.execute(
        select(func.coalesce(func.sum(Order.total_amount), 0)).where(Order.payment_status == "paid")
    )).scalar_one()
    pending_orders = (await db.execute(
        select(func.count(Order.id)).where(Order.status == OrderStatus.PENDING)
    )).scalar_one()
    total_products = (await db.execute(select(func.count(Product.id)))).scalar_one()
    total_customers = (await db.execute(select(func.count(User.id)).where(User.role == "customer"))).scalar_one()

    return {
        "total_orders": total_orders,
        "total_revenue": float(total_revenue),
        "pending_orders": pending_orders,
        "total_products": total_products,
        "total_customers": total_customers,
    }


@router.get("/orders", response_model=PaginatedResponse[OrderRead])
async def list_all_orders(
    _: CurrentAdmin,
    db: DbSession,
    status_filter: OrderStatus | None = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1),
):
    from sqlalchemy.orm import selectinload
    stmt = select(Order).options(
        selectinload(Order.items), selectinload(Order.shipping_address),
        selectinload(Order.payments), selectinload(Order.shipments),
    ).order_by(Order.created_at.desc())
    if status_filter:
        stmt = stmt.where(Order.status == status_filter)
    return await paginate(db, stmt, page, page_size, OrderRead)


@router.patch("/orders/{order_id}/status", response_model=OrderRead)
async def update_order_status(order_id: UUID, data: OrderStatusUpdate, _: CurrentAdmin, db: DbSession):
    from app.core.exceptions import NotFoundError
    from app.repositories.order_repository import OrderRepository

    repo = OrderRepository(db)
    order = await repo.get_with_relations(order_id)
    if not order:
        raise NotFoundError("Order not found.")

    if data.status:
        order.status = data.status
    if data.shipping_status:
        order.shipping_status = data.shipping_status
        NotificationService.shipment_update(str(order.id), data.shipping_status, None)

    await db.flush()
    await db.refresh(order)
    return order


@router.patch("/inventory/{variant_id}")
async def set_inventory(variant_id: UUID, quantity: int, _: CurrentAdmin, db: DbSession):
    record = await InventoryService(db).set_stock(variant_id, quantity)
    return {"variant_id": variant_id, "quantity_on_hand": record.quantity_on_hand}


@router.get("/customers", response_model=list[dict])
async def list_customers(_: CurrentAdmin, db: DbSession):
    result = await db.execute(select(User).where(User.role == "customer").order_by(User.created_at.desc()))
    return [
        {"id": u.id, "name": u.name, "email": u.email, "is_active": u.is_active, "created_at": u.created_at}
        for u in result.scalars().all()
    ]
