"""Delhivery adapter, authenticated via a static API token."""
from typing import Any

import httpx

from app.core.config import settings
from app.integrations.shipping.base import ShippingProvider
from app.models.order import Order

DELHIVERY_BASE_URL = "https://track.delhivery.com/api"


class DelhiveryProvider(ShippingProvider):
    def __init__(self):
        self.token = settings.DELHIVERY_API_TOKEN

    def _headers(self) -> dict[str, str]:
        return {"Authorization": f"Token {self.token}", "Content-Type": "application/json"}

    async def create_shipment(self, order: Order) -> dict[str, Any]:
        payload = {
            "shipments": [{
                "name": order.shipping_address.full_name,
                "add": order.shipping_address.line1,
                "city": order.shipping_address.city,
                "state": order.shipping_address.state,
                "pin": order.shipping_address.postal_code,
                "phone": order.shipping_address.phone,
                "order": order.order_number,
                "payment_mode": "Prepaid",
                "total_amount": str(order.total_amount),
            }]
        }
        async with httpx.AsyncClient(base_url=DELHIVERY_BASE_URL, headers=self._headers()) as client:
            response = await client.post("/cmu/create.json", json=payload)
            response.raise_for_status()
            data = response.json()
        waybill = data.get("packages", [{}])[0].get("waybill", "")
        return {
            "carrier": "delhivery",
            "tracking_number": waybill,
            "tracking_url": f"https://www.delhivery.com/track/package/{waybill}",
        }

    async def track(self, tracking_number: str) -> dict[str, Any]:
        async with httpx.AsyncClient(base_url=DELHIVERY_BASE_URL, headers=self._headers()) as client:
            response = await client.get("/v1/packages/json/", params={"waybill": tracking_number})
            response.raise_for_status()
            return response.json()

    async def cancel_shipment(self, tracking_number: str) -> bool:
        async with httpx.AsyncClient(base_url=DELHIVERY_BASE_URL, headers=self._headers()) as client:
            response = await client.post(
                "/p/edit", json={"waybill": tracking_number, "cancellation": True}
            )
            return response.status_code == 200
