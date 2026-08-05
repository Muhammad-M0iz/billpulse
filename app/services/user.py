import uuid

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import APIError, UserAlreadyExistsException
from app.core.security import hash_password, verify_password
from app.core.validators import IMAGE_VALIDATOR
from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate, UserLogin
from app.services.storage.base import AbstractStorageService


class UserService:
    def __init__(self, db: AsyncSession, storage: AbstractStorageService):
        self.repo = UserRepository(db)
        self.storage = storage

    async def create_user(self, user_in: UserCreate):
        if await self.repo.does_user_exists(user_in.email):
            raise UserAlreadyExistsException()

        hashed_pwd = hash_password(user_in.password)

        return await self.repo.create(
            user_in=user_in,
            hashed_password=hashed_pwd,
            profile_img=user_in.profile_img,
        )

    async def login(self, user: UserLogin):
        db_user = await self.repo.get_by_email(user.email)
        if not db_user:
            raise APIError("User not found", status_code=404)
        if not verify_password(user.password, db_user.hashed_password):
            raise APIError(
                "Invalid password or email",
                status_code=401,
                error_code="INVALID_PASSWORD_OR_EMAIL",
            )
        return db_user

    async def get_all_users(self, role: str | None = None) -> list[User]:
        return await self.repo.get_all_users(role=role)
