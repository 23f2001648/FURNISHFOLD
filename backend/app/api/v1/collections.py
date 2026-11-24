"""Curated marketing collections (public read, admin write)."""
from uuid import UUID

from fastapi import APIRouter, status
from sqlalchemy import select

from app.core.dependencies import CurrentAdmin, DbSession
from app.core.exceptions import NotFoundError
from app.models.collection import Collection
from app.repositories.base_repository import BaseRepository
from app.schemas.category import CategoryRead  # reused shape: name/slug/description

router = APIRouter()


class CollectionRepository(BaseRepository[Collection]):
    model = Collection


@router.get("")
async def list_collections(db: DbSession):
    result = await db.execute(select(Collection).where(Collection.is_featured.is_(True)))
    collections = result.scalars().all()
    return [{"id": c.id, "name": c.name, "slug": c.slug, "description": c.description} for c in collections]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_collection(name: str, slug: str, description: str | None, _: CurrentAdmin, db: DbSession):
    collection = await CollectionRepository(db).create(name=name, slug=slug, description=description)
    return {"id": collection.id, "name": collection.name, "slug": collection.slug}


@router.post("/{collection_id}/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def add_product_to_collection(collection_id: UUID, product_id: UUID, _: CurrentAdmin, db: DbSession):
    repo = CollectionRepository(db)
    collection = await repo.get_by_id(collection_id)
    if not collection:
        raise NotFoundError("Collection not found.")
    from app.repositories.product_repository import ProductRepository
    product = await ProductRepository(db).get_by_id(product_id)
    if not product:
        raise NotFoundError("Product not found.")
    collection.products.append(product)
    await db.flush()
