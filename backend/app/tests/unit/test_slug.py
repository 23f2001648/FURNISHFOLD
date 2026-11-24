from app.utils.slug import slugify


def test_slugify_basic():
    assert slugify("Origami Foldable Desk") == "origami-foldable-desk"


def test_slugify_strips_special_characters():
    assert slugify("Kid's Table & Chair!") == "kids-table-chair"


def test_slugify_collapses_whitespace():
    assert slugify("  Multi   Space   Title ") == "multi-space-title"
