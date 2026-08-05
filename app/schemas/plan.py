from pydantic import BaseModel, ConfigDict, Field

from app.schemas.feature import FeatureResponse


class PlanBase(BaseModel):
    name: str = Field(min_length=3, max_length=50, examples=["Pro Plan"])
    monthly_fee: float = Field(
        ge=0.0,
        description="The recurring monthly price charged for this plan",
        examples=[49.99],
    )


class PlanCreate(PlanBase):
    feature_ids: list[int] = Field(
        default_factory=list,
        description="List of feature IDs associated with this plan",
        examples=[[1, 2, 3]],
    )


class PlanUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=3, max_length=50)
    monthly_fee: float | None = Field(default=None, ge=0.0)
    feature_ids: list[int] | None = None


class PlanResponse(PlanBase):
    id: int
    features: list[FeatureResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)
