import uuid

from pydantic import BaseModel, ConfigDict

from app.models.shipment import ShipmentStatus


class ShipmentCreate(BaseModel):
    carrier: str | None = None  # defaults to settings.SHIPPING_PROVIDER


class ShipmentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    carrier: str
    tracking_number: str | None
    tracking_url: str | None
    status: ShipmentStatus
    estimated_delivery: str | None


class ShipmentStatusUpdate(BaseModel):
    status: ShipmentStatus
    tracking_number: str | None = None
    tracking_url: str | None = None
