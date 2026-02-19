import argparse
import os
import sys

from pydantic import EmailStr, TypeAdapter, ValidationError

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from api.auth import hash_password
from api.db import SessionLocal
from api.models import User, UserRole

EMAIL_VALIDATOR = TypeAdapter(EmailStr)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--email", required=True)
    parser.add_argument("--password", required=True)
    parser.add_argument("--role", choices=["OWNER", "STAFF"], default="OWNER")
    args = parser.parse_args()

    try:
        email = str(EMAIL_VALIDATOR.validate_python(args.email)).lower()
    except ValidationError as ex:
        print(f"Invalid email: {ex.errors()[0].get('msg', 'unknown validation error')}")
        raise SystemExit(1)

    db = SessionLocal()
    if db.query(User).filter(User.email == email).first():
        print("User already exists")
        return

    u = User(email=email, password_hash=hash_password(args.password), role=UserRole(args.role))
    db.add(u)
    db.commit()
    print(f"Created {args.role}: {email}")


if __name__ == "__main__":
    main()
