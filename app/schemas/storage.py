from pydantic import BaseModel


class UploadResponse(BaseModel):
    url: str
