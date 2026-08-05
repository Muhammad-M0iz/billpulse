from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Plan
from app.models.feature import Feature
from app.schemas.plan import PlanCreate


class PlanRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[Plan]:
        stmt = select(Plan)
        result = await self.db.scalars(stmt)
        return list(result.all())

    async def create(self, plan: PlanCreate, features: list[Feature]) -> Plan:
        db_plan = Plan(**plan.model_dump(exclude={"feature_ids"}), features=features)
        self.db.add(db_plan)
        await self.db.commit()
        await self.db.refresh(db_plan)
        return db_plan

    async def get_by_id(self, plan_id: int) -> Plan:
        stmt = select(Plan).where(Plan.id == plan_id)
        result = await self.db.scalars(stmt)
        return result.one()
