import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.product import Portability, SpaceSize


class ProductImageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    url: str
    alt_text: str
    sort_order: int
    is_primary: bool


class ProductVariantBase(BaseModel):
    sku: str
    color: str | None = None
    size: str | None = None
    price: Decimal
    compare_at_price: Decimal | None = None
    weight_kg: Decimal | None = None


class ProductVariantCreate(ProductVariantBase):
    initial_stock: int = Field(default=0, ge=0)


class ProductVariantUpdate(BaseModel):
    price: Decimal | None = None
    compare_at_price: Decimal | None = None
    is_active: bool | None = None


class ProductVariantRead(ProductVariantBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    product_id: uuid.UUID
    is_active: bool
    quantity_available: int = 0


class ProductBase(BaseModel):
    title: str
    slug: str
    description: str | None = None
    base_price: Decimal
    category_id: uuid.UUID
    space_size: SpaceSize = SpaceSize.STANDARD
    portability: Portability = Portability.FIXED
    features: list[str] | None = None
    model_3d_url: str | None = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    base_price: Decimal | None = None
    category_id: uuid.UUID | None = None
    space_size: SpaceSize | None = None
    portability: Portability | None = None
    features: list[str] | None = None
    model_3d_url: str | None = None
    is_active: bool | None = None


class ProductRead(ProductBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    is_active: bool
    avg_rating: Decimal
    review_count: int
    created_at: datetime
    images: list[ProductImageRead] = []
    variants: list[ProductVariantRead] = []


class ProductListItem(BaseModel):
    """Lighter-weight shape used for catalogue/listing endpoints."""
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    title: str
    slug: str
    base_price: Decimal
    space_size: SpaceSize
    portability: Portability
    avg_rating: Decimal
    review_count: int
    primary_image_url: str | None = None


class ProductFilterParams(BaseModel):
    category_slug: str | None = None
    space_size: SpaceSize | None = None
    portability: Portability | None = None
    min_price: Decimal | None = None
    max_price: Decimal | None = None
    search: str | None = None
