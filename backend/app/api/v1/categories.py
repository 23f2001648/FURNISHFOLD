"""Public category browsing + admin category management."""
from uuid import UUID

from fastapi import APIRouter, status
from sqlalchemy import select

from app.core.dependencies import CurrentAdmin, DbSession
from app.core.exceptions import NotFoundError
from app.models.category import Category
from app.repositories.base_repository import BaseRepository
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate

router = APIRouter()


class CategoryRepository(BaseRepository[Category]):
    model = Category


@router.get("", response_model=list[CategoryRead])
async def list_categories(db: DbSession):
    result = await db.execute(select(Category))
    return list(result.scalars().all())


@router.get("/{slug}", response_model=CategoryRead)
async def get_category(slug: str, db: DbSession):
    result = await db.execute(select(Category).where(Category.slug == slug))
    category = result.scalar_one_or_none()
    if not category:
        raise NotFoundError("Category not found.")
    return category


@router.post("", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
async def create_category(data: CategoryCreate, _: CurrentAdmin, db: DbSession):
    return await CategoryRepository(db).create(**data.model_dump())


@router.patch("/{category_id}", response_model=CategoryRead)
async def update_category(category_id: UUID, data: CategoryUpdate, _: CurrentAdmin, db: DbSession):
    repo = CategoryRepository(db)
    category = await repo.get_by_id(category_id)
    if not category:
        raise NotFoundError("Category not found.")
    return await repo.update(category, **data.model_dump(exclude_unset=True))


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(category_id: UUID, _: CurrentAdmin, db: DbSession):
    repo = CategoryRepository(db)
    category = await repo.get_by_id(category_id)
    if not category:
        raise NotFoundError("Category not found.")
    await repo.delete(category)
