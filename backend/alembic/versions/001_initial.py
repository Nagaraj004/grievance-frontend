"""Initial migration - create users and grievances tables

Revision ID: 001_initial
Revises: 
Create Date: 2025-03-05 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Users table
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(length=50), nullable=False),
        sa.Column("email", sa.String(length=100), nullable=True),
        sa.Column("full_name", sa.String(length=100), nullable=True),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column(
            "role",
            sa.Enum("admin", "minister", "citizen", name="userrole"),
            nullable=False,
            server_default="citizen",
        ),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)
    op.create_index(op.f("ix_users_username"), "users", ["username"], unique=True)

    # Grievances table
    op.create_table(
        "grievances",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("token", sa.String(length=20), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("mobile", sa.String(length=10), nullable=False),
        sa.Column("department", sa.String(length=50), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column(
            "status",
            sa.Enum(
                "SUBMITTED",
                "UNDER REVIEW",
                "ASSIGNED",
                "IN PROGRESS",
                "RESOLVED",
                "CLOSED",
                name="grievancestatus",
            ),
            nullable=False,
            server_default="SUBMITTED",
        ),
        sa.Column("assigned_to", sa.String(length=100), nullable=True),
        sa.Column("remarks", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_grievances_id"), "grievances", ["id"], unique=False)
    op.create_index(op.f("ix_grievances_token"), "grievances", ["token"], unique=True)
    op.create_index(op.f("ix_grievances_mobile"), "grievances", ["mobile"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_grievances_mobile"), table_name="grievances")
    op.drop_index(op.f("ix_grievances_token"), table_name="grievances")
    op.drop_index(op.f("ix_grievances_id"), table_name="grievances")
    op.drop_table("grievances")
    op.drop_index(op.f("ix_users_username"), table_name="users")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_table("users")
    op.execute("DROP TYPE IF EXISTS grievancestatus")
    op.execute("DROP TYPE IF EXISTS userrole")
