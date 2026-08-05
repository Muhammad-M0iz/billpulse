from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Feature
from app.schemas.feature import FeatureBase, FeatureCreate


class FeatureRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_code(self, code: str) -> Feature | None:
        stmt = select(Feature).where(Feature.code == code)
        return await self.db.scalar(stmt)

    async def create(
        self,
        feature: FeatureCreate,
    ) -> Feature:
        db_feature = Feature(**feature.model_dump())
        self.db.add(db_feature)
        await self.db.commit()
        await self.db.refresh(db_feature)
        return db_feature

    async def get_all(self) -> list[Feature]:
        stmt = select(Feature)
        result = await self.db.scalars(stmt)
        return list(result.all())

    async def get_by_ids(self, ids: list[int]) -> list[Feature]:
        stmt = select(Feature).where(Feature.id.in_(ids))
        result = await self.db.scalars(stmt)
        return list(result.all())
