from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import APIError
from app.models.feature import Feature
from app.repositories.feature import FeatureRepository
from app.schemas.feature import FeatureBase, FeatureCreate, FeatureResponse


class FeatureService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.feature_repository = FeatureRepository(db)

    async def create_feature(
        self,
        feature_in: FeatureCreate,
    ) -> Feature:
        existing_feature = await self.feature_repository.get_by_code(feature_in.code)
        if existing_feature:
            raise APIError(
                f"Feature with code {feature_in.code} already exists", status_code=400
            )
        return await self.feature_repository.create(feature_in)

    async def get_all_features(self) -> list[Feature]:
        return await self.feature_repository.get_all()
