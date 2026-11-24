"""Public product catalogue: list with filters (category/space/portability/
price/search), detail by slug, and a review listing per product. Writes
(create/update/variant/image) live here too, guarded by CurrentAdmin —
kept in the same router as the public reads since they're both "products",
with heavier admin-only catalogue bulk-ops under api/v1/admin.py."""
from decimal import Decimal
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, File, Query, UploadFile, status

from app.core.dependencies import CurrentAdmin, DbSession
from app.models.product import Portability, SpaceSize
from app.schemas.common import PaginatedResponse
from app.schemas.product import (
    ProductCreate,
    ProductListItem,
    ProductRead,
    ProductUpdate,
    ProductVariantCreate,
    ProductVariantRead,
)
from app.services.product_service import ProductService
from app.utils.files import save_upload
from app.utils.pagination import paginate

router = APIRouter()


@router.get("", response_model=PaginatedResponse[ProductListItem])
async def list_products(
    db: DbSession,
    category: Optional[str] = None,
    space_size: Optional[SpaceSize] = None,
    portability: Optional[Portability] = None,
    min_price: Optional[Decimal] = None,
    max_price: Optional[Decimal] = None,
    search: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1),
):
    service = ProductService(db)
    stmt = service.filtered_query(category, space_size, portability, min_price, max_price, search)
    return await paginate(db, stmt, page, page_size, ProductListItem)


@router.get("/{slug}", response_model=ProductRead)
async def get_product(slug: str, db: DbSession):
    return await ProductService(db).get_by_slug(slug)


@router.post("", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
async def create_product(data: ProductCreate, _: CurrentAdmin, db: DbSession):
    return await ProductService(db).create_product(data)


@router.patch("/{product_id}", response_model=ProductRead)
async def update_product(product_id: UUID, data: ProductUpdate, _: CurrentAdmin, db: DbSession):
    return await ProductService(db).update_product(product_id, data)


@router.post("/{product_id}/variants", response_model=ProductVariantRead, status_code=status.HTTP_201_CREATED)
async def add_variant(product_id: UUID, data: ProductVariantCreate, _: CurrentAdmin, db: DbSession):
    return await ProductService(db).add_variant(product_id, data)


@router.post("/{product_id}/images", status_code=status.HTTP_201_CREATED)
async def upload_product_image(product_id: UUID, _: CurrentAdmin, db: DbSession, file: UploadFile = File(...)):
    from app.models.product_image import ProductImage
    url = await save_upload(file, subfolder="products")
    image = ProductImage(product_id=product_id, url=url, alt_text=file.filename or "")
    db.add(image)
    await db.flush()
    await db.refresh(image)
    return {"id": image.id, "url": image.url}
