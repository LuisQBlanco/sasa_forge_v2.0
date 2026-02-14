from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.db import get_db
from api.models import Order, Quote, QuoteFile

router = APIRouter(prefix="/track", tags=["tracking"])


@router.get("/order/{public_code}")
def track_order(public_code: str, db: Session = Depends(get_db)):
    o = db.query(Order).filter(Order.public_code == public_code).first()
    if not o:
        raise HTTPException(404, "Order not found")
    return {
        "public_code": o.public_code,
        "status": o.status.value,
        "tracking_number": o.tracking_number,
        "updated_at": o.updated_at,
    }


@router.get("/quote/{public_code}")
def track_quote(public_code: str, db: Session = Depends(get_db)):
    q = db.query(Quote).filter(Quote.public_code == public_code).first()
    if not q:
        raise HTTPException(404, "Quote not found")
    files = db.query(QuoteFile).filter(QuoteFile.quote_id == q.id).count()
    return {
        "public_code": q.public_code,
        "status": q.status.value,
        "priced_total": float(q.priced_total) if q.priced_total else None,
        "deposit_amount": float(q.deposit_amount) if q.deposit_amount else None,
        "final_due": float(q.final_due) if q.final_due else None,
        "files_count": files,
    }
