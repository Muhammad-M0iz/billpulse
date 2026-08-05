from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import RequireAdmin, get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.transaction import CursorPaginatedTransactions
from app.services.transaction import TransactionService

router = APIRouter()


@router.get(
    "/me",
    response_model=APIResponse[CursorPaginatedTransactions],
    status_code=status.HTTP_200_OK,
    summary="Get current user's transaction & payment history",
    operation_id="get_my_transactions",
)
async def get_my_transactions(
    current_user: Annotated[User, Depends(get_current_user)],
    cursor: int | None = Query(
        default=None, description="Last seen transaction ID for next page"
    ),
    limit: int = Query(default=50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    transaction_service = TransactionService(db)
    result = await transaction_service.get_user_transactions(
        user_id=current_user.id,
        cursor_id=cursor,
        limit=limit,
    )

    return APIResponse(
        status_code=status.HTTP_200_OK,
        message="Transaction history retrieved successfully",
        data=result,
    )


@router.get(
    "/",
    response_model=APIResponse[CursorPaginatedTransactions],
    status_code=status.HTTP_200_OK,
    summary="Get all transactions (Admin view)",
    operation_id="get_all_transactions",
)
async def get_all_transactions(
    admin_user: RequireAdmin,
    user_id: int | None = Query(default=None, description="Filter by user ID"),
    subscription_id: int | None = Query(
        default=None, description="Filter by subscription ID"
    ),
    cursor: int | None = Query(
        default=None, description="Last seen transaction ID for next page"
    ),
    limit: int = Query(default=50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    transaction_service = TransactionService(db)
    result = await transaction_service.get_all_transactions(
        user_id=user_id,
        subscription_id=subscription_id,
        cursor_id=cursor,
        limit=limit,
    )

    return APIResponse(
        status_code=status.HTTP_200_OK,
        message="All transactions retrieved successfully",
        data=result,
    )
