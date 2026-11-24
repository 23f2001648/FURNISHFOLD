"""Customer-facing order placement and history. Admin-wide order
management (list all, change status) lives in api/v1/admin.py."""
from uuid import UUID

from fastapi import APIRouter, status

from app.core.dependencies import CurrentUser, DbSession
from app.core.exceptions import ForbiddenError, NotFoundError
from app.schemas.order import OrderCreate, OrderRead
from app.services.notification_service import NotificationService
from app.services.order_service import OrderService

router = APIRouter()


@router.get("", response_model=list[OrderRead])
async def list_my_orders(current_user: CurrentUser, db: DbSession):
    from app.repositories.order_repository import OrderRepository
    return await OrderRepository(db).list_for_customer(current_user.id)


@router.get("/{order_id}", response_model=OrderRead)
async def get_order(order_id: UUID, current_user: CurrentUser, db: DbSession):
    from app.repositories.order_repository import OrderRepository
    order = await OrderRepository(db).get_with_relations(order_id)
    if not order:
        raise NotFoundError("Order not found.")
    if order.customer_id != current_user.id and current_user.role.value != "admin":
        raise ForbiddenError("You don't have access to this order.")
    return order


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
async def place_order(data: OrderCreate, current_user: CurrentUser, db: DbSession):
    order = await OrderService(db).create_from_cart(current_user.id, data)
    NotificationService.order_confirmed(str(order.id), current_user.email, order.order_number)
    return order


@router.post("/{order_id}/cancel", response_model=OrderRead)
async def cancel_order(order_id: UUID, current_user: CurrentUser, db: DbSession):
    from app.repositories.order_repository import OrderRepository
    order = await OrderRepository(db).get_with_relations(order_id)
    if not order:
        raise NotFoundError("Order not found.")
    if order.customer_id != current_user.id and current_user.role.value != "admin":
        raise ForbiddenError("You don't have access to this order.")
    return await OrderService(db).cancel(order_id)
