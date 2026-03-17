import random
import string
from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session,joinedload
from sqlalchemy import func
from app.models.grievance import Grievance, GrievanceStatus
from app.schemas.grievance import GrievanceCreate, GrievanceUpdate


def generate_token() -> str:
    """Generate unique grievance token like GRV25XXXXXX"""
    year = str(datetime.now().year)[2:]
    chars = string.ascii_uppercase + string.digits
    random_part = "".join(random.choices(chars, k=6))
    return f"GRV{year}{random_part}"


def ensure_unique_token(db: Session) -> str:
    while True:
        token = generate_token()
        existing = db.query(Grievance).filter(Grievance.token == token).first()
        if not existing:
            return token


def create_grievance(db: Session, payload: GrievanceCreate, attachment_url: Optional[str] = None) -> Grievance:
    token = ensure_unique_token(db)
    grievance = Grievance(
    token=token,
    name=payload.name,
    mobile=payload.mobile,
    email=payload.email,
    address=payload.address,
    constituency=payload.constituency,
    department=payload.department,
    description=payload.description,
    status=GrievanceStatus.SUBMITTED,
    attachment_url=attachment_url,
)
    db.add(grievance)
    db.commit()
    db.refresh(grievance)
    return grievance


def get_by_token(db: Session, token: str) -> Optional[Grievance]:
    return db.query(Grievance).filter(Grievance.token == token.upper()).first()


def get_by_mobile(db: Session, mobile: str) -> List[Grievance]:
    return (
        db.query(Grievance)
        .filter(Grievance.mobile == mobile)
        .order_by(Grievance.created_at.desc())
        .all()
    )


def get_all(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    department: Optional[str] = None,
    search: Optional[str] = None,
) -> tuple[List[Grievance], int]:

    query = db.query(Grievance).options(joinedload(Grievance.queries))

    if status:
        query = query.filter(Grievance.status == status)

    if department:
        query = query.filter(Grievance.department == department)

    if search:
        term = f"%{search}%"
        query = query.filter(
            Grievance.token.ilike(term)
            | Grievance.name.ilike(term)
            | Grievance.description.ilike(term)
            | Grievance.department.ilike(term)
        )

    total = query.count()

    grievances = (
        query.order_by(Grievance.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return grievances, total

def update_grievance(
    db: Session, token: str, payload: GrievanceUpdate
) -> Optional[Grievance]:
    grievance = get_by_token(db, token)
    if not grievance:
        return None
    grievance.status = payload.status
    if payload.assigned_to is not None:
        grievance.assigned_to = payload.assigned_to
    if payload.remarks is not None:
        grievance.remarks = payload.remarks
    grievance.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(grievance)
    return grievance


def get_stats(db: Session) -> dict:
    total = db.query(Grievance).count()
    submitted = db.query(Grievance).filter(Grievance.status == GrievanceStatus.SUBMITTED).count()
    under_review = db.query(Grievance).filter(Grievance.status == GrievanceStatus.UNDER_REVIEW).count()
    assigned = db.query(Grievance).filter(Grievance.status == GrievanceStatus.ASSIGNED).count()
    in_progress = db.query(Grievance).filter(Grievance.status == GrievanceStatus.IN_PROGRESS).count()
    resolved = db.query(Grievance).filter(Grievance.status == GrievanceStatus.RESOLVED).count()
    closed = db.query(Grievance).filter(Grievance.status == GrievanceStatus.CLOSED).count()

    dept_rows = (
        db.query(Grievance.department, func.count(Grievance.id).label("count"))
        .group_by(Grievance.department)
        .all()
    )
    by_department = {row.department: row.count for row in dept_rows}

    return {
        "total": total,
        "submitted": submitted,
        "under_review": under_review,
        "assigned": assigned,
        "in_progress": in_progress,
        "resolved": resolved,
        "closed": closed,
        "by_department": by_department,
    }