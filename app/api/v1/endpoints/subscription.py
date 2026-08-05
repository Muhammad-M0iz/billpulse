from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import CurrentUser
from app.core.database import get_db
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionResponse,
    SubscriptionUpdate,
)
from app.schemas.usage import UsageResponse
from app.services.subscription import SubscriptionService
from app.services.usage import UsageService

router = APIRouter()


@router.post(
    "/",
    response_model=APIResponse[SubscriptionResponse],
    status_code=status.HTTP_201_CREATED,
    operation_id="create_subscription",
)
async def create_subscription(
    payload: SubscriptionCreate,
    current_user: CurrentUser,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    subscription_service = SubscriptionService(db)
    subscription = await subscription_service.create_subscription(
        background_tasks=background_tasks,
        user_id=current_user.id,
        payload=payload,
    )

    return APIResponse(
        status_code=status.HTTP_201_CREATED,
        message="Subscription created successfully",
        data=subscription,
    )


@router.get(
    "/{subscription_id}/usage",
    response_model=APIResponse[list[UsageResponse]],
    status_code=status.HTTP_200_OK,
    summary="Get usage history for a subscription",
    operation_id="get_subscription_usage",
)
async def get_subscription_usage(
    subscription_id: int,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    usage_service = UsageService(db)
    usage_list = await usage_service.get_usage(
        subscription_id=subscription_id,
        current_user_id=current_user.id,
    )

    return APIResponse(
        status_code=status.HTTP_200_OK,
        message="Usage records retrieved successfully",
        data=usage_list,
    )


@router.patch(
    "/{subscription_id}",
    response_model=APIResponse[SubscriptionResponse],
    status_code=status.HTTP_200_OK,
    summary="Change plan for an active subscription",
    operation_id="update_subscription",
)
async def update_subscription(
    subscription_id: int,
    payload: SubscriptionUpdate,
    background_tasks: BackgroundTasks,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    is_admin = getattr(current_user.role, "value", str(current_user.role)) == "admin"
    subscription_service = SubscriptionService(db)

    updated_subscription = await subscription_service.update_subscription(
        subscription_id=subscription_id,
        payload=payload,
        current_user_id=current_user.id,
        background_tasks=background_tasks,
        is_admin=is_admin,
    )

    return APIResponse(
        status_code=status.HTTP_200_OK,
        message="Subscription plan updated successfully",
        data=updated_subscription,
    )


@router.delete(
    "/{subscription_id}",
    response_model=APIResponse[SubscriptionResponse],
    status_code=status.HTTP_200_OK,
    summary="Cancel / Deactivate a subscription",
    operation_id="cancel_subscription",
)
async def cancel_subscription(
    subscription_id: int,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    is_admin = getattr(current_user.role, "value", str(current_user.role)) == "admin"
    subscription_service = SubscriptionService(db)

    canceled_subscription = await subscription_service.cancel_subscription(
        subscription_id=subscription_id,
        current_user_id=current_user.id,
        is_admin=is_admin,
    )

    return APIResponse(
        status_code=status.HTTP_200_OK,
        message="Subscription canceled successfully",
        data=canceled_subscription,
    )


@router.get(
    "/me",
    response_model=APIResponse[list[SubscriptionResponse]],
    status_code=status.HTTP_200_OK,
    summary="Get current user's subscriptions",
    operation_id="get_my_subscriptions",
)
async def get_my_subscriptions(
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):

    subscription_service = SubscriptionService(db)
    subscriptions = await subscription_service.get_user_subscriptions(
        user_id=current_user.id
    )

    return APIResponse(
        status_code=status.HTTP_200_OK,
        message="User subscriptions retrieved successfully",
        data=subscriptions,
    )


@router.get(
    "/user/{user_id}",
    response_model=APIResponse[list[SubscriptionResponse]],
    status_code=status.HTTP_200_OK,
    summary="Get subscriptions by user ID (Admin)",
    operation_id="get_subscriptions_by_user",
)
async def get_subscriptions_by_user(
    user_id: int,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    subscription_service = SubscriptionService(db)
    subscriptions = await subscription_service.get_user_subscriptions(
        user_id=user_id
    )

    return APIResponse(
        status_code=status.HTTP_200_OK,
        message="User subscriptions retrieved successfully",
        data=subscriptions,
    )

