from __future__ import annotations

from enum import Enum

from sqlalchemy import Boolean, Date, DateTime, Enum as SAEnum, ForeignKey, Integer, JSON, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.db import Base


class UserRole(str, Enum):
    OWNER = "OWNER"
    STAFF = "STAFF"


class QuoteStatus(str, Enum):
    NEW = "New"
    IN_REVIEW = "In Review"
    PRICED = "Priced"
    ACCEPTED = "Accepted"
    CLOSED = "Closed"


class OrderStatus(str, Enum):
    PAID = "Paid"
    IN_PRODUCTION = "In Production"
    READY = "Ready"
    SHIPPED = "Shipped"
    DELIVERED = "Delivered"


class PaymentProvider(str, Enum):
    STRIPE = "stripe"
    INTERAC = "interac"


class PaymentType(str, Enum):
    ORDER_FULL = "order_full"
    QUOTE_DEPOSIT = "quote_deposit"
    QUOTE_FINAL = "quote_final"


class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    FAILED = "FAILED"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole, name="userrole"))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped = mapped_column(DateTime(timezone=True), server_default=func.now())


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), index=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    is_guest: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped = mapped_column(DateTime(timezone=True), server_default=func.now())


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(180))
    slug: Mapped[str] = mapped_column(String(180), unique=True, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    lead_time_days: Mapped[int] = mapped_column(Integer, default=5)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped = mapped_column(DateTime(timezone=True), server_default=func.now())
    variants: Mapped[list["ProductVariant"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    images: Mapped[list["ProductImage"]] = relationship(back_populates="product", cascade="all, delete-orphan")


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    size: Mapped[str] = mapped_column(String(10))
    material: Mapped[str] = mapped_column(String(40))
    sku: Mapped[str] = mapped_column(String(80), unique=True)
    price_cad: Mapped[float] = mapped_column(Numeric(10, 2))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    product: Mapped[Product] = relationship(back_populates="variants")


class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    url: Mapped[str] = mapped_column(String(500))
    alt_text: Mapped[str | None] = mapped_column(String(255), nullable=True)
    position: Mapped[int] = mapped_column(Integer, default=0)
    product: Mapped[Product] = relationship(back_populates="images")


class ShippingSetting(Base):
    __tablename__ = "shipping_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    carrier_shipping_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    pickup_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    local_delivery_enabled: Mapped[bool] = mapped_column(Boolean, default=False)


class Quote(Base):
    __tablename__ = "quotes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    public_code: Mapped[str] = mapped_column(String(24), unique=True, index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    status: Mapped[QuoteStatus] = mapped_column(SAEnum(QuoteStatus, name="quotestatus"), default=QuoteStatus.NEW)
    material: Mapped[str] = mapped_column(String(40))
    deadline: Mapped[str | None] = mapped_column(Date, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    priced_total: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    deposit_amount: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    final_due: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    currency: Mapped[str] = mapped_column(String(3), default="CAD")
    created_at: Mapped = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    files: Mapped[list["QuoteFile"]] = relationship(cascade="all, delete-orphan")


class QuoteFile(Base):
    __tablename__ = "quote_files"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    quote_id: Mapped[int] = mapped_column(ForeignKey("quotes.id"))
    file_name: Mapped[str] = mapped_column(String(255))
    mime_type: Mapped[str] = mapped_column(String(120))
    storage_key: Mapped[str] = mapped_column(String(500))
    size_bytes: Mapped[int] = mapped_column(Integer)
    created_at: Mapped = mapped_column(DateTime(timezone=True), server_default=func.now())


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    public_code: Mapped[str] = mapped_column(String(24), unique=True, index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    status: Mapped[OrderStatus] = mapped_column(SAEnum(OrderStatus, name="orderstatus"), default=OrderStatus.PAID)
    tracking_number: Mapped[str | None] = mapped_column(String(120), nullable=True)
    shipping_method: Mapped[str] = mapped_column(String(40), default="carrier_shipping")
    shipping_name: Mapped[str] = mapped_column(String(120))
    shipping_line1: Mapped[str] = mapped_column(String(255))
    shipping_city: Mapped[str] = mapped_column(String(120))
    shipping_province: Mapped[str] = mapped_column(String(60))
    shipping_postal_code: Mapped[str] = mapped_column(String(20))
    shipping_country: Mapped[str] = mapped_column(String(60), default="CA")
    shipping_cost: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    total_amount: Mapped[float] = mapped_column(Numeric(10, 2))
    currency: Mapped[str] = mapped_column(String(3), default="CAD")
    created_at: Mapped = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    items: Mapped[list["OrderItem"]] = relationship(cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    product_variant_id: Mapped[int] = mapped_column(ForeignKey("product_variants.id"))
    name_snapshot: Mapped[str] = mapped_column(String(180))
    size_snapshot: Mapped[str] = mapped_column(String(10))
    material_snapshot: Mapped[str] = mapped_column(String(40))
    unit_price: Mapped[float] = mapped_column(Numeric(10, 2))
    quantity: Mapped[int] = mapped_column(Integer)
    line_total: Mapped[float] = mapped_column(Numeric(10, 2))


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    provider: Mapped[PaymentProvider] = mapped_column(SAEnum(PaymentProvider, name="paymentprovider"))
    type: Mapped[PaymentType] = mapped_column(SAEnum(PaymentType, name="paymenttype"))
    status: Mapped[PaymentStatus] = mapped_column(SAEnum(PaymentStatus, name="paymentstatus"), default=PaymentStatus.PENDING)
    amount: Mapped[float] = mapped_column(Numeric(10, 2))
    currency: Mapped[str] = mapped_column(String(3), default="CAD")
    stripe_session_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    stripe_payment_intent_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    order_id: Mapped[int | None] = mapped_column(ForeignKey("orders.id"), nullable=True)
    quote_id: Mapped[int | None] = mapped_column(ForeignKey("quotes.id"), nullable=True)
    raw_payload: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
