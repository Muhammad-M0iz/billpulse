from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class FeatureBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255, examples=["API Calls"])
    code: str = Field(
        ...,
        min_length=2,
        max_length=100,
        examples=["api_calls"],
    )
    unit_price: Decimal = Field(..., gt=0, decimal_places=2, examples=[0.05])
    max_unit_limit: int = Field(..., gt=0, examples=[1000])
    is_active: bool = Field(default=True)


class FeatureUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=255)
    unit_price: Decimal | None = Field(default=None, gt=0, decimal_places=2)
    max_unit_limit: int | None = Field(default=None, ge=0)
    is_active: bool | None = Field(default=None)


class FeatureCreate(FeatureBase):
    pass


class FeatureResponse(FeatureBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
