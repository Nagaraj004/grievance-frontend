from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
from app.models.grievance import GrievanceStatus


class GrievanceCreate(BaseModel):
    name: str
    mobile: str
    email: EmailStr
    address: str
    constituency: str
    department: str
    description: str

    @field_validator("mobile")
    @classmethod
    def validate_mobile(cls, v: str) -> str:
        v = v.strip()
        if not v.isdigit() or len(v) != 10 or v[0] not in "6789":
            raise ValueError("Enter a valid 10-digit Indian mobile number")
        return v

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Name is required")
        return v.strip()

    @field_validator("address")
    @classmethod
    def validate_address(cls, v: str) -> str:
        if len(v.strip()) < 5:
            raise ValueError("Address is required")
        return v.strip()

    @field_validator("constituency")
    @classmethod
    def validate_constituency(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Please select a constituency")
        return v.strip()

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str) -> str:
        if len(v.strip()) < 20:
            raise ValueError("Description must be at least 20 characters")
        return v.strip()


class GrievanceResponse(BaseModel):
    id: int
    token: str
    name: str
    mobile: str
    email: str
    address: str
    constituency: str

    department: str
    description: str

    status: str
    assigned_to: Optional[str] = None
    remarks: Optional[str] = None

    attachment_url: Optional[str] = None

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class QueryCreate(BaseModel):
    message: str
    sender: str

class QueryResponse(BaseModel):
    id: int
    grievance_token: str
    message: str
    sender: str
    created_at: datetime

    class Config:
        from_attributes = True

class GrievanceUpdate(BaseModel):
    status: GrievanceStatus
    assigned_to: Optional[str] = None
    remarks: Optional[str] = None


class GrievanceListResponse(BaseModel):
    total: int
    grievances: List[GrievanceResponse]


class StatsResponse(BaseModel):
    total: int
    submitted: int
    under_review: int
    assigned: int
    in_progress: int
    resolved: int
    closed: int
    by_department: dict