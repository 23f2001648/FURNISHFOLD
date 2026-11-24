"""Product reviews: public read per product, authenticated create."""
from uuid import UUID

from fastapi import APIRouter, status

from app.core.dependencies import CurrentUser, DbSession
from app.repositories.review_repository import ReviewRepository
from app.schemas.review import ReviewCreate, ReviewRead
from app.services.review_service import ReviewService

router = APIRouter()


@router.get("/product/{product_id}", response_model=list[ReviewRead])
async def list_product_reviews(product_id: UUID, db: DbSession):
    return await ReviewRepository(db).list_for_product(product_id)


@router.post("/product/{product_id}", response_model=ReviewRead, status_code=status.HTTP_201_CREATED)
async def create_review(product_id: UUID, data: ReviewCreate, current_user: CurrentUser, db: DbSession):
    return await ReviewService(db).create(product_id, current_user.id, data)
