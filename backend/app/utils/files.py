"""File upload helper abstracting local disk vs S3 storage so product-image
upload endpoints don't care which backend is configured."""
import uuid
from pathlib import Path

from fastapi import UploadFile

from app.core.config import settings


async def save_upload(file: UploadFile, subfolder: str = "products") -> str:
    """Persists the file and returns its public URL."""
    ext = Path(file.filename or "").suffix or ".bin"
    filename = f"{uuid.uuid4().hex}{ext}"

    if settings.STORAGE_BACKEND == "s3":
        return await _save_to_s3(file, subfolder, filename)
    return await _save_to_local(file, subfolder, filename)


async def _save_to_local(file: UploadFile, subfolder: str, filename: str) -> str:
    target_dir = Path(settings.LOCAL_STORAGE_DIR) / subfolder
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / filename
    content = await file.read()
    target_path.write_bytes(content)
    base = settings.PUBLIC_ASSET_BASE_URL or "/static"
    return f"{base}/{subfolder}/{filename}"


async def _save_to_s3(file: UploadFile, subfolder: str, filename: str) -> str:
    # Lazily imported so boto3 is only required when STORAGE_BACKEND=s3.
    import boto3

    client = boto3.client(
        "s3",
        region_name=settings.S3_REGION,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )
    key = f"{subfolder}/{filename}"
    content = await file.read()
    client.put_object(Bucket=settings.S3_BUCKET_NAME, Key=key, Body=content, ContentType=file.content_type)
    base = settings.PUBLIC_ASSET_BASE_URL or f"https://{settings.S3_BUCKET_NAME}.s3.amazonaws.com"
    return f"{base}/{key}"
