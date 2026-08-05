from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import APIError
from app.models.plan import Plan
from app.repositories.feature import FeatureRepository
from app.repositories.plan import PlanRepository
from app.schemas.plan import PlanCreate


class PlanService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.plan_repository = PlanRepository(db)
        self.feature_repository = FeatureRepository(db)

    async def get_all(self) -> list[Plan]:
        return await self.plan_repository.get_all()

    async def create(self, plan_in: PlanCreate) -> Plan:
        features = []

        if plan_in.feature_ids:
            features = await self.feature_repository.get_by_ids(plan_in.feature_ids)

        found_ids = {feature.id for feature in features}
        missing_ids = set(plan_in.feature_ids) - found_ids

        if missing_ids:
            raise APIError(
                f"Features not found with IDs: {list(missing_ids)}", status_code=400
            )

        return await self.plan_repository.create(plan_in, features)
