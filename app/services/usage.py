from fastapi import status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import APIError
from app.models.usage import Usage
from app.repositories.feature import FeatureRepository
from app.repositories.subscription import SubscriptionRepository
from app.repositories.usage import UsageRepository
from app.schemas.usage import UsageCreate


class UsageService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.usage_repo = UsageRepository(db)
        self.feature_repo = FeatureRepository(db)
        self.subscription_repo = SubscriptionRepository(db)

    async def get_usage(
        self, subscription_id: int, current_user_id: int, is_admin: bool = False
    ) -> list[Usage]:
        subscription = await self.subscription_repo.get_by_id(subscription_id)
        if not subscription:
            raise APIError(
                message="Subscription not found",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        if not is_admin and subscription.user_id != current_user_id:
            raise APIError(
                message="Cannot access usage for a subscription not owned by the user",
                status_code=status.HTTP_403_FORBIDDEN,
            )

        return await self.usage_repo.get_usage(subscription_id)

    async def get_user_usage(
        self, user_id: int, current_user_id: int, is_admin: bool = False
    ) -> list[Usage]:
        if not is_admin and current_user_id != user_id:
            raise APIError(
                message="Cannot access usage records for another user",
                status_code=status.HTTP_403_FORBIDDEN,
            )
        return await self.usage_repo.get_user_usage(user_id)

    async def create(self, usage: UsageCreate) -> Usage:
        subscription = await self.subscription_repo.get_by_id(usage.subscription_id)
        if not subscription:
            raise APIError(
                message="Subscription not found",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        if not subscription.is_active:
            raise APIError(
                message="Cannot record usage for an inactive subscription",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        existing_features = await self.feature_repo.get_by_ids([usage.feature_id])
        if not existing_features:
            raise APIError(
                message="Feature not found",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        plan_feature_ids = {f.id for f in subscription.plan.features}
        if usage.feature_id not in plan_feature_ids:
            raise APIError(
                message="This feature is not included in the subscribed plan",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            usage_record = await self.usage_repo.create(usage)
            await self.db.commit()
            return usage_record
        except Exception:
            await self.db.rollback()
            raise
