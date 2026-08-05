from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate


class TransactionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, transaction_in: TransactionCreate) -> Transaction:
        transaction = Transaction(**transaction_in.model_dump())
        self.db.add(transaction)
        return transaction

    async def get_by_user_id_cursor(
        self,
        user_id: int,
        cursor_id: int | None = None,
        limit: int = 50,
    ) -> list[Transaction]:
        stmt = select(Transaction).where(Transaction.user_id == user_id)

        if cursor_id is not None:
            stmt = stmt.where(Transaction.id < cursor_id)

        stmt = stmt.order_by(Transaction.id.desc()).limit(limit)

        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_all_cursor(
        self,
        user_id: int | None = None,
        subscription_id: int | None = None,
        cursor_id: int | None = None,
        limit: int = 50,
    ) -> list[Transaction]:

        stmt = select(Transaction)

        if user_id is not None:
            stmt = stmt.where(Transaction.user_id == user_id)
        if subscription_id is not None:
            stmt = stmt.where(Transaction.subscription_id == subscription_id)
        if cursor_id is not None:
            stmt = stmt.where(Transaction.id < cursor_id)

        stmt = stmt.order_by(Transaction.id.desc()).limit(limit)

        result = await self.db.execute(stmt)
        return list(result.scalars().all())
