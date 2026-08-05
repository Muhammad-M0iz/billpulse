from decimal import Decimal

from sqlalchemy import Boolean, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Model


class Feature(Model):
    __tablename__ = "features"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    max_unit_limit: Mapped[int] = mapped_column()
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    plans: Mapped[list["Plan"]] = relationship(
        secondary="plan_features", back_populates="features"
    )
