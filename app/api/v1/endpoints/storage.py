import uuid

from fastapi import APIRouter, Depends, File, UploadFile

from app.core.validators import IMAGE_VALIDATOR
from app.schemas.storage import UploadResponse
from app.services.storage.base import AbstractStorageService
from app.services.storage.factory import get_storage_service

router = APIRouter()


@router.post("/upload", response_model=UploadResponse, operation_id="upload_file")
async def upload_file(
    file: UploadFile = File(...),
    storage: AbstractStorageService = Depends(get_storage_service),
):
    if file.filename:
        await IMAGE_VALIDATOR.validate(file)
        unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    else:
        unique_filename = f"{uuid.uuid4().hex}"

    url = await storage.upload(
        file=file,
        filename=unique_filename,
        content_type=file.content_type or "application/octet-stream",
    )
    return UploadResponse(url=url)
