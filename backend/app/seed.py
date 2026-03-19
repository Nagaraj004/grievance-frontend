from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import User, UserRole
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def seed_users():
    db: Session = SessionLocal()

    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin_user = User(
                username="admin",
                email="admin@tn.gov.in",
                full_name="System Administrator",
                hashed_password=get_password_hash("admin"),
                role=UserRole.admin,
                is_active=True
            )
            db.add(admin_user)

        # Check if minister already exists
        minister = db.query(User).filter(User.username == "minister").first()
        if not minister:
            minister_user = User(
                username="minister",
                email="minister@tn.gov.in",
                full_name="District Minister",
                hashed_password=get_password_hash("minister"),
                role=UserRole.minister,
                is_active=True
            )
            db.add(minister_user)

        db.commit()
        print("✅ Seed data inserted successfully!")

    except Exception as e:
        db.rollback()
        print("❌ Error seeding data:", str(e))

    finally:
        db.close()


if __name__ == "__main__":
    seed_users()