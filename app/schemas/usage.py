from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.feature import FeatureResponse


class UsageCreate(BaseModel):
    subscription_id: int = Field(description="ID of the active subscription being used")
    feature_id: int = Field(description="ID of the feature feature being consumed")
    units_used: int = Field(
        gt=0,
        description="Number of units consumed (must be greater than 0)",
        examples=[5],
    )


class UsageResponse(BaseModel):
    id: int
    subscription_id: int
    feature_id: int
    units_used: int
    feature: FeatureResponse | None = None

    model_config = ConfigDict(from_attributes=True)


class UsageSummary(BaseModel):
    feature_id: int
    feature_code: str
    total_units_used: int
    max_unit_limit: int
    overuse_units: int
    overuse_fee: float
