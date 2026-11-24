"""Celery tasks that send transactional emails, keeping any provider
latency off the request/response cycle."""
import asyncio

from app.integrations.email.provider import send_email
from app.workers.celery_app import celery_app


@celery_app.task(name="email.send_welcome", max_retries=3, default_retry_delay=30)
def send_welcome_email(user_email: str, user_name: str) -> None:
    asyncio.run(send_email(
        to=user_email,
        subject="Welcome to FurnishFoldz",
        html_body=f"<p>Hi {user_name},</p><p>Welcome to FurnishFoldz — space-saving furniture for modern homes.</p>",
    ))


@celery_app.task(name="email.send_order_confirmation", max_retries=3, default_retry_delay=30)
def send_order_confirmation_email(order_id: str, user_email: str, order_number: str) -> None:
    asyncio.run(send_email(
        to=user_email,
        subject=f"Order confirmed — {order_number}",
        html_body=f"<p>Thanks for your order! Your FurnishFoldz order <strong>{order_number}</strong> is confirmed.</p>",
    ))
