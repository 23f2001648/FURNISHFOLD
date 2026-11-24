"""Unit tests for the coupon/order pricing math in app.utils.pricing —
no DB or app startup needed, pure function tests."""
from decimal import Decimal

from app.models.coupon import Coupon, DiscountType
from app.utils.pricing import calculate_discount, calculate_order_totals, calculate_shipping


def _coupon(discount_type, value, min_order=Decimal("0"), max_discount=None) -> Coupon:
    return Coupon(
        code="TEST10", discount_type=discount_type, discount_value=value,
        min_order_amount=min_order, max_discount_amount=max_discount, is_active=True,
    )


def test_percentage_discount_applies_correctly():
    coupon = _coupon(DiscountType.PERCENTAGE, Decimal("10"))
    assert calculate_discount(Decimal("1000.00"), coupon) == Decimal("100.00")


def test_flat_discount_is_capped_at_subtotal():
    coupon = _coupon(DiscountType.FLAT, Decimal("5000.00"))
    assert calculate_discount(Decimal("1000.00"), coupon) == Decimal("1000.00")


def test_discount_respects_minimum_order_amount():
    coupon = _coupon(DiscountType.FLAT, Decimal("100.00"), min_order=Decimal("2000.00"))
    assert calculate_discount(Decimal("1000.00"), coupon) == Decimal("0.00")


def test_max_discount_amount_cap():
    coupon = _coupon(DiscountType.PERCENTAGE, Decimal("50"), max_discount=Decimal("200.00"))
    assert calculate_discount(Decimal("1000.00"), coupon) == Decimal("200.00")


def test_free_shipping_above_threshold():
    assert calculate_shipping(Decimal("5000.00")) == Decimal("0.00")
    assert calculate_shipping(Decimal("1000.00")) == Decimal("199.00")


def test_order_totals_shape():
    totals = calculate_order_totals(Decimal("3000.00"), None)
    assert set(totals) == {"subtotal", "discount_amount", "shipping_amount", "tax_amount", "total_amount"}
    assert totals["subtotal"] == Decimal("3000.00")
