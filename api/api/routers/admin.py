import os
from decimal import Decimal, ROUND_HALF_UP

import stripe
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from api.config import settings
from api.db import get_db
from api.deps import require_admin
from api.models import (
    Order,
    Payment,
    PaymentProvider,
    PaymentStatus,
    PaymentType,
    Product,
    ProductImage,
    ProductVariant,
    Quote,
    QuoteStatus,
)
from api.schemas import QuotePriceIn, UpdateOrderIn

stripe.api_key = settings.stripe_secret_key
router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_admin)])


@router.post("/products")
def create_product(payload: dict, db: Session = Depends(get_db)):
    if db.query(Product).filter(Product.slug == payload["slug"]).first():
        raise HTTPException(400, "Slug already exists")
    p = Product(
        name=payload["name"],
        slug=payload["slug"],
        description=payload.get("description"),
        lead_time_days=payload.get("lead_time_days", 5),
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return {"id": p.id}


@router.get("/products")
def admin_products(db: Session = Depends(get_db)):
    rows = db.query(Product).order_by(Product.id.desc()).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "slug": p.slug,
            "description": p.description,
            "lead_time_days": p.lead_time_days,
            "is_active": p.is_active,
            "variants_count": len(p.variants),
            "images_count": len(p.images),
        }
        for p in rows
    ]


@router.get("/products/{product_id}")
def admin_product(product_id: int, db: Session = Depends(get_db)):
    p = db.get(Product, product_id)
    if not p:
        raise HTTPException(404, "Not found")
    return {
        "id": p.id,
        "name": p.name,
        "slug": p.slug,
        "description": p.description,
        "lead_time_days": p.lead_time_days,
        "is_active": p.is_active,
        "variants": [
            {"id": v.id, "size": v.size, "material": v.material, "sku": v.sku, "price_cad": float(v.price_cad), "is_active": v.is_active}
            for v in p.variants
        ],
        "images": [{"id": i.id, "url": i.url, "alt_text": i.alt_text, "position": i.position} for i in sorted(p.images, key=lambda x: x.position)],
    }


@router.patch("/products/{product_id}")
def patch_product(product_id: int, payload: dict, db: Session = Depends(get_db)):
    p = db.get(Product, product_id)
    if not p:
        raise HTTPException(404, "Not found")
    for k in ["name", "slug", "description", "lead_time_days", "is_active"]:
        if k in payload:
            setattr(p, k, payload[k])
    db.commit()
    return {"ok": True}


@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    p = db.get(Product, product_id)
    if not p:
        raise HTTPException(404, "Not found")
    db.delete(p)
    db.commit()
    return {"ok": True}


@router.post("/products/{product_id}/variants")
def add_variant(product_id: int, payload: dict, db: Session = Depends(get_db)):
    p = db.get(Product, product_id)
    if not p:
        raise HTTPException(404, "Product not found")
    if db.query(ProductVariant).filter(ProductVariant.sku == payload["sku"]).first():
        raise HTTPException(400, "SKU already exists")
    v = ProductVariant(
        product_id=product_id,
        size=payload["size"],
        material=payload["material"],
        sku=payload["sku"],
        price_cad=payload["price_cad"],
    )
    db.add(v)
    db.commit()
    db.refresh(v)
    return {"id": v.id}


@router.delete("/products/{product_id}/variants/{variant_id}")
def delete_variant(product_id: int, variant_id: int, db: Session = Depends(get_db)):
    p = db.get(Product, product_id)
    if not p:
        raise HTTPException(404, "Product not found")
    v = db.get(ProductVariant, variant_id)
    if not v or v.product_id != product_id:
        raise HTTPException(404, "Variant not found")
    db.delete(v)
    db.commit()
    return {"ok": True}


@router.post("/products/{product_id}/images")
async def add_product_image(product_id: int, image: UploadFile = File(...), db: Session = Depends(get_db)):
    from api.main import storage

    p = db.get(Product, product_id)
    if not p:
        raise HTTPException(404, "Product not found")
    key, url = await storage.save_upload(image, f"products/{product_id}")
    pi = ProductImage(product_id=product_id, url=url)
    db.add(pi)
    db.commit()
    db.refresh(pi)
    return {"id": pi.id, "url": url, "storage_key": key}


@router.delete("/products/{product_id}/images/{image_id}")
def delete_product_image(product_id: int, image_id: int, db: Session = Depends(get_db)):
    p = db.get(Product, product_id)
    if not p:
        raise HTTPException(404, "Product not found")
    img = db.get(ProductImage, image_id)
    if not img or img.product_id != product_id:
        raise HTTPException(404, "Image not found")

    if img.url and img.url.startswith("/uploads/"):
        local_rel = img.url[len("/uploads/") :]
        local_path = os.path.join(settings.upload_dir, local_rel)
        if os.path.isfile(local_path):
            try:
                os.remove(local_path)
            except OSError:
                pass

    db.delete(img)
    db.commit()
    return {"ok": True}


