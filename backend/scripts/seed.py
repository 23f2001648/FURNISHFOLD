"""Seeds categories and a handful of FurnishFoldz products so the API
and admin dashboard have something to show right after setup.
Usage: python -m scripts.seed
"""
import asyncio

from app.core.database import AsyncSessionLocal
from app.models.category import Category
from app.models.inventory import Inventory
from app.models.product import Portability, Product, SpaceSize
from app.models.product_variant import ProductVariant
from app.utils.slug import slugify

CATEGORIES = [
    "Kids Table", "Whiteboard Study Table", "Laptop Table",
    "Computer Table", "Modern Study Table", "Foldable Study Desk",
]

PRODUCTS = [
    ("Nimbus Kids Table", "Kids Table", 2499, SpaceSize.COMPACT, Portability.FOLDABLE),
    ("Slate Whiteboard Desk", "Whiteboard Study Table", 4299, SpaceSize.STANDARD, Portability.WHEELED),
    ("Perch Laptop Table", "Laptop Table", 1899, SpaceSize.COMPACT, Portability.FOLDABLE),
    ("Anchor Computer Desk", "Computer Table", 6499, SpaceSize.SPACIOUS, Portability.FIXED),
    ("Meridian Study Table", "Modern Study Table", 3799, SpaceSize.STANDARD, Portability.FIXED),
    ("Origami Foldable Desk", "Foldable Study Desk", 3299, SpaceSize.COMPACT, Portability.FOLDABLE),
]


async def main() -> None:
    async with AsyncSessionLocal() as db:
        category_map = {}
        for name in CATEGORIES:
            category = Category(name=name, slug=slugify(name))
            db.add(category)
            await db.flush()
            category_map[name] = category

        for title, cat_name, price, space, portability in PRODUCTS:
            product = Product(
                title=title,
                slug=slugify(title),
                description=f"{title} — multipurpose, foldable furniture from FurnishFoldz.",
                base_price=price,
                category_id=category_map[cat_name].id,
                space_size=space,
                portability=portability,
                features=["Space-saving fold", "Elegant finish", "Easy to move"],
            )
            db.add(product)
            await db.flush()

            variant = ProductVariant(product_id=product.id, sku=f"{slugify(title).upper()}-STD", price=price)
            db.add(variant)
            await db.flush()
            db.add(Inventory(variant_id=variant.id, quantity_on_hand=50))

        await db.commit()
        print(f"Seeded {len(CATEGORIES)} categories and {len(PRODUCTS)} products.")


if __name__ == "__main__":
    asyncio.run(main())
