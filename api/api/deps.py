from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from api.auth import decode_token
from api.db import get_db
from api.models import User, UserRole


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = decode_token(token)
    user = db.get(User, int(payload["sub"]))
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role not in {UserRole.OWNER, UserRole.STAFF}:
        raise HTTPException(status_code=403, detail="Admin required")
    return user


def require_owner(user: User = Depends(get_current_user)) -> User:
    if user.role != UserRole.OWNER:
        raise HTTPException(status_code=403, detail="Owner required")
    return user
