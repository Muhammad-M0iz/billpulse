from datetime import date

from sqlalchemy import or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.subscription import Subscription
from app.schemas.subscription import SubscriptionCreate, SubscriptionUpdate


class SubscriptionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        user_id: int,
        last_billing_date: date,
        subscription_in: SubscriptionCreate,
        billing_day: int,
    ) -> Subscription:
        subscription_db = Subscription(
            user_id=user_id,
            billing_day=billing_day,
            last_billing_date=last_billing_date,
            **subscription_in.model_dump(),
        )
        self.db.add(subscription_db)
        await self.db.flush()
        return subscription_db

    async def get_by_id(self, subscription_id: int) -> Subscription:
        stmt = (
            select(Subscription)
            .where(Subscription.id == subscription_id)
            .with_for_update(skip_locked=True)
        )
        result = await self.db.scalars(stmt)
        return result.one()

    async def get_due_subscription(self, current_date: date) -> list[Subscription]:
        start_of_current_month = current_date.replace(day=1)

        stmt = select(Subscription).where(
            Subscription.is_active == True,
            Subscription.billing_day <= current_date.day,
            or_(
                Subscription.last_billing_date < start_of_current_month,
                Subscription.last_billing_date == None,
            ),
        )

        result = await self.db.scalars(stmt)
        return list(result.all())

    async def update(
        self, subscription_id: int, subscription_in: SubscriptionUpdate
    ) -> None:
        update_data = subscription_in.model_dump(exclude_unset=True)
        if update_data:
            stmt = (
                update(Subscription)
                .where(Subscription.id == subscription_id)
                .values(**update_data)
            )
            await self.db.execute(stmt)
            await self.db.flush()

    async def deactivate(self, subscription_id: int) -> None:
        stmt = (
            update(Subscription)
            .where(Subscription.id == subscription_id)
            .values(is_active=False)
        )
        await self.db.execute(stmt)
        await self.db.flush()

    async def get_by_user_id(self, user_id: int) -> list[Subscription]:

        stmt = select(Subscription).where(Subscription.user_id == user_id)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
