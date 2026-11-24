"""The logged-in customer's own profile + saved addresses."""
from uuid import UUID

from fastapi import APIRouter, status

from app.core.dependencies import CurrentUser, DbSession
from app.core.exceptions import NotFoundError
from app.repositories.user_repository import UserRepository
from app.schemas.address import AddressCreate, AddressRead, AddressUpdate
from app.schemas.user import UserRead, UserUpdate

router = APIRouter()


@router.get("/me", response_model=UserRead)
async def get_me(current_user: CurrentUser):
    return current_user


@router.patch("/me", response_model=UserRead)
async def update_me(data: UserUpdate, current_user: CurrentUser, db: DbSession):
    return await UserRepository(db).update(current_user, **data.model_dump(exclude_unset=True))


@router.get("/me/addresses", response_model=list[AddressRead])
async def list_addresses(current_user: CurrentUser):
    return current_user.addresses


@router.post("/me/addresses", response_model=AddressRead, status_code=status.HTTP_201_CREATED)
async def add_address(data: AddressCreate, current_user: CurrentUser, db: DbSession):
    from app.models.address import Address
    address = Address(user_id=current_user.id, **data.model_dump())
    db.add(address)
    await db.flush()
    await db.refresh(address)
    return address


@router.patch("/me/addresses/{address_id}", response_model=AddressRead)
async def update_address(address_id: UUID, data: AddressUpdate, current_user: CurrentUser, db: DbSession):
    address = next((a for a in current_user.addresses if a.id == address_id), None)
    if not address:
        raise NotFoundError("Address not found.")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(address, key, value)
    await db.flush()
    await db.refresh(address)
    return address


@router.delete("/me/addresses/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_address(address_id: UUID, current_user: CurrentUser, db: DbSession):
    address = next((a for a in current_user.addresses if a.id == address_id), None)
    if not address:
        raise NotFoundError("Address not found.")
    await db.delete(address)
    await db.flush()
