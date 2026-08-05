from decimal import Decimal

from sqlalchemy import Boolean, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Model


class Plan(Model):
    __tablename__ = "plans"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    monthly_fee: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    features: Mapped[list["Feature"]] = relationship(
        secondary="plan_features", back_populates="plans", lazy="selectin"
    )

    subscriptions: Mapped[list["Subscription"]] = relationship(back_populates="plan")
