from fastapi import APIRouter
from app.api.v1.endpoints import auth, grievances, queries

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(grievances.router)
api_router.include_router(queries.router)