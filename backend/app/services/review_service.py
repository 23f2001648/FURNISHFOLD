"""Review creation + recomputing a product's aggregate rating. Kept
separate from product_service so rating math has a single owner."""
import uuid
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, NotFoundError
from app.models.review import Review
from app.repositories.product_repository import ProductRepository
from app.repositories.review_repository import ReviewRepository
from app.schemas.review import ReviewCreate


class ReviewService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.reviews = ReviewRepository(db)
        self.products = ProductRepository(db)

    async def create(self, product_id: uuid.UUID, user_id: uuid.UUID, data: ReviewCreate) -> Review:
        product = await self.products.get_by_id(product_id)
        if not product:
            raise NotFoundError("Product not found.")
        if await self.reviews.get_user_review(product_id, user_id):
            raise ConflictError("You've already reviewed this product.")

        review = await self.reviews.create(
            product_id=product_id, user_id=user_id, rating=data.rating, title=data.title, body=data.body
        )
        await self._recompute_rating(product_id)
        return review

    async def _recompute_rating(self, product_id: uuid.UUID) -> None:
        stmt = select(func.avg(Review.rating), func.count(Review.id)).where(Review.product_id == product_id)
        avg, count = (await self.db.execute(stmt)).one()
        product = await self.products.get_by_id(product_id)
        product.avg_rating = Decimal(str(round(avg or 0, 2)))
        product.review_count = count
        await self.db.flush()
