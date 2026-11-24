import uuid

from pydantic import BaseModel, ConfigDict

from app.models.address import AddressType


class AddressBase(BaseModel):
    type: AddressType = AddressType.SHIPPING
    full_name: str
    phone: str
    line1: str
    line2: str | None = None
    city: str
    state: str
    postal_code: str
    country: str = "India"
    is_default: bool = False


class AddressCreate(AddressBase):
    pass


class AddressUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    line1: str | None = None
    line2: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    is_default: bool | None = None


class AddressRead(AddressBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
