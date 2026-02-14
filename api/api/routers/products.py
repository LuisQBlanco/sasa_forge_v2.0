from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.db import get_db
from api.models import Product
from api.schemas import ProductOut

router = APIRouter(prefix="/products", tags=["products"])


def to_out(p: Product) -> ProductOut:
    return ProductOut(
        id=p.id,
        name=p.name,
        slug=p.slug,
        description=p.description,
        lead_time_days=p.lead_time_days,
        variants=[
            {"id": v.id, "size": v.size, "material": v.material, "sku": v.sku, "price_cad": float(v.price_cad)}
            for v in p.variants
            if v.is_active
        ],
        images=[{"id": i.id, "url": i.url, "alt_text": i.alt_text} for i in sorted(p.images, key=lambda x: x.position)],
    )


@router.get("", response_model=list[ProductOut])
def list_products(db: Session = Depends(get_db)):
    return [to_out(p) for p in db.query(Product).filter(Product.is_active.is_(True)).all()]


@router.get("/{slug}", response_model=ProductOut)
def get_product(slug: str, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.slug == slug, Product.is_active.is_(True)).first()
    if not p:
        raise HTTPException(404, "Product not found")
    return to_out(p)
