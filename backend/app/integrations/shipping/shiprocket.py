"""Shiprocket adapter. Authenticates with email/password to get a bearer
token, then books shipments via their REST API."""
from typing import Any

import httpx

from app.core.config import settings
from app.integrations.shipping.base import ShippingProvider
from app.models.order import Order

SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external"


class ShiprocketProvider(ShippingProvider):
    def __init__(self):
        self.email = settings.SHIPROCKET_EMAIL
        self.password = settings.SHIPROCKET_PASSWORD
        self._token: str | None = None

    async def _authenticate(self) -> str:
        if self._token:
            return self._token
        async with httpx.AsyncClient(base_url=SHIPROCKET_BASE_URL) as client:
            response = await client.post("/auth/login", json={"email": self.email, "password": self.password})
            response.raise_for_status()
            self._token = response.json()["token"]
        return self._token

    async def create_shipment(self, order: Order) -> dict[str, Any]:
        token = await self._authenticate()
        payload = {
            "order_id": order.order_number,
            "order_date": order.created_at.strftime("%Y-%m-%d"),
            "billing_customer_name": order.shipping_address.full_name,
            "billing_address": order.shipping_address.line1,
            "billing_city": order.shipping_address.city,
            "billing_state": order.shipping_address.state,
            "billing_pincode": order.shipping_address.postal_code,
            "billing_phone": order.shipping_address.phone,
            "order_items": [
                {"name": i.product_title_snapshot, "units": i.quantity, "selling_price": str(i.unit_price)}
                for i in order.items
            ],
            "payment_method": "Prepaid",
            "sub_total": str(order.subtotal),
        }
        async with httpx.AsyncClient(base_url=SHIPROCKET_BASE_URL, headers={"Authorization": f"Bearer {token}"}) as client:
            response = await client.post("/orders/create/adhoc", json=payload)
            response.raise_for_status()
            data = response.json()
        return {
            "carrier": "shiprocket",
            "tracking_number": str(data.get("shipment_id", "")),
            "tracking_url": f"https://shiprocket.co/tracking/{data.get('shipment_id', '')}",
        }

    async def track(self, tracking_number: str) -> dict[str, Any]:
        token = await self._authenticate()
        async with httpx.AsyncClient(base_url=SHIPROCKET_BASE_URL, headers={"Authorization": f"Bearer {token}"}) as client:
            response = await client.get(f"/courier/track/shipment/{tracking_number}")
            response.raise_for_status()
            return response.json()

    async def cancel_shipment(self, tracking_number: str) -> bool:
        token = await self._authenticate()
        async with httpx.AsyncClient(base_url=SHIPROCKET_BASE_URL, headers={"Authorization": f"Bearer {token}"}) as client:
            response = await client.post("/orders/cancel", json={"ids": [tracking_number]})
            return response.status_code == 200
