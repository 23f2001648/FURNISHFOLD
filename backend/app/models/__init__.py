"""
Import every model module here so (a) Alembic's autogenerate sees the
full metadata, and (b) SQLAlchemy can resolve the string-based
relationship() references between files regardless of import order.
"""
from app.models.user import User, UserRole
from app.models.address import Address, AddressType
from app.models.category import Category
from app.models.collection import Collection, collection_products
from app.models.product import Product, SpaceSize, Portability
from app.models.product_variant import ProductVariant
from app.models.product_image import ProductImage
from app.models.inventory import Inventory
from app.models.cart import Cart
from app.models.cart_item import CartItem
from app.models.wishlist import Wishlist
from app.models.order import Order, OrderStatus, PaymentStatus
from app.models.order_item import OrderItem
from app.models.payment import Payment, PaymentProvider, PaymentState
from app.models.shipment import Shipment, ShipmentStatus
from app.models.coupon import Coupon, DiscountType
from app.models.review import Review
from app.models.audit_log import AuditLog

__all__ = [
    "User", "UserRole", "Address", "AddressType", "Category", "Collection",
    "collection_products", "Product", "SpaceSize", "Portability",
    "ProductVariant", "ProductImage", "Inventory", "Cart", "CartItem",
    "Wishlist", "Order", "OrderStatus", "PaymentStatus", "OrderItem",
    "Payment", "PaymentProvider", "PaymentState", "Shipment", "ShipmentStatus",
    "Coupon", "DiscountType", "Review", "AuditLog",
]
