# app/api/deps.py
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.exceptions import APIError, UnauthorizedError
from app.core.security import oauth2_scheme, verify_access_token
from app.models.user import User
from app.services.auth import AuthService


async def get_current_user(
    token: Annotated[str | None, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
):

    if token is None:
        raise UnauthorizedError(
            "Authentication credentials were not provided",
            error_code="UNAUTHENTICATED",
        )

    user_id = verify_access_token(token)
    if user_id is None:
        raise UnauthorizedError(
            "Invalid authentication token", error_code="INVALID_TOKEN"
        )

    try:
        user_int_id = int(user_id)
    except ValueError:
        raise UnauthorizedError("Invalid token subject", error_code="INVALID_TOKEN")

    auth_service = AuthService(db)
    user = await auth_service.get_user_by_id(user_int_id)
    if not user:
        raise UnauthorizedError("User not found", error_code="USER_NOT_FOUND")

    return user


class RequireRole:
    def __init__(self, allowed_roles: list[str] | str):
        self.allowed_roles = (
            [allowed_roles] if isinstance(allowed_roles, str) else allowed_roles
        )

    async def __call__(
        self, current_user: Annotated[User, Depends(get_current_user)]
    ) -> User:
        role_val = getattr(current_user.role, "value", str(current_user.role))
        if role_val not in self.allowed_roles:
            raise APIError(
                "Insufficient permissions",
                error_code="INSUFFICIENT_PERMISSIONS",
                status_code=403,
            )
        return current_user


CurrentUser = Annotated[User, Depends(get_current_user)]
RequireAdmin = Annotated[User, Depends(RequireRole("admin"))]
RequireBuyer = Annotated[User, Depends(RequireRole("buyer"))]
