"""Razorpay adapter. Wraps the `razorpay` SDK — install with
`pip install razorpay` and set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET."""
import hmac
import hashlib
from decimal import Decimal
from typing import Any

from app.core.config import settings
from app.integrations.payments.base import PaymentGateway


class RazorpayGateway(PaymentGateway):
    def __init__(self):
        self.key_id = settings.RAZORPAY_KEY_ID
        self.key_secret = settings.RAZORPAY_KEY_SECRET

    def _client(self):
        import razorpay  # lazy import so the SDK is optional until configured
        return razorpay.Client(auth=(self.key_id, self.key_secret))

    async def create_order(self, amount: Decimal, currency: str, receipt: str) -> dict[str, Any]:
        order = self._client().order.create(
            {"amount": int(amount * 100), "currency": currency, "receipt": receipt, "payment_capture": 1}
        )
        return {"provider_order_id": order["id"], "key_id": self.key_id}

    def verify_signature(self, provider_order_id: str, provider_payment_id: str, signature: str) -> bool:
        payload = f"{provider_order_id}|{provider_payment_id}"
        expected = hmac.new(
            self.key_secret.encode(), payload.encode(), hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected, signature)

    async def refund(self, provider_payment_id: str, amount: Decimal) -> dict[str, Any]:
        return self._client().payment.refund(provider_payment_id, {"amount": int(amount * 100)})
