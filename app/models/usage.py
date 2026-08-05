from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Model


class Usage(Model):
    __tablename__ = "usages"

    id: Mapped[int] = mapped_column(primary_key=True)
    subscription_id: Mapped[int] = mapped_column(
        ForeignKey("subscriptions.id"), nullable=False
    )
    feature_id: Mapped[int] = mapped_column(ForeignKey("features.id"), nullable=False)

    units_used: Mapped[int] = mapped_column(Integer, nullable=False)

    subscription: Mapped["Subscription"] = relationship(
        "Subscription", lazy="joined", innerjoin=True
    )
    feature: Mapped["Feature"] = relationship("Feature", lazy="selectin")
