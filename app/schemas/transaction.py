from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, computed_field


class TransactionCreate(BaseModel):
    user_id: int
    subscription_id: int
    base_price: Decimal = Field(
        ge=Decimal("0.00"),
        decimal_places=2,
        description="Base plan cost charged for this billing period",
        examples=[Decimal("29.99")],
    )
    extra_charges: Decimal = Field(
        default=Decimal("0.00"),
        ge=Decimal("0.00"),
        decimal_places=2,
        description="Calculated fee for feature overuse on billing day",
        examples=[Decimal("10.50")],
    )
    is_recurring: bool = Field(
        default=False,
        description="True if generated during scheduled billing_day run, False if initial creation charge",
    )


class TransactionResponse(BaseModel):
    id: int
    user_id: int
    subscription_id: int
    base_price: Decimal
    extra_charges: Decimal
    is_recurring: bool
    created_at: datetime

    @computed_field
    def total_amount(self) -> Decimal:
        return self.base_price + self.extra_charges

    model_config = ConfigDict(from_attributes=True)


class CursorPaginatedTransactions(BaseModel):
    items: list[TransactionResponse]
    next_cursor: int | None = None
    has_more: bool
