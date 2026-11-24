from app.core.config import settings
from app.integrations.shipping.base import ShippingProvider
from app.integrations.shipping.delhivery import DelhiveryProvider
from app.integrations.shipping.shiprocket import ShiprocketProvider


def get_shipping_provider(carrier: str | None = None) -> ShippingProvider:
    carrier = carrier or settings.SHIPPING_PROVIDER
    if carrier == "delhivery":
        return DelhiveryProvider()
    return ShiprocketProvider()
