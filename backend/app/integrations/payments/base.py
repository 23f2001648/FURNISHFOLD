"""Common interface every payment gateway adapter implements, so
`payment_service.py` can stay provider-agnostic."""
from abc import ABC, abstractmethod
from decimal import Decimal
from typing import Any


class PaymentGateway(ABC):
    @abstractmethod
    async def create_order(self, amount: Decimal, currency: str, receipt: str) -> dict[str, Any]:
        """Create a gateway-side order; returns at least {'provider_order_id', 'key_id'}."""

    @abstractmethod
    def verify_signature(self, provider_order_id: str, provider_payment_id: str, signature: str) -> bool:
        """Verify the webhook/callback signature proving the payment is genuine."""

    @abstractmethod
    async def refund(self, provider_payment_id: str, amount: Decimal) -> dict[str, Any]:
        """Issue a refund; returns the gateway's refund record."""
