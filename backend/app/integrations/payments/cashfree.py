"""Cashfree adapter. Wraps Cashfree's Orders API via plain HTTP calls so
no extra SDK dependency is required; set CASHFREE_APP_ID / CASHFREE_SECRET_KEY."""
import hashlib
import hmac
from decimal import Decimal
from typing import Any

import httpx

from app.core.config import settings
from app.integrations.payments.base import PaymentGateway

CASHFREE_BASE_URL = "https://api.cashfree.com/pg"


class CashfreeGateway(PaymentGateway):
    def __init__(self):
        self.app_id = settings.CASHFREE_APP_ID
        self.secret_key = settings.CASHFREE_SECRET_KEY

    def _headers(self) -> dict[str, str]:
        return {
            "x-client-id": self.app_id or "",
            "x-client-secret": self.secret_key or "",
            "x-api-version": "2023-08-01",
            "Content-Type": "application/json",
        }

    async def create_order(self, amount: Decimal, currency: str, receipt: str) -> dict[str, Any]:
        async with httpx.AsyncClient(base_url=CASHFREE_BASE_URL, headers=self._headers()) as client:
            response = await client.post(
                "/orders",
                json={"order_id": receipt, "order_amount": float(amount), "order_currency": currency},
            )
            response.raise_for_status()
            data = response.json()
        return {"provider_order_id": data.get("order_id", receipt), "key_id": self.app_id}

    def verify_signature(self, provider_order_id: str, provider_payment_id: str, signature: str) -> bool:
        payload = f"{provider_order_id}{provider_payment_id}"
        expected = hmac.new(self.secret_key.encode(), payload.encode(), hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature)

    async def refund(self, provider_payment_id: str, amount: Decimal) -> dict[str, Any]:
        async with httpx.AsyncClient(base_url=CASHFREE_BASE_URL, headers=self._headers()) as client:
            response = await client.post(
                f"/orders/{provider_payment_id}/refunds",
                json={"refund_amount": float(amount), "refund_id": f"rfnd_{provider_payment_id}"},
            )
            response.raise_for_status()
            return response.json()
