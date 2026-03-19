from sqlalchemy.orm import Session
from app.db.database import SessionLocal, Base, engine
from app.models.user import User, UserRole
from app.models import *  # noqa: F401 — ensures all models are registered with Base
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password[:72])


# ── Users to seed (existing users will be skipped) ────────────────────────────
USERS = [
    {
        "username":  "admin",
        "email":     "admin@tn.gov.in",
        "full_name": "System Administrator",
        "password":  "admin",
        "role":      UserRole.admin,
    },
    {
        "username":  "minister",
        "email":     "minister@tn.gov.in",
        "full_name": "District Minister",
        "password":  "minister",
        "role":      UserRole.minister,
    },
    {
        "username":  "admin2",
        "email":     "admin2@tn.gov.in",
        "full_name": "Deputy Administrator",
        "password":  "admin2@1234",
        "role":      UserRole.admin,
    },
    {
        "username":  "minister2",
        "email":     "minister2@tn.gov.in",
        "full_name": "Assistant District Minister",
        "password":  "minister2@1234",
        "role":      UserRole.minister,
    },
]


def seed_users():
    # ── Ensure tables exist ────────────────────────────────────────────────────
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    try:
        for u in USERS:
            existing = db.query(User).filter(User.username == u["username"]).first()

            if existing:
                print(f"⏭️  Skipped  : {u['username']} (already exists)")
            else:
                db.add(User(
                    username=        u["username"],
                    email=           u["email"],
                    full_name=       u["full_name"],
                    hashed_password= get_password_hash(u["password"]),
                    role=            u["role"],
                    is_active=       True,
                ))
                print(f"➕ Inserted : {u['username']}")

        db.commit()
        print("\n✅ Seed complete!")

        # ── Verify ─────────────────────────────────────────────────────────────
        print("\n🔍 Current users in DB:")
        for user in db.query(User).order_by(User.id).all():
            print(f"   id={user.id} | {user.username} | {user.email} | role={user.role} | active={user.is_active}")

    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    from app.core.config import settings
    print(f"🔗 DB    : {settings.DATABASE_URL}")
    print(f"📂 Schema: {settings.DATABASE_SCHEMA}\n")
    seed_users()