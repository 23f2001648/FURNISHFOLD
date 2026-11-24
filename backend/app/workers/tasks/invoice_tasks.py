"""Generates a PDF invoice for a paid order and stores it, so it can be
attached to the confirmation email or downloaded from the order page."""
import asyncio

from app.workers.celery_app import celery_app


@celery_app.task(name="invoice.generate", max_retries=2)
def generate_invoice_pdf(order_id: str) -> str:
    """Returns the storage URL of the generated invoice.
    PDF rendering (e.g. via weasyprint/reportlab) is intentionally left
    as a TODO — wire in the template + save_upload() from app.utils.files
    once the invoice layout is designed."""
    return asyncio.run(_generate(order_id))


async def _generate(order_id: str) -> str:
    # TODO: fetch order via OrderRepository, render HTML -> PDF, save_upload()
    return f"/static/invoices/{order_id}.pdf"
