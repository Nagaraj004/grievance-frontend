"""
Database seeding script for demo data.
Run this script to populate the database with sample users and grievances.

Usage:
    python seed.py
"""
from datetime import datetime, timedelta
from app.db.database import SessionLocal
from app.models.grievance import Grievance, GrievanceStatus
from app.services.user_service import seed_default_users


def seed_demo_users(db) -> None:
    """Seed default admin and minister users."""
    print("Seeding default users...")
    seed_default_users(db)
    print("✓ Default users created")


def seed_demo_grievances(db) -> None:
    """Seed sample grievances for demo purposes."""
    print("Seeding demo grievances...")
    
    existing = db.query(Grievance).count()
    if existing > 0:
        print(f"⚠ Database already has {existing} grievances. Skipping demo data.")
        return

    demos = [
        {
            "token": "GRV25DEMO01",
            "name": "Ramesh Kumar",
            "mobile": "9876543210",
            "department": "Roads & Infrastructure",
            "description": "The road in front of our village has many potholes and is dangerous for vehicles. Repair is urgently needed.",
            "status": GrievanceStatus.IN_PROGRESS,
            "assigned_to": "District Engineer",
            "remarks": "Work order issued. Repair scheduled for next week.",
            "days_ago": 7,
        },
        {
            "token": "GRV25DEMO02",
            "name": "Sunita Devi",
            "mobile": "9876543210",
            "department": "Water Supply",
            "description": "Our village has not received water supply for the last 15 days. Children and elderly are suffering.",
            "status": GrievanceStatus.ASSIGNED,
            "assigned_to": "Water Board Officer",
            "remarks": None,
            "days_ago": 5,
        },
        {
            "token": "GRV25DEMO03",
            "name": "Arjun Singh",
            "mobile": "8765432109",
            "department": "Education",
            "description": "The government school in Ward 5 does not have proper toilets for girls. This is causing dropouts.",
            "status": GrievanceStatus.UNDER_REVIEW,
            "assigned_to": None,
            "remarks": None,
            "days_ago": 3,
        },
        {
            "token": "GRV25DEMO04",
            "name": "Priya Sharma",
            "mobile": "7654321098",
            "department": "Electricity",
            "description": "Street lights in our colony have not been working for 2 months. Night travel is unsafe.",
            "status": GrievanceStatus.RESOLVED,
            "assigned_to": "TNEB Officer",
            "remarks": "All 12 street lights repaired and functional.",
            "days_ago": 14,
        },
        {
            "token": "GRV25DEMO05",
            "name": "Mohan Lal",
            "mobile": "6543210987",
            "department": "Social Welfare",
            "description": "My pension has been stopped without any notice for the past 3 months. I am 72 years old and depend on it.",
            "status": GrievanceStatus.SUBMITTED,
            "assigned_to": None,
            "remarks": None,
            "days_ago": 1,
        },
        {
            "token": "GRV25DEMO06",
            "name": "Kavya Reddy",
            "mobile": "9123456789",
            "department": "Health",
            "description": "Hospital near our village does not have a doctor for last 2 weeks. Patients are forced to travel 50km.",
            "status": GrievanceStatus.CLOSED,
            "assigned_to": "CMO Office",
            "remarks": "Doctor appointment made. Doctor resumed duty.",
            "days_ago": 20,
        },
    ]

    for d in demos:
        created = datetime.utcnow() - timedelta(days=d["days_ago"])
        g = Grievance(
            token=d["token"],
            name=d["name"],
            mobile=d["mobile"],
            department=d["department"],
            description=d["description"],
            status=d["status"],
            assigned_to=d["assigned_to"],
            remarks=d["remarks"],
            created_at=created,
            updated_at=created,
        )
        db.add(g)
    
    db.commit()
    print(f"✓ Created {len(demos)} demo grievances")


def main():
    """Main seeding function."""
    print("\n" + "="*50)
    print("Tamil Nadu Grievance Portal - Database Seeding")
    print("="*50 + "\n")
    
    db = SessionLocal()
    try:
        seed_demo_users(db)
        seed_demo_grievances(db)
        print("\n✓ Database seeding completed successfully!\n")
        print("Demo Credentials:")
        print("  Admin:    username='admin'    password='admin123'")
        print("  Minister: username='minister' password='minister123'")
        print("\nDemo Tokens: GRV25DEMO01 to GRV25DEMO06")
        print("="*50 + "\n")
    except Exception as e:
        print(f"\n✗ Error during seeding: {e}\n")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()