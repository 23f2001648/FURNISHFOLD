"""Generic offset pagination helper shared by every list endpoint."""
import math
from typing import Sequence, TypeVar

from pydantic import BaseModel
from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.schemas.common import PaginatedResponse

T = TypeVar("T")


def clamp_page_size(page_size: int) -> int:
    return max(1, min(page_size, settings.MAX_PAGE_SIZE))


async def paginate(
    db: AsyncSession,
    stmt: Select,
    page: int,
    page_size: int,
    read_schema: type[BaseModel],
) -> PaginatedResponse:
    page = max(page, 1)
    page_size = clamp_page_size(page_size)

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(count_stmt)).scalar_one()

    result = await db.execute(stmt.offset((page - 1) * page_size).limit(page_size))
    rows: Sequence = result.scalars().unique().all()

    return PaginatedResponse(
        items=[read_schema.model_validate(r) for r in rows],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=max(math.ceil(total / page_size), 1),
    )
