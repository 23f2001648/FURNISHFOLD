"""Turn free-text titles into URL-safe, unique slugs."""
import re
import unicodedata


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^\w\s-]", "", value).strip().lower()
    return re.sub(r"[\s_-]+", "-", value)


async def unique_slug(base_title: str, exists_fn) -> str:
    """`exists_fn(slug) -> awaitable[bool]` checks DB uniqueness; appends -2, -3, ... on collision."""
    slug = slugify(base_title)
    candidate = slug
    counter = 2
    while await exists_fn(candidate):
        candidate = f"{slug}-{counter}"
        counter += 1
    return candidate
