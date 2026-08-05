from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.user import UserCreate


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        user_in: UserCreate,
        hashed_password: str,
        profile_img: str | None = None,
    ) -> User:
        db_user = User(
            name=user_in.name,
            email=user_in.email,
            role=user_in.role,
            hashed_password=hashed_password,
            profile_img=profile_img,
        )
        self.db.add(db_user)
        await self.db.commit()
        await self.db.refresh(db_user)
        return db_user

    async def does_user_exists(self, email: str) -> bool:
        result = await self.db.scalar(select(User).where(User.email == email))
        return result is not None

    async def get_by_email(self, email: str) -> User | None:
        return await self.db.scalar(select(User).where(User.email == email))

    async def get_by_id(self, user_id: int) -> User | None:
        return await self.db.scalar(select(User).where(User.id == user_id))

    async def get_all_users(self, role: str | None = None) -> list[User]:
        stmt = select(User)
        if role:
            stmt = stmt.where(User.role == role)
        result = await self.db.scalars(stmt)
        return list(result.all())

