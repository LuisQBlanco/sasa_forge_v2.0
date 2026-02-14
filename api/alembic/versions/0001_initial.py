from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    role_enum = sa.Enum("OWNER", "STAFF", name="userrole")
    quote_status = sa.Enum("New", "In Review", "Priced", "Accepted", "Closed", name="quotestatus")
    order_status = sa.Enum("Paid", "In Production", "Ready", "Shipped", "Delivered", name="orderstatus")
    payment_provider = sa.Enum("stripe", "interac", name="paymentprovider")
    payment_type = sa.Enum("order_full", "quote_deposit", "quote_final", name="paymenttype")
    payment_status = sa.Enum("PENDING", "PAID", "FAILED", name="paymentstatus")

    op.create_table("users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(255), unique=True, nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("role", role_enum, nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_table("customers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(50)),
        sa.Column("is_guest", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_table("products",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(180), nullable=False),
        sa.Column("slug", sa.String(180), nullable=False, unique=True),
        sa.Column("description", sa.Text()),
        sa.Column("lead_time_days", sa.Integer(), nullable=False, server_default="5"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_table("product_variants",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("size", sa.String(10), nullable=False),
        sa.Column("material", sa.String(40), nullable=False),
        sa.Column("sku", sa.String(80), nullable=False, unique=True),
        sa.Column("price_cad", sa.Numeric(10, 2), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
    )
    op.create_table("product_images",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("url", sa.String(500), nullable=False),
        sa.Column("alt_text", sa.String(255)),
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
    )
    op.create_table("shipping_settings",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("carrier_shipping_enabled", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("pickup_enabled", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("local_delivery_enabled", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )
    op.create_table("quotes",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("public_code", sa.String(24), nullable=False, unique=True),
        sa.Column("customer_id", sa.Integer(), sa.ForeignKey("customers.id"), nullable=False),
        sa.Column("status", quote_status, nullable=False, server_default="New"),
        sa.Column("material", sa.String(40), nullable=False),
        sa.Column("deadline", sa.Date()),
        sa.Column("notes", sa.Text()),
        sa.Column("priced_total", sa.Numeric(10, 2)),
        sa.Column("deposit_amount", sa.Numeric(10, 2)),
        sa.Column("final_due", sa.Numeric(10, 2)),
        sa.Column("currency", sa.String(3), nullable=False, server_default="CAD"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_table("quote_files",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("quote_id", sa.Integer(), sa.ForeignKey("quotes.id"), nullable=False),
        sa.Column("file_name", sa.String(255), nullable=False),
        sa.Column("mime_type", sa.String(120), nullable=False),
        sa.Column("storage_key", sa.String(500), nullable=False),
        sa.Column("size_bytes", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_table("orders",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("public_code", sa.String(24), nullable=False, unique=True),
        sa.Column("customer_id", sa.Integer(), sa.ForeignKey("customers.id"), nullable=False),
        sa.Column("status", order_status, nullable=False, server_default="Paid"),
        sa.Column("tracking_number", sa.String(120)),
        sa.Column("shipping_method", sa.String(40), nullable=False, server_default="carrier_shipping"),
        sa.Column("shipping_name", sa.String(120), nullable=False),
        sa.Column("shipping_line1", sa.String(255), nullable=False),
        sa.Column("shipping_city", sa.String(120), nullable=False),
        sa.Column("shipping_province", sa.String(60), nullable=False),
        sa.Column("shipping_postal_code", sa.String(20), nullable=False),
        sa.Column("shipping_country", sa.String(60), nullable=False, server_default="CA"),
        sa.Column("shipping_cost", sa.Numeric(10, 2), nullable=False, server_default="0"),
        sa.Column("total_amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("currency", sa.String(3), nullable=False, server_default="CAD"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_table("order_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("order_id", sa.Integer(), sa.ForeignKey("orders.id"), nullable=False),
        sa.Column("product_variant_id", sa.Integer(), sa.ForeignKey("product_variants.id"), nullable=False),
        sa.Column("name_snapshot", sa.String(180), nullable=False),
        sa.Column("size_snapshot", sa.String(10), nullable=False),
        sa.Column("material_snapshot", sa.String(40), nullable=False),
        sa.Column("unit_price", sa.Numeric(10, 2), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("line_total", sa.Numeric(10, 2), nullable=False),
    )
    op.create_table("payments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("provider", payment_provider, nullable=False),
        sa.Column("type", payment_type, nullable=False),
        sa.Column("status", payment_status, nullable=False, server_default="PENDING"),
        sa.Column("amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("currency", sa.String(3), nullable=False, server_default="CAD"),
        sa.Column("stripe_session_id", sa.String(255)),
        sa.Column("stripe_payment_intent_id", sa.String(255)),
        sa.Column("order_id", sa.Integer(), sa.ForeignKey("orders.id")),
        sa.Column("quote_id", sa.Integer(), sa.ForeignKey("quotes.id")),
        sa.Column("raw_payload", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    for t in ["payments", "order_items", "orders", "quote_files", "quotes", "shipping_settings", "product_images", "product_variants", "products", "customers", "users"]:
        op.drop_table(t)
