"""A shipment/tracking record for an order, created against Shiprocket/Delhivery."""
import enum
import uuid
from typing import Optional

from sqlalchemy import Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKeyMixin


class ShipmentStatus(str, enum.Enum):
    LABEL_CREATED = "label_created"
    PICKED_UP = "picked_up"
    IN_TRANSIT = "in_transit"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    RETURNED = "returned"
    CANCELLED = "cancelled"


class Shipment(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "shipments"

    order_id: Mapped[uuid.UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"))
    carrier: Mapped[str] = mapped_column(String(60))
    tracking_number: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    tracking_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[ShipmentStatus] = mapped_column(Enum(ShipmentStatus, name="shipment_status"), default=ShipmentStatus.LABEL_CREATED)
    estimated_delivery: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)

    order: Mapped["Order"] = relationship(back_populates="shipments")
