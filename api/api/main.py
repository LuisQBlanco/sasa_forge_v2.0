from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from api.config import settings
from api.routers import admin, auth, checkout, products, quotes, tracking
from api.storage.local import LocalStorage

app = FastAPI(title=settings.app_name)
storage = LocalStorage(settings.upload_dir)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")


@app.get("/health")
def health():
    return {"ok": True}


app.include_router(auth.router)
app.include_router(products.router)
app.include_router(checkout.router)
app.include_router(quotes.router)
app.include_router(tracking.router)
app.include_router(admin.router)
