"""Common interface every shipping carrier adapter implements."""
from abc import ABC, abstractmethod
from typing import Any

from app.models.order import Order


class ShippingProvider(ABC):
    @abstractmethod
    async def create_shipment(self, order: Order) -> dict[str, Any]:
        """Books a shipment for the order; returns at least
        {'carrier', 'tracking_number', 'tracking_url'}."""

    @abstractmethod
    async def track(self, tracking_number: str) -> dict[str, Any]:
        """Returns the latest tracking status for a shipment."""

    @abstractmethod
    async def cancel_shipment(self, tracking_number: str) -> bool:
        """Cancels a shipment before pickup; returns success."""
