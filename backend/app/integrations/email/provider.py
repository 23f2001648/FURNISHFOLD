"""Transactional email sending, provider-switchable via EMAIL_PROVIDER.
Called from workers/tasks/email_tasks.py — never directly from request
handlers, so a slow mail API never blocks an HTTP response."""
import logging
from email.message import EmailMessage

from app.core.config import settings

logger = logging.getLogger(__name__)


async def send_email(to: str, subject: str, html_body: str) -> None:
    if settings.EMAIL_PROVIDER == "sendgrid":
        await _send_via_sendgrid(to, subject, html_body)
    elif settings.EMAIL_PROVIDER == "ses":
        await _send_via_ses(to, subject, html_body)
    else:
        await _send_via_smtp(to, subject, html_body)


async def _send_via_smtp(to: str, subject: str, html_body: str) -> None:
    import aiosmtplib

    message = EmailMessage()
    message["From"] = settings.EMAIL_FROM
    message["To"] = to
    message["Subject"] = subject
    message.set_content("This email requires an HTML-capable client.")
    message.add_alternative(html_body, subtype="html")

    await aiosmtplib.send(
        message,
        hostname=settings.SMTP_HOST,
        port=settings.SMTP_PORT,
        username=settings.SMTP_USER,
        password=settings.SMTP_PASSWORD,
        start_tls=True,
    )


async def _send_via_sendgrid(to: str, subject: str, html_body: str) -> None:
    import httpx

    async with httpx.AsyncClient() as client:
        await client.post(
            "https://api.sendgrid.com/v3/mail/send",
            headers={"Authorization": f"Bearer {settings.SMTP_PASSWORD}"},
            json={
                "personalizations": [{"to": [{"email": to}]}],
                "from": {"email": settings.EMAIL_FROM},
                "subject": subject,
                "content": [{"type": "text/html", "value": html_body}],
            },
        )


async def _send_via_ses(to: str, subject: str, html_body: str) -> None:
    # Lazily imported so boto3 is only required when EMAIL_PROVIDER=ses
    import boto3

    client = boto3.client("ses", region_name=settings.S3_REGION)
    client.send_email(
        Source=settings.EMAIL_FROM,
        Destination={"ToAddresses": [to]},
        Message={
            "Subject": {"Data": subject},
            "Body": {"Html": {"Data": html_body}},
        },
    )
