from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.v1.router import api_router
from app.db.database import Base, engine
from app.models import User, Grievance  # noqa: F401 — registers models with Base


# ─── Lifespan ─────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ──
    Base.metadata.create_all(bind=engine)

    upload_dir = Path("uploads/grievances")
    upload_dir.mkdir(parents=True, exist_ok=True)

    print(f" {settings.APP_NAME} v{settings.APP_VERSION} started")
    print(f" Upload dir  : {upload_dir.resolve()}")
    print(f" CORS origins: {settings.origins_list}")
    print(f"Docs        : http://localhost:8000/docs")

    yield

    # ── Shutdown ──
    print("👋  Shutting down…")


# ─── App ──────────────────────────────────────────────────────────────────────

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    
    description="""
## Tamil Nadu Grievance Portal API

**Public Endpoints** (no auth needed):
- `POST /api/v1/grievances/` — Submit grievance with optional file attachment
- `GET /api/v1/grievances/track/{token}` — Track by token
- `GET /api/v1/grievances/by-mobile/{mobile}` — Find by mobile
- `POST /api/v1/grievances/send-otp` — Send OTP to mobile
- `POST /api/v1/grievances/verify-otp` — Verify OTP

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
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ─── Middleware ────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────

app.include_router(api_router, prefix="/api/v1")

# ─── Static files ─────────────────────────────────────────────────────────────

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ─── Health endpoints ─────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def root():
    return {
        "app":     settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status":  "running",
        "docs":    "/docs",
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}