"""Coupon discount and order total calculations, kept in one place so the
cart preview and the actual order-creation flow can never disagree."""
from decimal import ROUND_HALF_UP, Decimal

from app.models.coupon import Coupon, DiscountType

TAX_RATE = Decimal("0.18")  # 18% GST, flat rate placeholder — swap for HSN-based rates later
FLAT_SHIPPING_FEE = Decimal("199.00")
FREE_SHIPPING_THRESHOLD = Decimal("4999.00")


def round_money(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def calculate_discount(subtotal: Decimal, coupon: Coupon | None) -> Decimal:
    if not coupon or not coupon.is_active:
        return Decimal("0.00")
    if subtotal < coupon.min_order_amount:
        return Decimal("0.00")

    if coupon.discount_type == DiscountType.FLAT:
        discount = coupon.discount_value
    else:
        discount = subtotal * (coupon.discount_value / Decimal("100"))

    if coupon.max_discount_amount is not None:
        discount = min(discount, coupon.max_discount_amount)

    return round_money(min(discount, subtotal))


def calculate_shipping(subtotal_after_discount: Decimal) -> Decimal:
    return Decimal("0.00") if subtotal_after_discount >= FREE_SHIPPING_THRESHOLD else FLAT_SHIPPING_FEE


def calculate_tax(taxable_amount: Decimal) -> Decimal:
    return round_money(taxable_amount * TAX_RATE)


def calculate_order_totals(subtotal: Decimal, coupon: Coupon | None) -> dict:
    discount = calculate_discount(subtotal, coupon)
    after_discount = subtotal - discount
    shipping = calculate_shipping(after_discount)
    tax = calculate_tax(after_discount)
    total = round_money(after_discount + shipping + tax)
    return {
        "subtotal": round_money(subtotal),
        "discount_amount": discount,
        "shipping_amount": shipping,
        "tax_amount": tax,
        "total_amount": total,
    }
