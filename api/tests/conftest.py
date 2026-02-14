import pytest
from fastapi.testclient import TestClient

from api.auth import hash_password
from api.db import SessionLocal
from api.main import app
from api.models import User, UserRole


@pytest.fixture(scope="session")
def client():
    return TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def seed_admin():
    db = SessionLocal()
    if not db.query(User).filter(User.email == "admin@test.com").first():
        db.add(User(email="admin@test.com", password_hash=hash_password("admin123"), role=UserRole.OWNER))
        db.commit()
