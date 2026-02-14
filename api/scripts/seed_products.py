from api.db import SessionLocal
from api.models import Product, ProductVariant

DATA = [
    ("Articulated Dragon", "articulated-dragon", [25, 45, 80], ["PLA", "PETG"]),
    ("Custom Keychains", "custom-keychains", [8, 15, 25], ["PLA", "PETG", "TPU"]),
    ("Desk/Drawer Organizers", "desk-drawer-organizers", [20, 35, 60], ["PLA", "PETG"]),
    ("TAP", "tap-functional-parts", [30, 75, 150], ["PETG", "ASA"]),
    ("Cable clips/home organizers", "cable-clips-home-organizers", [10, 20, 35], ["PLA", "PETG", "TPU"]),
]

SIZES = ["S", "M", "L"]


def main():
    db = SessionLocal()
    for name, slug, prices, materials in DATA:
        p = db.query(Product).filter(Product.slug == slug).first()
        if not p:
            p = Product(name=name, slug=slug, description=f"{name} by SASA Forge", lead_time_days=5)
            db.add(p)
            db.flush()

        for idx, size in enumerate(SIZES):
            material = materials[min(idx, len(materials) - 1)]
            sku = f"{slug[:8].upper()}-{size}-{material}"
            if not db.query(ProductVariant).filter(ProductVariant.sku == sku).first():
                db.add(ProductVariant(product_id=p.id, size=size, material=material, sku=sku, price_cad=prices[idx]))

    db.commit()
    print("Seed complete")


if __name__ == "__main__":
    main()
