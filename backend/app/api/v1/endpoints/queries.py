from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.GrievanceQuery import GrievanceQuery
from app.schemas.grievance import QueryCreate, QueryResponse

router = APIRouter(prefix="/grievances", tags=["Queries"])


@router.post("/{token}/queries", response_model=QueryResponse)
def create_query(token: str, payload: QueryCreate, db: Session = Depends(get_db)):

    query = GrievanceQuery(
        grievance_token=token,
        message=payload.message,
        sender=payload.sender
    )

    db.add(query)
    db.commit()
    db.refresh(query)

    return query


@router.get("/{token}/queries", response_model=List[QueryResponse])
def get_queries(token: str, db: Session = Depends(get_db)):

    queries = (
        db.query(GrievanceQuery)
        .filter(GrievanceQuery.grievance_token == token)
        .order_by(GrievanceQuery.created_at)
        .all()
    )

    return queries