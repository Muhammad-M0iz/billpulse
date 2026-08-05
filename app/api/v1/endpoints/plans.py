from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import RequireAdmin
from app.core.database import get_db
from app.schemas.common import APIResponse
from app.schemas.plan import PlanCreate, PlanResponse
from app.services.plan import PlanService

router = APIRouter()


@router.get(
    "/",
    response_model=APIResponse[list[PlanResponse]],
    status_code=status.HTTP_200_OK,
    operation_id="get_plans",
)
async def get_all_plans(
    db: AsyncSession = Depends(get_db),
):
    plans = await PlanService(db).get_all()

    return APIResponse(
        status_code=status.HTTP_200_OK,
        message="Plans retrieved successfully",
        data=plans,
    )


@router.post(
    "/create",
    response_model=APIResponse[PlanResponse],
    status_code=status.HTTP_201_CREATED,
    operation_id="create_plan",
)
async def create_plan(
    payload: PlanCreate,
    admin_user: RequireAdmin,
    db: AsyncSession = Depends(get_db),
):
    plan = await PlanService(db).create(payload)

    return APIResponse(
        status_code=status.HTTP_201_CREATED,
        message="Plan created successfully",
        data=plan,
    )
