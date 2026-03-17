from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create engine with schema search path
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    connect_args={
        "options": f"-csearch_path={settings.DATABASE_SCHEMA},public"
    } if settings.DATABASE_SCHEMA else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base with schema
Base = declarative_base()
if settings.DATABASE_SCHEMA:
    Base.metadata.schema = settings.DATABASE_SCHEMA


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()