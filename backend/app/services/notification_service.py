"""Fire-and-forget notification dispatch. Services call these methods,
which queue Celery tasks rather than sending synchronously — so a slow
email/WhatsApp API never adds latency to an order or auth request."""
from app.workers.tasks.email_tasks import send_order_confirmation_email, send_welcome_email
from app.workers.tasks.shipping_tasks import notify_shipment_update


class NotificationService:
    @staticmethod
    def welcome(user_email: str, user_name: str) -> None:
        send_welcome_email.delay(user_email, user_name)

    @staticmethod
    def order_confirmed(order_id: str, user_email: str, order_number: str) -> None:
        send_order_confirmation_email.delay(order_id, user_email, order_number)

    @staticmethod
    def shipment_update(order_id: str, status: str, tracking_url: str | None) -> None:
        notify_shipment_update.delay(order_id, status, tracking_url)
