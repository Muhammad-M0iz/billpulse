from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import RequireAdmin
from app.core.database import get_db
from app.schemas.common import APIResponse
from app.services.billing import BillingService

router = APIRouter()


@router.post(
    "/run",
    response_model=APIResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Launch the call to charge accounts on billing_day",
    operation_id="run_billing_cycle",
)
async def run_billing_cycle(
    background_tasks: BackgroundTasks,
    admin_user: RequireAdmin,
    db: AsyncSession = Depends(get_db),
):
    billing_service = BillingService(db)
    summary = await billing_service.run_billing_cycle(background_tasks=background_tasks)

    return APIResponse(
        status_code=status.HTTP_200_OK,
        message="Billing cycle executed successfully",
        data=summary,
    )
