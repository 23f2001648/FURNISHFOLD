"""WhatsApp order notifications via the Meta Cloud API (WhatsApp Business
Platform). Used for order confirmation / shipping updates alongside email."""
import logging

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

GRAPH_API_BASE = "https://graph.facebook.com/v19.0"


async def send_whatsapp_message(to_phone: str, template_name: str, params: list[str]) -> None:
    if not settings.WHATSAPP_ACCESS_TOKEN or not settings.WHATSAPP_PHONE_NUMBER_ID:
        logger.info("WhatsApp not configured; skipping message to %s (%s)", to_phone, template_name)
        return

    url = f"{GRAPH_API_BASE}/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
    payload = {
        "messaging_product": "whatsapp",
        "to": to_phone,
        "type": "template",
        "template": {
            "name": template_name,
            "language": {"code": "en"},
            "components": [{"type": "body", "parameters": [{"type": "text", "text": p} for p in params]}],
        },
    }
    headers = {"Authorization": f"Bearer {settings.WHATSAPP_ACCESS_TOKEN}"}
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        if response.status_code >= 400:
            logger.warning("WhatsApp send failed: %s", response.text)
