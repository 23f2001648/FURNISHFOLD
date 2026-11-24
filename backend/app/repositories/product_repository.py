import uuid
from decimal import Decimal
from typing import Optional

from sqlalchemy import Select, or_, select
from sqlalchemy.orm import selectinload

from app.models.category import Category
from app.models.product import Portability, Product, SpaceSize
from app.models.product_variant import ProductVariant
from app.repositories.base_repository import BaseRepository


class ProductRepository(BaseRepository[Product]):
    model = Product

    def _with_relations(self) -> Select:
        return select(Product).options(
            selectinload(Product.images),
            selectinload(Product.variants).selectinload(ProductVariant.inventory),
            selectinload(Product.category),
        )

    async def get_by_slug(self, slug: str) -> Optional[Product]:
        stmt = self._with_relations().where(Product.slug == slug)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def slug_exists(self, slug: str) -> bool:
        result = await self.db.execute(select(Product.id).where(Product.slug == slug))
        return result.scalar_one_or_none() is not None

    def build_filtered_query(
        self,
        category_slug: Optional[str] = None,
        space_size: Optional[SpaceSize] = None,
        portability: Optional[Portability] = None,
        min_price: Optional[Decimal] = None,
        max_price: Optional[Decimal] = None,
        search: Optional[str] = None,
        active_only: bool = True,
    ) -> Select:
        stmt = self._with_relations()
        if active_only:
            stmt = stmt.where(Product.is_active.is_(True))
        if category_slug:
            stmt = stmt.join(Category).where(Category.slug == category_slug)
        if space_size:
            stmt = stmt.where(Product.space_size == space_size)
        if portability:
            stmt = stmt.where(Product.portability == portability)
        if min_price is not None:
            stmt = stmt.where(Product.base_price >= min_price)
        if max_price is not None:
            stmt = stmt.where(Product.base_price <= max_price)
        if search:
            like = f"%{search}%"
            stmt = stmt.where(or_(Product.title.ilike(like), Product.description.ilike(like)))
        return stmt.order_by(Product.created_at.desc())
