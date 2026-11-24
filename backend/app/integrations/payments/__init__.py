"""Factory picking the configured payment gateway so callers never
import a concrete provider class directly."""
from app.core.config import settings
from app.integrations.payments.base import PaymentGateway
from app.integrations.payments.cashfree import CashfreeGateway
from app.integrations.payments.razorpay import RazorpayGateway


def get_payment_gateway(provider: str | None = None) -> PaymentGateway:
    provider = provider or settings.PAYMENT_PROVIDER
    if provider == "cashfree":
        return CashfreeGateway()
    return RazorpayGateway()
