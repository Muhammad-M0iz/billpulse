from typing import Annotated

from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio.session import AsyncSession

from app.api.deps import CurrentUser
from app.core.database import get_db
from app.schemas.common import APIResponse
from app.schemas.user import Token, TokenResponse, UserCreate, UserLogin, UserResponse
from app.services.auth import AuthService
from app.services.storage.base import AbstractStorageService
from app.services.storage.factory import get_storage_service
from app.services.user import UserService

router = APIRouter()


@router.post("/create", response_model=UserResponse, operation_id="create_user")
async def create_user(
    user: UserCreate,
    db: AsyncSession = Depends(get_db),
    storage: AbstractStorageService = Depends(get_storage_service),
):
    user_service = UserService(db, storage)
    return await user_service.create_user(user)


@router.post("/login", response_model=TokenResponse, operation_id="login_user")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    return await auth_service.login(user.email, user.password)


@router.get(
    "/me",
    response_model=APIResponse[UserResponse],
    status_code=status.HTTP_200_OK,
    summary="Get current logged in user profile",
    operation_id="get_me",
)
async def get_me(
    current_user: CurrentUser,
):
    return APIResponse(
        status_code=status.HTTP_200_OK,
        message="Current user profile retrieved successfully",
        data=current_user,
    )


@router.get(
    "/",
    response_model=APIResponse[list[UserResponse]],
    status_code=status.HTTP_200_OK,
    summary="Get all users",
    operation_id="get_all_users",
)
async def get_all_users(
    current_user: CurrentUser,
    role: str | None = None,
    db: AsyncSession = Depends(get_db),
    storage: AbstractStorageService = Depends(get_storage_service),
):
    user_service = UserService(db, storage)
    users = await user_service.get_all_users(role=role)
    return APIResponse(
        status_code=status.HTTP_200_OK,
        message="Users retrieved successfully",
        data=users,
    )


@router.post("/token", response_model=Token, include_in_schema=False)
async def token(
    formData: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: AsyncSession = Depends(get_db),
):
    auth_service = AuthService(db)
    auth_respone = await auth_service.login(formData.username, formData.password)
    return auth_respone.token
