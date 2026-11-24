import uuid

from sqlalchemy import select

from app.models.review import Review
from app.repositories.base_repository import BaseRepository


class ReviewRepository(BaseRepository[Review]):
    model = Review

    async def list_for_product(self, product_id: uuid.UUID) -> list[Review]:
        result = await self.db.execute(
            select(Review).where(Review.product_id == product_id).order_by(Review.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_user_review(self, product_id: uuid.UUID, user_id: uuid.UUID):
        result = await self.db.execute(
            select(Review).where(Review.product_id == product_id, Review.user_id == user_id)
        )
        return result.scalar_one_or_none()
