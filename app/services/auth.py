from datetime import timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import APIError
from app.core.security import create_access_token, verify_password
from app.repositories.user import UserRepository
from app.schemas.user import Token, TokenResponse, UserResponse


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def login(self, email, password) -> TokenResponse:
        user = await self.user_repo.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            raise APIError("Invalid credentials", status_code=401)
        access_token_expires = timedelta(minutes=15)
        access_token = create_access_token(
            data={"sub": str(user.id)}, expires_delta=access_token_expires
        )

        return TokenResponse(
            token=Token(access_token=access_token, token_type="bearer"),
            user=UserResponse.model_validate(user),
        )

    async def get_user_by_id(self, user_id: int) -> UserResponse:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise APIError("User not found", status_code=404)
        return UserResponse.model_validate(user)
