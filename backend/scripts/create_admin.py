"""One-off CLI script to create the first admin user.
Usage:
    python -m scripts.create_admin admin@furnishfoldz.in "StrongPass123" "Admin User"
"""
import asyncio
import sys

from app.core.database import AsyncSessionLocal
from app.core.security import hash_password
from app.models.user import User, UserRole
from app.repositories.user_repository import UserRepository


async def main(email: str, password: str, name: str) -> None:
    async with AsyncSessionLocal() as db:
        repo = UserRepository(db)
        if await repo.email_exists(email):
            print(f"A user with email {email} already exists.")
            return
        user = User(name=name, email=email, password_hash=hash_password(password), role=UserRole.ADMIN, is_active=True)
        db.add(user)
        await db.commit()
        print(f"Admin user created: {email}")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python -m scripts.create_admin <email> <password> <name>")
        sys.exit(1)
    asyncio.run(main(sys.argv[1], sys.argv[2], sys.argv[3]))
