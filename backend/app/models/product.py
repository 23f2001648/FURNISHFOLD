"""Core product catalogue entry. Price/stock live on ProductVariant so a
single product (e.g. 'Origami Foldable Desk') can have size/colour
variants, each separately priced and stocked."""
import enum
import uuid
from typing import List, Optional

from sqlalchemy import Boolean, Enum, ForeignKey, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSON as PGJSON
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKeyMixin
from app.models.collection import collection_products


class SpaceSize(str, enum.Enum):
    COMPACT = "compact"
    STANDARD = "standard"
    SPACIOUS = "spacious"


class Portability(str, enum.Enum):
    FOLDABLE = "foldable"
    WHEELED = "wheeled"
    FIXED = "fixed"


class Product(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "products"

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    base_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    category_id: Mapped[uuid.UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("categories.id"))

    space_size: Mapped[SpaceSize] = mapped_column(Enum(SpaceSize, name="space_size"), default=SpaceSize.STANDARD)
    portability: Mapped[Portability] = mapped_column(Enum(Portability, name="portability"), default=Portability.FIXED)
    features: Mapped[Optional[list]] = mapped_column(PGJSON, nullable=True)  # list of feature strings
    model_3d_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    avg_rating: Mapped[float] = mapped_column(Numeric(3, 2), default=0)
    review_count: Mapped[int] = mapped_column(default=0)

    category: Mapped["Category"] = relationship(back_populates="products")
    variants: Mapped[List["ProductVariant"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    images: Mapped[List["ProductImage"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    reviews: Mapped[List["Review"]] = relationship(back_populates="product")
    collections: Mapped[List["Collection"]] = relationship(secondary=collection_products, back_populates="products")
