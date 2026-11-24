"""Celery application instance. Run the worker with:
    celery -A app.workers.celery_app worker --loglevel=info
and (optionally) the beat scheduler with:
    celery -A app.workers.celery_app beat --loglevel=info
"""
from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "furnishfoldz",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=[
        "app.workers.tasks.order_tasks",
        "app.workers.tasks.email_tasks",
        "app.workers.tasks.invoice_tasks",
        "app.workers.tasks.shipping_tasks",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_default_retry_delay=30,
)
