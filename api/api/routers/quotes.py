import os

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from api.db import get_db
from api.models import Customer, Quote, QuoteFile, QuoteStatus
from api.rate_limit import limiter
from api.schemas import QuoteCreateIn
from api.utils import public_code

ALLOWED_EXT = {".stl", ".3mf", ".step", ".png", ".jpg", ".jpeg"}
router = APIRouter(prefix="/quotes", tags=["quotes"])


@router.post("", dependencies=[Depends(limiter("quote", 15, 60))])
def create_quote(payload: QuoteCreateIn, db: Session = Depends(get_db)):
    c = db.query(Customer).filter(Customer.email == payload.customer_email).first()
    if not c:
        c = Customer(name=payload.customer_name, email=payload.customer_email, phone=payload.customer_phone, is_guest=True)
        db.add(c)
        db.flush()

    q = Quote(
        public_code=public_code("QTE"),
        customer_id=c.id,
        status=QuoteStatus.NEW,
        material=payload.material,
        deadline=payload.deadline,
        notes=payload.notes,
    )
    db.add(q)
    db.commit()
    db.refresh(q)
    return {"id": q.id, "public_code": q.public_code, "status": q.status.value, "sla_hours": 48}


@router.post("/{quote_id}/files", dependencies=[Depends(limiter("quote_files", 30, 60))])
async def upload_quote_file(quote_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    from api.main import storage

    quote = db.get(Quote, quote_id)
    if not quote:
        raise HTTPException(404, "Quote not found")

    ext = os.path.splitext((file.filename or "").lower())[1]
    if ext not in ALLOWED_EXT:
        raise HTTPException(400, "Invalid file type")

    content = await file.read()
    if len(content) > 100 * 1024 * 1024:
        raise HTTPException(400, "File too large")
    file.file.seek(0)

    key, _url = await storage.save_upload(file, f"quotes/{quote_id}")
    qf = QuoteFile(
        quote_id=quote_id,
        file_name=file.filename,
        mime_type=file.content_type or "application/octet-stream",
        storage_key=key,
        size_bytes=len(content),
    )
    db.add(qf)
    if quote.status == QuoteStatus.NEW:
        quote.status = QuoteStatus.IN_REVIEW
    db.commit()
    return {"id": qf.id, "file_name": qf.file_name, "storage_key": qf.storage_key}
