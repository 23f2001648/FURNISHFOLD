"""Saved-for-later products."""
from uuid import UUID

from fastapi import APIRouter, status
from sqlalchemy import select

from app.core.dependencies import CurrentUser, DbSession
from app.core.exceptions import ConflictError, NotFoundError
from app.models.wishlist import Wishlist

router = APIRouter()


@router.get("")
async def list_wishlist(current_user: CurrentUser, db: DbSession):
    result = await db.execute(select(Wishlist).where(Wishlist.user_id == current_user.id))
    items = result.scalars().all()
    return [{"id": i.id, "product_id": i.product_id} for i in items]


@router.post("/{product_id}", status_code=status.HTTP_201_CREATED)
async def add_to_wishlist(product_id: UUID, current_user: CurrentUser, db: DbSession):
    existing = await db.execute(
        select(Wishlist).where(Wishlist.user_id == current_user.id, Wishlist.product_id == product_id)
    )
    if existing.scalar_one_or_none():
        raise ConflictError("Already in your wishlist.")
    item = Wishlist(user_id=current_user.id, product_id=product_id)
    db.add(item)
    await db.flush()
    return {"id": item.id, "product_id": item.product_id}


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_wishlist(product_id: UUID, current_user: CurrentUser, db: DbSession):
    result = await db.execute(
        select(Wishlist).where(Wishlist.user_id == current_user.id, Wishlist.product_id == product_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise NotFoundError("Not in your wishlist.")
    await db.delete(item)
    await db.flush()
