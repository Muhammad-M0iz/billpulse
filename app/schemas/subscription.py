from datetime import date

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.plan import PlanResponse


class SubscriptionCreate(BaseModel):
    plan_id: int = Field(description="ID of the plan to subscribe to")


class SubscriptionUpdate(BaseModel):
    plan_id: int = Field(..., description="Change subscription to a new plan ID")
    billing_day: int | None = Field(
        default=None,
        ge=1,
        le=28,
        description="Update recurring billing day (1-28)",
        examples=[1],
    )
    last_billing_date: date | None = None


class SubscriptionResponse(BaseModel):
    id: int
    user_id: int
    plan_id: int
    billing_day: int
    last_billing_date: date | None = None
    is_active: bool
    plan: PlanResponse

    model_config = ConfigDict(from_attributes=True)


class SubscriptionDeactivate(BaseModel):
    is_active: bool = False
