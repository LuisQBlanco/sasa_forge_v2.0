from datetime import date
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class MeOut(BaseModel):
    id: int
    email: EmailStr
    role: str


class ProductVariantOut(BaseModel):
    id: int
    size: str
    material: str
    sku: str
    price_cad: float


class ProductImageOut(BaseModel):
    id: int
    url: str
    alt_text: str | None = None


class ProductOut(BaseModel):
    id: int
    name: str
    slug: str
    description: str | None
    lead_time_days: int
    variants: list[ProductVariantOut]
    images: list[ProductImageOut]


class CartLineIn(BaseModel):
    variant_id: int
    quantity: int = Field(ge=1, le=100)


class CheckoutIn(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str | None = None
    shipping_line1: str
    shipping_city: str
    shipping_province: str
    shipping_postal_code: str
    shipping_country: str = "CA"
    shipping_method: Literal["carrier_shipping"]
    payment_method: Literal["stripe", "interac"]
    cart_lines: list[CartLineIn]


class QuoteCreateIn(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str | None = None
    material: str
    deadline: date | None = None
    notes: str | None = None


class QuotePriceIn(BaseModel):
    priced_total: float = Field(gt=0)


class UpdateOrderIn(BaseModel):
    status: str | None = None
    tracking_number: str | None = None
