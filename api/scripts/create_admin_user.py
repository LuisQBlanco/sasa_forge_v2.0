import argparse
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from api.auth import hash_password
from api.db import SessionLocal
from api.models import User, UserRole


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--email", required=True)
    parser.add_argument("--password", required=True)
    parser.add_argument("--role", choices=["OWNER", "STAFF"], default="OWNER")
    args = parser.parse_args()

    db = SessionLocal()
    if db.query(User).filter(User.email == args.email).first():
        print("User already exists")
        return

    u = User(email=args.email, password_hash=hash_password(args.password), role=UserRole(args.role))
    db.add(u)
    db.commit()
    print(f"Created {args.role}: {args.email}")


if __name__ == "__main__":
    main()
