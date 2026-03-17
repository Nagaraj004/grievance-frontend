from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class GrievanceQuery(Base):
    __tablename__ = "grievance_queries"

    id = Column(Integer, primary_key=True)
    grievance_token = Column(String, ForeignKey("grievances.token"))

    message = Column(Text, nullable=False)
    sender = Column(String(20))  # user/admin

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    grievance = relationship("Grievance", back_populates="queries")