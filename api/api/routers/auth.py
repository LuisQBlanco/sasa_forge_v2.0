from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.auth import create_access_token, verify_password
from api.db import get_db
from api.deps import get_current_user
from api.models import User
from api.rate_limit import limiter
from api.schemas import LoginIn, MeOut, TokenOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenOut, dependencies=[Depends(limiter("login", 10, 60))])
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(str(user.id), user.role.value)
    return TokenOut(access_token=token)


@router.get("/me", response_model=MeOut)
def me(user: User = Depends(get_current_user)):
    return MeOut(id=user.id, email=user.email, role=user.role.value)
