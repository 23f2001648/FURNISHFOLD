"""Checkout orchestration: turns a cart into an Order, reserving stock
for every line item inside one DB transaction so a failed reservation
on item 3 rolls back items 1 and 2 as well. Payment capture and stock
commit/release happen afterwards via payment_service + webhook."""
import random
import string
import uuid
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, ValidationFailedError
from app.models.order import Order, OrderStatus, PaymentStatus
from app.models.order_item import OrderItem
from app.repositories.cart_repository import CartRepository
from app.repositories.coupon_repository import CouponRepository
from app.repositories.inventory_repository import InventoryRepository
from app.repositories.order_repository import OrderRepository
from app.schemas.order import OrderCreate
from app.utils.pricing import calculate_order_totals


def _generate_order_number() -> str:
    stamp = datetime.utcnow().strftime("%y%m%d")
    suffix = "".join(random.choices(string.digits, k=5))
    return f"FF{stamp}{suffix}"


class OrderService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.orders = OrderRepository(db)
        self.carts = CartRepository(db)
        self.coupons = CouponRepository(db)
        self.inventory = InventoryRepository(db)

    async def create_from_cart(self, customer_id: uuid.UUID, data: OrderCreate) -> Order:
        cart = await self.carts.get_or_create_for_user(customer_id)
        if not cart.items:
            raise ValidationFailedError("Your cart is empty.")

        coupon = None
        if data.coupon_code:
            coupon = await self.coupons.get_by_code(data.coupon_code)
            if not coupon or not coupon.is_active:
                raise ValidationFailedError("This coupon code is invalid or has expired.")

        subtotal = sum((item.variant.price * item.quantity for item in cart.items), start=cart.items[0].variant.price * 0)
        totals = calculate_order_totals(subtotal, coupon)

        order = Order(
            order_number=_generate_order_number(),
            customer_id=customer_id,
            shipping_address_id=data.shipping_address_id,
            billing_address_id=data.billing_address_id or data.shipping_address_id,
            coupon_id=coupon.id if coupon else None,
            customer_note=data.customer_note,
            status=OrderStatus.PENDING,
            payment_status=PaymentStatus.PENDING,
            **totals,
        )
        self.db.add(order)
        await self.db.flush()

        # Reserve stock for every line item; raises InsufficientStockError
        # (caught by the global AppError handler) which rolls back the
        # whole transaction, including the order row just inserted.
        for item in cart.items:
            await self.inventory.reserve_stock(item.variant_id, item.quantity)
            self.db.add(OrderItem(
                order_id=order.id,
                variant_id=item.variant_id,
                product_title_snapshot=item.variant.product.title,
                variant_label_snapshot=", ".join(filter(None, [item.variant.color, item.variant.size])),
                unit_price=item.variant.price,
                quantity=item.quantity,
                line_total=item.variant.price * item.quantity,
            ))

        if coupon:
            coupon.times_used += 1

        for item in list(cart.items):
            await self.db.delete(item)
        cart.coupon_id = None

        await self.db.flush()
        return await self.orders.get_with_relations(order.id)

    async def mark_paid(self, order_id: uuid.UUID) -> Order:
        order = await self.orders.get_with_relations(order_id)
        if not order:
            raise NotFoundError("Order not found.")
        order.payment_status = PaymentStatus.PAID
        order.status = OrderStatus.CONFIRMED
        for item in order.items:
            await self.inventory.commit_stock_deduction(item.variant_id, item.quantity)
        await self.db.flush()
        return order

    async def cancel(self, order_id: uuid.UUID) -> Order:
        order = await self.orders.get_with_relations(order_id)
        if not order:
            raise NotFoundError("Order not found.")
        if order.status in (OrderStatus.SHIPPED, OrderStatus.DELIVERED):
            raise ValidationFailedError("Shipped or delivered orders cannot be cancelled here.")
        for item in order.items:
            await self.inventory.release_reservation(item.variant_id, item.quantity)
        order.status = OrderStatus.CANCELLED
        await self.db.flush()
        return order
