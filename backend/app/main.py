from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pathlib import Path
from app.core.config import settings
from app.api.v1.router import api_router
from app.db.database import engine
from app.models import User, Grievance  # noqa: registers models with Base
from app.db.database import Base
from app.db.database import engine, SessionLocal
from app.services.user_service import seed_default_users
from app.services.grievance_service import create_grievance
from app.schemas.grievance import GrievanceCreate
from app.models.grievance import GrievanceStatus
from datetime import datetime, timedelta

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    
    # Create uploads directory
    upload_dir = Path("uploads/grievances")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    yield
    # Shutdown


app = FastAPI(
    title=settings.APP_NAME,
    description="""
## Tamil Nadu Grievance Portal API

**Public Endpoints** (no auth needed):
- `POST /api/v1/grievances/` — Submit grievance with optional file attachment
- `GET /api/v1/grievances/track/{token}` — Track by token
- `GET /api/v1/grievances/by-mobile/{mobile}` — Find by mobile

**Protected Endpoints**:
- `POST /api/v1/auth/login` — Get JWT token
- Minister + Admin: `GET /api/v1/grievances/` — View all grievances
- Minister + Admin: `GET /api/v1/grievances/stats/summary` — Analytics
- Admin only: `PATCH /api/v1/grievances/{token}` — Update status

**File Uploads**:
- Supported formats: PDF, JPG, JPEG, PNG, DOC, DOCX
- Maximum file size: 5MB
- Files accessible via: `/uploads/grievances/{filename}`

**Setup**:
To seed demo data, run: `python seed.py`
    """,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(api_router, prefix="/api/v1")

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/", tags=["Health"])
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}