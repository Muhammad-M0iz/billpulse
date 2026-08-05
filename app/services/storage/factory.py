from app.core.config import settings
from app.services.storage.base import AbstractStorageService
from app.services.storage.local import LocalStorageService
from app.services.storage.s3 import S3StorageService


def get_storage_service() -> AbstractStorageService:
    if settings.STORAGE_BACKEND == "local":
        return LocalStorageService(
            upload_dir=settings.UPLOAD_DIR, base_url=settings.BASE_URL
        )
    elif settings.STORAGE_BACKEND == "s3":
        return S3StorageService(
            endpoint_url=settings.S3_ENDPOINT_URL,
            public_endpoint_url=settings.PUBLIC_S3_ENDPOINT_URL,
            access_key=settings.AWS_ACCESS_KEY_ID,
            secret_key=settings.AWS_SECRET_ACCESS_KEY,
            bucket_name=settings.S3_BUCKET_NAME,
        )
    raise ValueError(f"Unknown storage backend: {settings.STORAGE_BACKEND}")