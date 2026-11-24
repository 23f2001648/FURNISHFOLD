"""A purchasable SKU of a product (e.g. 'Origami Foldable Desk — Walnut, Wall-mount').
Price, stock and the cart/order line items all key off the variant, not the product."""
import uuid
from typing import Optional

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKeyMixin


class ProductVariant(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "product_variants"

    product_id: Mapped[uuid.UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"))
    sku: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    color: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)
    size: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    compare_at_price: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), nullable=True)
    weight_kg: Mapped[Optional[float]] = mapped_column(Numeric(6, 2), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)

    product: Mapped["Product"] = relationship(back_populates="variants")
    inventory: Mapped[Optional["Inventory"]] = relationship(back_populates="variant", uselist=False, cascade="all, delete-orphan")
    cart_items: Mapped[list["CartItem"]] = relationship(back_populates="variant")
    order_items: Mapped[list["OrderItem"]] = relationship(back_populates="variant")
