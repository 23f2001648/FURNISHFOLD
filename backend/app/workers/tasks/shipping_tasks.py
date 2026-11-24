"""Shipment status sync + customer notification, run on a schedule or
triggered by a carrier webhook."""
import asyncio

from app.integrations.whatsapp.provider import send_whatsapp_message
from app.workers.celery_app import celery_app


@celery_app.task(name="shipping.notify_update", max_retries=3, default_retry_delay=60)
def notify_shipment_update(order_id: str, status: str, tracking_url: str | None) -> None:
    # Phone number lookup intentionally omitted here — wire to
    # OrderRepository once this task is called from a real webhook.
    pass


@celery_app.task(name="shipping.sync_all_in_transit")
def sync_all_in_transit_shipments() -> None:
    """Periodic task (wire up via celery beat schedule) that polls the
    carrier for status updates on every non-terminal shipment."""
    # TODO: query shipments with status in (label_created, picked_up,
    # in_transit) and call ShippingService.sync_status for each.
    pass
