import os

import aiofiles
from fastapi import UploadFile

from app.services.storage.base import AbstractStorageService


class LocalStorageService(AbstractStorageService):
    def __init__(
        self,
        upload_dir: str = "static/uploads",
        base_url: str = "/static/uploads",
    ):
        self.upload_dir = upload_dir
        self.base_url = base_url
        os.makedirs(self.upload_dir, exist_ok=True)

    async def upload(self, file: UploadFile, filename: str, content_type: str) -> str:
        file_path = os.path.join(self.upload_dir, filename)

        async with aiofiles.open(file_path, "wb") as out_file:
            content = await file.read()
            await out_file.write(content)

        return f"{self.base_url.rstrip('/')}/{filename}"

    async def delete(self, url: str) -> bool:
        filename = url.split("/")[-1]
        file_path = os.path.join(self.upload_dir, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
