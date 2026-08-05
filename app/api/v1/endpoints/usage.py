from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import CurrentUser, RequireAdmin
from app.core.database import get_db
from app.schemas.common import APIResponse
from app.schemas.usage import UsageCreate, UsageResponse
from app.services.usage import UsageService

router = APIRouter()


@router.post(
    "/",
    response_model=APIResponse[UsageResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Record usage for a subscription feature (Admin only)",
    operation_id="create_usage",
)
async def create_usage(
    payload: UsageCreate,
    admin_user: RequireAdmin,
    db: AsyncSession = Depends(get_db),
):
    usage_service = UsageService(db)
    usage_record = await usage_service.create(payload)

    return APIResponse(
        status_code=status.HTTP_201_CREATED,
        message="Usage recorded successfully",
        data=usage_record,
    )


@router.get(
    "/user/{user_id}",
    response_model=APIResponse[list[UsageResponse]],
    status_code=status.HTTP_200_OK,
    summary="Get all usage records for a specific user",
    operation_id="get_user_usage",
)
async def get_user_usage(
    user_id: int,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    is_admin = getattr(current_user.role, "value", str(current_user.role)) == "admin"
    usage_service = UsageService(db)
    user_usage = await usage_service.get_user_usage(
        user_id=user_id,
        current_user_id=current_user.id,
        is_admin=is_admin,
    )

    return APIResponse(
        status_code=status.HTTP_200_OK,
        message="User usage records retrieved successfully",
        data=user_usage,
    )
