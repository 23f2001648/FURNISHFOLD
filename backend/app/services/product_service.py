"""Catalogue business logic: creating products/variants with slug
generation, and building the filtered listing query for the API layer."""
from decimal import Decimal
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models.inventory import Inventory
from app.models.product import Portability, Product, SpaceSize
from app.models.product_variant import ProductVariant
from app.repositories.product_repository import ProductRepository
from app.schemas.product import ProductCreate, ProductUpdate, ProductVariantCreate
from app.utils.slug import unique_slug


class ProductService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.products = ProductRepository(db)

    async def create_product(self, data: ProductCreate) -> Product:
        slug = data.slug or await unique_slug(data.title, self.products.slug_exists)
        product = await self.products.create(**{**data.model_dump(exclude={"slug"}), "slug": slug})
        return product

    async def update_product(self, product_id, data: ProductUpdate) -> Product:
        product = await self.products.get_by_id(product_id)
        if not product:
            raise NotFoundError("Product not found.")
        return await self.products.update(product, **data.model_dump(exclude_unset=True))

    async def get_by_slug(self, slug: str) -> Product:
        product = await self.products.get_by_slug(slug)
        if not product:
            raise NotFoundError("Product not found.")
        return product

    async def add_variant(self, product_id, data: ProductVariantCreate) -> ProductVariant:
        product = await self.products.get_by_id(product_id)
        if not product:
            raise NotFoundError("Product not found.")

        variant = ProductVariant(
            product_id=product.id,
            sku=data.sku,
            color=data.color,
            size=data.size,
            price=data.price,
            compare_at_price=data.compare_at_price,
            weight_kg=data.weight_kg,
        )
        self.db.add(variant)
        await self.db.flush()

        inventory = Inventory(variant_id=variant.id, quantity_on_hand=data.initial_stock)
        self.db.add(inventory)
        await self.db.flush()
        await self.db.refresh(variant)
        return variant

    def filtered_query(
        self,
        category_slug: Optional[str] = None,
        space_size: Optional[SpaceSize] = None,
        portability: Optional[Portability] = None,
        min_price: Optional[Decimal] = None,
        max_price: Optional[Decimal] = None,
        search: Optional[str] = None,
    ):
        return self.products.build_filtered_query(
            category_slug=category_slug,
            space_size=space_size,
            portability=portability,
            min_price=min_price,
            max_price=max_price,
            search=search,
        )
