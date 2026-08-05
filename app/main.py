import os
from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1.endpoints import (
    billing,
    features,
    plans,
    storage,
    subscription,
    transaction,
    usage,
    users,
)
from app.core.config import settings
from app.core.exceptions import setup_exception_handlers

app = FastAPI()
api_router = APIRouter()

origins = [
    "http://localhost",
    "http://localhost:80",
    "http://localhost:5173",
    "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router.include_router(
    users.router,
    prefix="/users",
    tags=["users"],
)

api_router.include_router(
    storage.router,
    prefix="/storage",
    tags=["storage"],
)

api_router.include_router(
    features.router,
    prefix="/features",
    tags=["features"],
)

api_router.include_router(
    plans.router,
    prefix="/plans",
    tags=["plans"],
)

api_router.include_router(
    transaction.router,
    prefix="/transaction",
    tags=["transaction"],
)

api_router.include_router(
    subscription.router,
    prefix="/subscription",
    tags=["subscription"],
)

api_router.include_router(
    usage.router,
    prefix="/usage",
    tags=["usage"],
)

api_router.include_router(
    billing.router,
    prefix="/billing",
    tags=["billing"],
)

app.include_router(
    api_router,
    prefix="/api/v1",
)


@app.get("/", operation_id="get_home")
def home():
    return {"message": "hello"}


# Ensure upload directory exists before mounting StaticFiles
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app.mount(
    "/static/uploads",
    StaticFiles(directory=settings.UPLOAD_DIR),
    name="uploads",
)

setup_exception_handlers(app)
