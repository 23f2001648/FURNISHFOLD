"""Bridges Order <-> payment gateway: initiates a gateway order, verifies
the signature on callback, and hands off to order_service to confirm
the order and commit stock once payment is genuinely successful."""
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, PaymentFailedError
from app.integrations.payments import get_payment_gateway
from app.models.payment import Payment, PaymentProvider, PaymentState
from app.repositories.order_repository import OrderRepository
from app.schemas.payment import PaymentInitiateResponse, PaymentVerifyRequest
from app.services.order_service import OrderService


class PaymentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.orders = OrderRepository(db)

    async def initiate(self, order_id: uuid.UUID, provider_name: str) -> PaymentInitiateResponse:
        order = await self.orders.get_with_relations(order_id)
        if not order:
            raise NotFoundError("Order not found.")

        if provider_name == "cod":
            payment = Payment(order_id=order.id, provider=PaymentProvider.COD, amount=order.total_amount, state=PaymentState.INITIATED)
            self.db.add(payment)
            await self.db.flush()
            return PaymentInitiateResponse(payment_id=payment.id, provider=PaymentProvider.COD, provider_order_id=None, amount=order.total_amount)

        gateway = get_payment_gateway(provider_name)
        gateway_order = await gateway.create_order(order.total_amount, "INR", order.order_number)

        payment = Payment(
            order_id=order.id,
            provider=PaymentProvider(provider_name),
            provider_order_id=gateway_order["provider_order_id"],
            amount=order.total_amount,
            state=PaymentState.INITIATED,
        )
        self.db.add(payment)
        await self.db.flush()

        return PaymentInitiateResponse(
            payment_id=payment.id,
            provider=payment.provider,
            provider_order_id=payment.provider_order_id,
            amount=payment.amount,
            key_id=gateway_order.get("key_id"),
        )

    async def verify(self, data: PaymentVerifyRequest) -> "Payment":
        payment = await self.db.get(Payment, data.payment_id)
        if not payment:
            raise NotFoundError("Payment not found.")

        gateway = get_payment_gateway(payment.provider.value)
        is_valid = gateway.verify_signature(
            payment.provider_order_id or "", data.provider_payment_id, data.provider_signature
        )
        if not is_valid:
            payment.state = PaymentState.FAILED
            payment.failure_reason = "Signature verification failed."
            await self.db.flush()
            raise PaymentFailedError("Payment verification failed. No charge has been confirmed.")

        payment.state = PaymentState.SUCCESS
        payment.provider_payment_id = data.provider_payment_id
        await self.db.flush()

        await OrderService(self.db).mark_paid(payment.order_id)
        return payment
