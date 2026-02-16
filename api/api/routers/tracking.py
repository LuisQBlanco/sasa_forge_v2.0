from decimal import Decimal

import stripe
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.config import settings
from api.db import get_db
from api.models import Order, Payment, PaymentProvider, PaymentStatus, PaymentType, Quote, QuoteFile

router = APIRouter(prefix="/track", tags=["tracking"])
stripe.api_key = settings.stripe_secret_key


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
    deposit_paid = (
        db.query(Payment)
        .filter(Payment.quote_id == q.id, Payment.type == PaymentType.QUOTE_DEPOSIT, Payment.status == PaymentStatus.PAID)
        .first()
        is not None
    )
    final_paid = (
        db.query(Payment)
        .filter(Payment.quote_id == q.id, Payment.type == PaymentType.QUOTE_FINAL, Payment.status == PaymentStatus.PAID)
        .first()
        is not None
    )
    return {
        "public_code": q.public_code,
        "status": q.status.value,
        "priced_total": float(q.priced_total) if q.priced_total else None,
        "deposit_amount": float(q.deposit_amount) if q.deposit_amount else None,
        "final_due": float(q.final_due) if q.final_due else None,
        "deposit_paid": deposit_paid,
        "final_paid": final_paid,
        "files_count": files,
    }


@router.post("/quote/{public_code}/payment-link")
def quote_payment_link(public_code: str, payload: dict, db: Session = Depends(get_db)):
    q = db.query(Quote).filter(Quote.public_code == public_code).first()
    if not q:
        raise HTTPException(404, "Quote not found")

    kind = (payload.get("kind") or "").lower()
    if kind not in {"deposit", "final"}:
        raise HTTPException(400, "kind must be 'deposit' or 'final'")
    if not settings.stripe_secret_key:
        raise HTTPException(503, "Stripe is not configured")

    if kind == "deposit":
        if not q.deposit_amount:
            raise HTTPException(400, "Deposit is not available for this quote")
        already_paid = (
            db.query(Payment)
            .filter(Payment.quote_id == q.id, Payment.type == PaymentType.QUOTE_DEPOSIT, Payment.status == PaymentStatus.PAID)
            .first()
            is not None
        )
        if already_paid:
            raise HTTPException(400, "Deposit has already been paid")
        amount = Decimal(str(q.deposit_amount))
        payment_type = PaymentType.QUOTE_DEPOSIT
        label = f"Quote Deposit {q.public_code}"
    else:
        if not q.final_due:
            raise HTTPException(400, "Final payment is not available for this quote")
        deposit_paid = (
            db.query(Payment)
            .filter(Payment.quote_id == q.id, Payment.type == PaymentType.QUOTE_DEPOSIT, Payment.status == PaymentStatus.PAID)
            .first()
            is not None
        )
        if not deposit_paid:
            raise HTTPException(400, "Deposit must be paid before final payment")
        already_paid = (
            db.query(Payment)
            .filter(Payment.quote_id == q.id, Payment.type == PaymentType.QUOTE_FINAL, Payment.status == PaymentStatus.PAID)
            .first()
            is not None
        )
        if already_paid:
            raise HTTPException(400, "Final payment has already been paid")
        amount = Decimal(str(q.final_due))
        payment_type = PaymentType.QUOTE_FINAL
        label = f"Quote Final Payment {q.public_code}"

    p = Payment(
        provider=PaymentProvider.STRIPE,
        type=payment_type,
        status=PaymentStatus.PENDING,
        amount=amount,
        quote_id=q.id,
    )
    db.add(p)
    db.flush()

    session = stripe.checkout.Session.create(
        mode="payment",
        payment_method_types=["card"],
        line_items=[
            {
                "price_data": {
                    "currency": "cad",
                    "product_data": {"name": label},
                    "unit_amount": int(amount * 100),
                },
                "quantity": 1,
            }
        ],
        success_url=settings.stripe_success_url,
        cancel_url=settings.stripe_cancel_url,
        metadata={"payment_id": str(p.id), "payment_type": payment_type.value},
    )
    p.stripe_session_id = session.id
    db.commit()
    return {"checkout_url": session.url, "payment_id": p.id, "kind": kind}
