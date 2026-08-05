from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.core.database import Model


class Transaction(Model):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    subscription_id: Mapped[int] = mapped_column(
        ForeignKey("subscriptions.id"), nullable=False
    )
    base_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    extra_charges: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False, default=Decimal("0.00")
    )
    is_recurring: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    user: Mapped["User"] = relationship(
        "User", back_populates="transactions", lazy="joined", innerjoin=True
    )
    subscription: Mapped["Subscription"] = relationship(
        "Subscription", back_populates="transactions", lazy="joined", innerjoin=True
    )

    @property
    def total_amount(self) -> Decimal:
        return self.base_price + self.extra_charges
