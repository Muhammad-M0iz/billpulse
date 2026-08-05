from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.transaction import TransactionRepository
from app.schemas.transaction import CursorPaginatedTransactions, TransactionResponse


class TransactionService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.transaction_repo = TransactionRepository(db)

    async def get_user_transactions(
        self,
        user_id: int,
        cursor_id: int | None = None,
        limit: int = 50,
    ) -> CursorPaginatedTransactions:

        raw_transactions = await self.transaction_repo.get_by_user_id_cursor(
            user_id=user_id,
            cursor_id=cursor_id,
            limit=limit + 1,
        )

        has_more = len(raw_transactions) > limit
        items = raw_transactions[:limit] if has_more else raw_transactions
        next_cursor = items[-1].id if items else None

        return CursorPaginatedTransactions(
            items=[TransactionResponse.model_validate(t) for t in items],
            next_cursor=next_cursor,
            has_more=has_more,
        )

    async def get_all_transactions(
        self,
        user_id: int | None = None,
        subscription_id: int | None = None,
        cursor_id: int | None = None,
        limit: int = 50,
    ) -> CursorPaginatedTransactions:

        raw_transactions = await self.transaction_repo.get_all_cursor(
            user_id=user_id,
            subscription_id=subscription_id,
            cursor_id=cursor_id,
            limit=limit + 1,
        )

        has_more = len(raw_transactions) > limit
        items = raw_transactions[:limit] if has_more else raw_transactions
        next_cursor = items[-1].id if items else None

        return CursorPaginatedTransactions(
            items=[TransactionResponse.model_validate(t) for t in items],
            next_cursor=next_cursor,
            has_more=has_more,
        )
