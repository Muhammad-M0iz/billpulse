from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import RequireAdmin
from app.core.database import get_db
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.feature import FeatureCreate, FeatureResponse
from app.services.feature import FeatureService

router = APIRouter()


@router.post(
    "/", response_model=APIResponse[FeatureResponse], operation_id="create_feature"
)
async def create_feature(
    payload: FeatureCreate,
    admin_user: RequireAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    feature_service = FeatureService(db)
    feature = await feature_service.create_feature(payload)
    return APIResponse(
        message="Feature created successfully",
        status_code=status.HTTP_201_CREATED,
        data=feature,
    )


@router.get(
    "/",
    response_model=APIResponse[list[FeatureResponse]],
    operation_id="get_features",
)
async def get_features(
    db: AsyncSession = Depends(get_db),
):
    features = await FeatureService(db).get_all_features()

    return APIResponse(
        message="Features fetched successfully",
        data=features,
        status_code=status.HTTP_200_OK,
    )
