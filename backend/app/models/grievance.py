from sqlalchemy import Column, String, Text, DateTime, Integer, Enum as SAEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.db.database import Base


class GrievanceStatus(str, enum.Enum):
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"
     
    def label(self):
        return self.value.replace("_", " ")

class Department(str, enum.Enum):
    health = "Health"
    education = "Education"
    water = "Water Supply"
    roads = "Roads & Infrastructure"
    electricity = "Electricity"
    revenue = "Revenue"
    police = "Police"
    agriculture = "Agriculture"
    housing = "Housing"
    social = "Social Welfare"
    other = "Other"


class Grievance(Base):
    __tablename__ = "grievances"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(20), unique=True, nullable=False, index=True)

    name = Column(String(100), nullable=False)
    mobile = Column(String(10), nullable=False, index=True)

    email = Column(String(120), nullable=False)
    address = Column(Text, nullable=False)
    constituency = Column(String(100), nullable=False)

    department = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)

    status = Column(
        SAEnum(GrievanceStatus),
        default=GrievanceStatus.SUBMITTED,
        nullable=False
    )

    assigned_to = Column(String(100), nullable=True)
    remarks = Column(Text, nullable=True)

    attachment_url = Column(String(500), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )
  
    queries = relationship("GrievanceQuery", back_populates="grievance", cascade="all, delete")