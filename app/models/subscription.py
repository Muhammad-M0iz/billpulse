from datetime import date

from sqlalchemy import Boolean, Date, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Model


class Subscription(Model):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    plan_id: Mapped[int] = mapped_column(
        ForeignKey("plans.id", ondelete="CASCADE"), nullable=False
    )
    billing_day: Mapped[int] = mapped_column(Integer, nullable=False)

    last_billing_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    subscribed_at: Mapped[date] = mapped_column(Date, nullable=True, default=date.today)

    user: Mapped["User"] = relationship(
        back_populates="subscriptions", lazy="joined", innerjoin=True
    )
    plan: Mapped["Plan"] = relationship(
        back_populates="subscriptions", lazy="joined", innerjoin=True
    )

    transactions: Mapped[list["Transaction"]] = relationship(
        back_populates="subscription"
    )
