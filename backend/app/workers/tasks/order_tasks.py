"""Background order housekeeping: auto-cancel unpaid orders, fan out
post-purchase notifications."""
import asyncio

from app.workers.celery_app import celery_app
from app.workers.tasks.email_tasks import send_order_confirmation_email
from app.workers.tasks.invoice_tasks import generate_invoice_pdf


@celery_app.task(name="order.post_payment_followup")
def post_payment_followup(order_id: str, user_email: str, order_number: str) -> None:
    """Chains the confirmation email + invoice generation once payment succeeds."""
    send_order_confirmation_email.delay(order_id, user_email, order_number)
    generate_invoice_pdf.delay(order_id)


@celery_app.task(name="order.expire_unpaid")
def expire_unpaid_orders() -> None:
    """Periodic task (wire up via celery beat) that cancels orders left
    PENDING/unpaid for more than e.g. 30 minutes, releasing their
    reserved stock back to inventory."""
    # TODO: query Order where status == PENDING and created_at < now-30m,
    # call OrderService.cancel for each.
    pass
