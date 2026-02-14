from decimal import Decimal

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from api.config import settings
from api.db import get_db
from api.models import (
    Customer,
    Order,
    OrderItem,
    Payment,
    PaymentProvider,
    PaymentStatus,
    PaymentType,
    ProductVariant,
    Quote,
    QuoteStatus,
    ShippingSetting,
)
from api.rate_limit import limiter
from api.schemas import CheckoutIn
from api.utils import public_code

stripe.api_key = settings.stripe_secret_key
router = APIRouter(tags=["checkout"])


def _get_or_create_customer(db: Session, name: str, email: str, phone: str | None) -> Customer:
    c = db.query(Customer).filter(Customer.email == email).first()
    if c:
        c.name = name
        c.phone = phone
        return c
    c = Customer(name=name, email=email, phone=phone, is_guest=True)
    db.add(c)
    db.flush()
    return c


def _create_order_from_payment(db: Session, payment: Payment) -> Order:
    payload = payment.raw_payload or {}
    order = Order(
        public_code=public_code("ORD"),
        customer_id=payload["customer_id"],
        shipping_name=payload["shipping_name"],
        shipping_line1=payload["shipping_line1"],
        shipping_city=payload["shipping_city"],
        shipping_province=payload["shipping_province"],
        shipping_postal_code=payload["shipping_postal_code"],
        shipping_country=payload["shipping_country"],
        shipping_method="carrier_shipping",
        total_amount=Decimal(str(payment.amount)),
    )
    db.add(order)
    db.flush()
    for line in payload["cart_lines"]:
        v = db.get(ProductVariant, line["variant_id"])
        qty = int(line["quantity"])
        db.add(
            OrderItem(
                order_id=order.id,
                product_variant_id=v.id,
                name_snapshot=v.product.name,
                size_snapshot=v.size,
                material_snapshot=v.material,
                unit_price=v.price_cad,
                quantity=qty,
                line_total=Decimal(str(v.price_cad)) * qty,
            )
        )
    payment.order_id = order.id
    return order


@router.post("/checkout/session", dependencies=[Depends(limiter("checkout", 20, 60))])
def checkout_session(payload: CheckoutIn, db: Session = Depends(get_db)):
    shipping = db.query(ShippingSetting).first()
    if not shipping:
        shipping = ShippingSetting(carrier_shipping_enabled=True)
        db.add(shipping)
        db.flush()

    if payload.shipping_method != "carrier_shipping" or not shipping.carrier_shipping_enabled:
        raise HTTPException(400, "Only carrier shipping is available")

    variant_ids = [l.variant_id for l in payload.cart_lines]
    variants = {v.id: v for v in db.query(ProductVariant).filter(ProductVariant.id.in_(variant_ids)).all()}
    if len(variants) != len(payload.cart_lines):
        raise HTTPException(400, "Invalid cart variant")

    total = Decimal("0")
    line_items = []
    normalized = []
    for line in payload.cart_lines:
        v = variants[line.variant_id]
        qty = int(line.quantity)
        total += Decimal(str(v.price_cad)) * qty
        normalized.append({"variant_id": v.id, "quantity": qty})
        line_items.append(
            {
                "price_data": {
                    "currency": "cad",
                    "product_data": {"name": f"{v.product.name} ({v.size}/{v.material})"},
                    "unit_amount": int(Decimal(str(v.price_cad)) * 100),
                },
                "quantity": qty,
            }
        )

    customer = _get_or_create_customer(db, payload.customer_name, payload.customer_email, payload.customer_phone)
    payment = Payment(
        provider=PaymentProvider.STRIPE if payload.payment_method == "stripe" else PaymentProvider.INTERAC,
        type=PaymentType.ORDER_FULL,
        status=PaymentStatus.PENDING,
        amount=total,
        raw_payload={
            "customer_id": customer.id,
            "shipping_name": payload.customer_name,
            "shipping_line1": payload.shipping_line1,
            "shipping_city": payload.shipping_city,
            "shipping_province": payload.shipping_province,
            "shipping_postal_code": payload.shipping_postal_code,
            "shipping_country": payload.shipping_country,
            "cart_lines": normalized,
        },
    )
    db.add(payment)
    db.flush()

    if payload.payment_method == "interac":
        db.commit()
        return {
            "provider": "interac",
            "payment_id": payment.id,
            "status": "PENDING",
            "instructions": settings.interac_instructions,
            "recipient": settings.interac_email,
        }

    session = stripe.checkout.Session.create(
        mode="payment",
        payment_method_types=["card"],
        line_items=line_items,
        success_url=settings.stripe_success_url,
        cancel_url=settings.stripe_cancel_url,
        metadata={"payment_id": str(payment.id), "payment_type": "order_full"},
    )
    payment.stripe_session_id = session.id
    db.commit()
    return {"provider": "stripe", "checkout_url": session.url, "payment_id": payment.id}


@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    sig = request.headers.get("stripe-signature")
    body = await request.body()
    try:
        event = stripe.Webhook.construct_event(body, sig, settings.stripe_webhook_secret)
    except Exception:
        raise HTTPException(400, "Invalid Stripe signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        payment_id = int(session["metadata"]["payment_id"])
        payment = db.get(Payment, payment_id)
        if payment:
            payment.status = PaymentStatus.PAID
            payment.stripe_payment_intent_id = session.get("payment_intent")
            if payment.type == PaymentType.ORDER_FULL and payment.order_id is None:
                _create_order_from_payment(db, payment)
            if payment.quote_id:
                quote = db.get(Quote, payment.quote_id)
                if payment.type == PaymentType.QUOTE_DEPOSIT:
                    quote.status = QuoteStatus.ACCEPTED
                elif payment.type == PaymentType.QUOTE_FINAL:
                    quote.status = QuoteStatus.CLOSED
            db.commit()
    return {"received": True}
