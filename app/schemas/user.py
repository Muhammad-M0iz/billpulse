from enum import Enum

from fastapi import Form
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRole(str, Enum):
    ADMIN = "admin"
    BUYER = "buyer"


class UserBase(BaseModel):
    name: str = Field(min_length=3, max_length=20)
    email: EmailStr
    role: UserRole = Field(default=UserRole.BUYER)


class UserCreate(UserBase):
    password: str = Field(min_length=5)
    profile_img: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=5)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(UserBase):
    id: int
    profile_img: str | None = None

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    token: Token
    user: UserResponse
