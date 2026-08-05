from dataclasses import dataclass

from fastapi import UploadFile

from app.core.exceptions import APIError


@dataclass
class FileValidationRule:
    max_size_bytes: int
    allowed_content_types: list[str]

    async def validate(self, file: UploadFile) -> None:
        if file.content_type not in self.allowed_content_types:
            allowed_str = ", ".join(self.allowed_content_types)
            raise APIError(
                f"Invalid file type '{file.content_type}'. Allowed types: {allowed_str}",
                status_code=400,
            )

        actual_size = file.size
        if actual_size is None:
            file.file.seek(0, 2)
            actual_size = file.file.tell()
            file.file.seek(0)

        if actual_size > self.max_size_bytes:
            max_mb = self.max_size_bytes / (1024 * 1024)
            raise APIError(
                f"File size ({round(actual_size / (1024 * 1024), 2)}MB) exceeds maximum limit of {max_mb:.1f}MB",
                status_code=400,
            )


IMAGE_VALIDATOR = FileValidationRule(
    max_size_bytes=2 * 1024 * 1024,
    allowed_content_types=["image/jpeg", "image/png", "image/webp"],
)