@router.get("/orders")
def admin_orders(db: Session = Depends(get_db)):
    rows = db.query(Order).order_by(Order.id.desc()).all()
    return [
        {
            "id": o.id,
            "public_code": o.public_code,
            "status": o.status.value,
            "tracking_number": o.tracking_number,
            "total_amount": float(o.total_amount),
        }
        for o in rows
    ]


@router.get("/orders/{order_id}")
def admin_order(order_id: int, db: Session = Depends(get_db)):
    o = db.get(Order, order_id)
    if not o:
        raise HTTPException(404, "Not found")
    return {"id": o.id, "public_code": o.public_code, "status": o.status.value, "tracking_number": o.tracking_number}


@router.patch("/orders/{order_id}")
def update_order(order_id: int, payload: UpdateOrderIn, db: Session = Depends(get_db)):
    o = db.get(Order, order_id)
    if not o:
        raise HTTPException(404, "Not found")
    if payload.status:
        o.status = payload.status
    if payload.tracking_number is not None:
        o.tracking_number = payload.tracking_number
    db.commit()
    return {"ok": True}


@router.get("/quotes")
def admin_quotes(db: Session = Depends(get_db)):
    rows = db.query(Quote).order_by(Quote.id.desc()).all()
    return [{"id": q.id, "public_code": q.public_code, "status": q.status.value, "priced_total": float(q.priced_total) if q.priced_total else None} for q in rows]


@router.get("/quotes/{quote_id}")
def admin_quote(quote_id: int, db: Session = Depends(get_db)):
    q = db.get(Quote, quote_id)
    if not q:
        raise HTTPException(404, "Not found")
    return {"id": q.id, "public_code": q.public_code, "status": q.status.value, "priced_total": float(q.priced_total) if q.priced_total else None}


@router.post("/quotes/{quote_id}/price")
def price_quote(quote_id: int, payload: QuotePriceIn, db: Session = Depends(get_db)):
    q = db.get(Quote, quote_id)
    if not q:
        raise HTTPException(404, "Not found")

    total = Decimal(str(payload.priced_total))
    deposit = (total * Decimal("0.40")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    final_due = (total - deposit).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    q.priced_total = total
    q.deposit_amount = deposit
    q.final_due = final_due
    q.status = QuoteStatus.PRICED

    p = Payment(provider=PaymentProvider.STRIPE, type=PaymentType.QUOTE_DEPOSIT, status=PaymentStatus.PENDING, amount=deposit, quote_id=q.id)
    db.add(p)
    db.flush()

    session = stripe.checkout.Session.create(
        mode="payment",
        payment_method_types=["card"],
        line_items=[{
            "price_data": {"currency": "cad", "product_data": {"name": f"Quote Deposit {q.public_code}"}, "unit_amount": int(deposit * 100)},
            "quantity": 1,
        }],
        success_url=settings.stripe_success_url,
        cancel_url=settings.stripe_cancel_url,
        metadata={"payment_id": str(p.id), "payment_type": "quote_deposit"},
    )
    p.stripe_session_id = session.id
    db.commit()
    return {"quote_id": q.id, "deposit": float(deposit), "final_due": float(final_due), "deposit_checkout_url": session.url}


@router.post("/quotes/{quote_id}/final-payment-link")
def final_link(quote_id: int, db: Session = Depends(get_db)):
    q = db.get(Quote, quote_id)
    if not q or not q.final_due:
        raise HTTPException(400, "Quote not priced")

    p = Payment(provider=PaymentProvider.STRIPE, type=PaymentType.QUOTE_FINAL, status=PaymentStatus.PENDING, amount=q.final_due, quote_id=q.id)
    db.add(p)
    db.flush()

    session = stripe.checkout.Session.create(
        mode="payment",
        payment_method_types=["card"],
        line_items=[{
            "price_data": {"currency": "cad", "product_data": {"name": f"Quote Final Payment {q.public_code}"}, "unit_amount": int(Decimal(str(q.final_due)) * 100)},
            "quantity": 1,
        }],
        success_url=settings.stripe_success_url,
        cancel_url=settings.stripe_cancel_url,
        metadata={"payment_id": str(p.id), "payment_type": "quote_final"},
    )
    p.stripe_session_id = session.id
    db.commit()
    return {"final_checkout_url": session.url}


@router.patch("/quotes/{quote_id}")
def patch_quote(quote_id: int, payload: dict, db: Session = Depends(get_db)):
    q = db.get(Quote, quote_id)
    if not q:
        raise HTTPException(404, "Not found")
    if "status" in payload:
        q.status = payload["status"]
    db.commit()
    return {"ok": True}


@router.patch("/payments/{payment_id}/mark-paid")
def mark_interac_paid(payment_id: int, db: Session = Depends(get_db)):
    p = db.get(Payment, payment_id)
    if not p:
        raise HTTPException(404, "Not found")
    p.status = PaymentStatus.PAID
    db.commit()
    return {"ok": True}
