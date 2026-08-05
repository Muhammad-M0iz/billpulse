from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.subscription import Subscription
from app.models.usage import Usage
from app.schemas.usage import UsageCreate


class UsageRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, usage: UsageCreate) -> Usage:
        db_usage = Usage(**usage.model_dump())
        self.db.add(db_usage)
        await self.db.commit()
        await self.db.refresh(db_usage)
        return db_usage

    async def get_usage(self, subscription_id: int) -> list[Usage]:
        stmt = select(Usage).where(Usage.subscription_id == subscription_id)
        result = await self.db.scalars(stmt)
        return list(result)

    async def get_user_usage(self, user_id: int) -> list[Usage]:
        stmt = (
            select(Usage)
            .join(Subscription, Usage.subscription_id == Subscription.id)
            .where(Subscription.user_id == user_id)
        )
        result = await self.db.scalars(stmt)
        return list(result)
