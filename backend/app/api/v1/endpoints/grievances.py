from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional, List
import os
import uuid
from pathlib import Path
from app.core.otp_store import generate_otp, save_otp, verify_otp
from app.db.database import get_db
from app.schemas.grievance import (
    GrievanceCreate,
    GrievanceResponse,
    GrievanceUpdate,
    GrievanceListResponse,
    StatsResponse,
)
from app.services import grievance_service
from app.core.dependencies import require_admin, require_minister_or_admin
from app.models.user import User

router = APIRouter(prefix="/grievances", tags=["Grievances"])

# Configure upload directory
UPLOAD_DIR = Path("uploads/grievances")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("/send-otp")
def send_otp(mobile: str = Form(...)):
    # Validate mobile number
    if not mobile.isdigit() or len(mobile) != 10 or mobile[0] not in "6789":
        raise HTTPException(status_code=400, detail="Invalid mobile number")

    otp = generate_otp()
    save_otp(mobile, otp)

    # For development (later replace with SMS service)
    print(f"OTP for {mobile}: {otp}")

    return {"message": "OTP sent successfully"}


@router.post("/verify-otp")
def verify_mobile_otp(
    mobile: str = Form(...),
    otp: str = Form(...)
):
    print("VERIFY INPUT:", mobile, otp)   # 👈 ADD THIS

    if not verify_otp(mobile, otp):
        print("OTP FAILED")               # 👈 ADD THIS
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    print("OTP SUCCESS")                  # 👈 ADD THIS
    return {"message": "OTP verified"}


@router.post(
    "/",
    response_model=GrievanceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a new grievance (Public)",
    description="Any citizen can submit a grievance with optional file attachment. Returns a unique token to track status.",
)
async def submit_grievance(
    name: str = Form(...),
    mobile: str = Form(...),
    email: str = Form(...),
    address: str = Form(...),
    constituency: str = Form(...),
    department: str = Form(...),
    description: str = Form(...),
    attachment: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):

    attachment_url = None

    # File validation
    if attachment and attachment.filename:
        file_ext = Path(attachment.filename).suffix.lower()

        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
            )

        content = await attachment.read()

        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size exceeds maximum limit of 5MB"
            )

        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / unique_filename

        with open(file_path, "wb") as f:
            f.write(content)

        attachment_url = f"/uploads/grievances/{unique_filename}"

    # Create grievance payload
    payload = GrievanceCreate(
        name=name,
        mobile=mobile,
        email=email,
        address=address,
        constituency=constituency,
        department=department,
        description=description
    )

    return grievance_service.create_grievance(db, payload, attachment_url)


@router.get(
    "/track/{token}",
    response_model=GrievanceResponse,
    summary="Track grievance by token (Public)",
    description="Retrieve grievance status using the unique token.",
)
def track_by_token(token: str, db: Session = Depends(get_db)):
    grievance = grievance_service.get_by_token(db, token)
    if not grievance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No grievance found with token: {token}",
        )
    return grievance


@router.get(
    "/by-mobile/{mobile}",
    response_model=List[GrievanceResponse],
    summary="Get grievances by mobile number (Public)",
    description="Retrieve all grievances filed with this mobile number. Used for forgot-token flow.",
)
def get_by_mobile(mobile: str, db: Session = Depends(get_db)):
    grievances = grievance_service.get_by_mobile(db, mobile)
    if not grievances:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No grievances found for this mobile number",
        )
    return grievances


@router.get(
    "/",
    response_model=GrievanceListResponse,
    summary="List all grievances (Minister / Admin only)",
    description="Paginated list with optional filters by status, department, and search query.",
)
def list_grievances(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=500, description="Max records to return"),
    status: Optional[str] = Query(None, description="Filter by status"),
    department: Optional[str] = Query(None, description="Filter by department"),
    search: Optional[str] = Query(None, description="Search in token, name, description"),
    db: Session = Depends(get_db),
    _: User = Depends(require_minister_or_admin),
):
    grievances, total = grievance_service.get_all(
        db, skip=skip, limit=limit,
        status=status, department=department, search=search
    )
    return GrievanceListResponse(total=total, grievances=grievances)


@router.patch(
    "/{token}",
    response_model=GrievanceResponse,
    summary="Update grievance status (Admin only)",
    description="Admin can update status, assign officer, and add remarks.",
)
def update_grievance(
    token: str,
    payload: GrievanceUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    updated = grievance_service.update_grievance(db, token, payload)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No grievance found with token: {token}",
        )
    return updated


@router.get(
    "/stats/summary",
    response_model=StatsResponse,
    summary="Get grievance statistics (Minister / Admin only)",
    description="Returns count summary by status and department.",
)
def get_stats(
    db: Session = Depends(get_db),
    _: User = Depends(require_minister_or_admin),
):
    return grievance_service.get_stats(db)