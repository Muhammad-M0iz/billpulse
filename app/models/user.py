from sqlalchemy import Enum, String
from sqlalchemy.orm import Mapped, WriteOnlyMapped, mapped_column, relationship

from app.core.database import Model


class User(Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(String(500), nullable=False)
    role: Mapped[str] = mapped_column(
        Enum("admin", "buyer", name="user_role_enum"),
        default="buyer",
        nullable=False,
    )
    profile_img: Mapped[str | None] = mapped_column(String(500), nullable=True)

    subscriptions: Mapped[list["Subscription"]] = relationship(
        "Subscription", back_populates="user"
    )
    transactions: WriteOnlyMapped["Transaction"] = relationship(
        "Transaction", back_populates="user", passive_deletes=True
    )
