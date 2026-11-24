"""Curated/marketing collections (e.g. 'Small Spaces', 'Work From Home')
that group products across categories — many-to-many with Product."""
import uuid
from typing import List, Optional

from sqlalchemy import String, Table, Text, Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKeyMixin

collection_products = Table(
    "collection_products",
    Base.metadata,
    Column("collection_id", PGUUID(as_uuid=True), ForeignKey("collections.id", ondelete="CASCADE"), primary_key=True),
    Column("product_id", PGUUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), primary_key=True),
)


class Collection(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "collections"

    name: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(140), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_featured: Mapped[bool] = mapped_column(default=False)

    products: Mapped[List["Product"]] = relationship(secondary=collection_products, back_populates="collections")
