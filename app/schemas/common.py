from typing import Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    status_code: int = Field(default=200, examples=[200])
    message: str = "Operation completed successfully"
    data: T | None = None


class PaginatedData(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    size: int


class PaginatedAPIResponse(APIResponse[PaginatedData[T]], Generic[T]):
    pass
