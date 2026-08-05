from typing import Any

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


class APIError(Exception):
    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        error_code: str = "INTERNAL_SERVER_ERROR",
        context: dict[str, Any] | None = None,
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.context = context or {}
        super().__init__(message)


class NotFoundError(APIError):
    def __init__(
        self,
        message: str = "Not Found",
        status_code: int = status.HTTP_404_NOT_FOUND,
        error_code: str = "NOT_FOUND",
        context: dict[str, Any] | None = None,
    ):
        super().__init__(message, status_code, error_code, context)


class BadRequestError(APIError):
    def __init__(
        self,
        message: str = "Bad Request",
        status_code: int = status.HTTP_400_BAD_REQUEST,
        error_code: str = "BAD_REQUEST",
        context: dict[str, Any] | None = None,
    ):
        super().__init__(message, status_code, error_code, context)


class UnauthorizedError(APIError):
    def __init__(
        self,
        message: str = "Unauthorized",
        status_code: int = status.HTTP_401_UNAUTHORIZED,
        error_code: str = "UNAUTHORIZED",
        context: dict[str, Any] | None = None,
    ):
        super().__init__(message, status_code, error_code, context)


class UserAlreadyExistsException(APIError):
    def __init__(
        self,
        message: str = "User already exists",
        status_code: int = status.HTTP_400_BAD_REQUEST,
        error_code: str = "USER_ALREADY_EXISTS",
        context: dict[str, Any] | None = None,
    ):
        super().__init__(message, status_code, error_code, context)


async def api_error_handler(request: Request, exc: APIError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.error_code,
                "message": exc.message,
                "context": exc.context,
            }
        },
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    formatted_errors = []

    for error in exc.errors():
        field = " -> ".join([str(loc) for loc in error["loc"] if loc != "body"])

        formatted_errors.append(
            {
                "field": field or "body",
                "message": error["msg"],
                "type": error["type"],
            }
        )

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid input payload provided.",
                "context": {"details": formatted_errors},
            }
        },
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected server error occurred.",
                "context": {},
            }
        },
    )


def setup_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(APIError, api_error_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)
