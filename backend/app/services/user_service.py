from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password


def get_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()


def authenticate(db: Session, username: str, password: str) -> Optional[User]:
    user = get_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    if not user.is_active:
        return None
    return user


def create_user(db: Session, payload: UserCreate) -> User:
    user = User(
        username=payload.username,
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=get_password_hash(payload.password),
        role=payload.role,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def seed_default_users(db: Session) -> None:
    """Create admin and minister accounts if they don't exist."""
    defaults = [
        {"username": "admin", "password": "admin123", "role": UserRole.admin,
         "full_name": "System Administrator", "email": "admin@tn.gov.in"},
        {"username": "minister", "password": "tnmin123", "role": UserRole.minister,
         "full_name": "District Minister", "email": "minister@tn.gov.in"},
    ]
    for u in defaults:
        if not get_by_username(db, u["username"]):
            user = User(
                username=u["username"],
                email=u["email"],
                full_name=u["full_name"],
                hashed_password=get_password_hash(u["password"]),
                role=u["role"],
                is_active=True,
            )
            db.add(user)
    db.commit()
