"use client";

import { useEffect, useMemo, useState } from "react";

import AdminShell from "@/components/AdminShell";
import Button from "@/components/Button";
import { siteContent } from "@/content/siteContent";
import { API } from "@/lib/api";

type ProductRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  lead_time_days: number;
  is_active: boolean;
  variants_count: number;
  images_count: number;
};

type ProductDetails = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  lead_time_days: number;
  is_active: boolean;
  variants: Array<{ id: number; size: string; material: string; sku: string; price_cad: number; is_active: boolean }>;
  images: Array<{ id: number; url: string; alt_text: string | null; position: number }>;
};

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<ProductDetails | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [leadTime, setLeadTime] = useState("5");
  const [createMessage, setCreateMessage] = useState("");

  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLeadTime, setEditLeadTime] = useState("5");
  const [editActive, setEditActive] = useState(true);
  const [editMessage, setEditMessage] = useState("");

  const [variantSize, setVariantSize] = useState("M");
  const [variantMaterial, setVariantMaterial] = useState("PLA");
  const [variantSku, setVariantSku] = useState("");
  const [variantPrice, setVariantPrice] = useState("25");
  const [variantMessage, setVariantMessage] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageMessage, setImageMessage] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const selected = useMemo(() => products.find((p) => p.id === selectedId) || null, [products, selectedId]);

  async function refreshProducts() {
    if (!token) {
      setNeedsLogin(true);
      return;
    }
    const res = await fetch(`${API}/admin/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401 || res.status === 403) {
      setNeedsLogin(true);
      return;
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      setNeedsLogin(false);
      setProducts(data);
      if (data.length > 0 && (selectedId === null || !data.some((p: ProductRow) => p.id === selectedId))) {
        setSelectedId(data[0].id);
      }
      if (data.length === 0) {
        setSelectedId(null);
        setSelectedDetails(null);
      }
    }
  }

  async function refreshSelectedDetails(productId: number) {
    if (!token) {
      setNeedsLogin(true);
      return;
    }
    const res = await fetch(`${API}/admin/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setSelectedDetails(data);
    } else {
      setSelectedDetails(null);
    }
  }

  useEffect(() => {
    refreshProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setSelectedDetails(null);
      return;
    }
    refreshSelectedDetails(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    if (!selected) return;
    setEditName(selected.name);
    setEditSlug(selected.slug);
    setEditDescription(selected.description || "");
    setEditLeadTime(String(selected.lead_time_days));
    setEditActive(selected.is_active);
  }, [selected]);

  async function createProduct() {
    setCreateMessage("");
    if (!token) {
      setNeedsLogin(true);
      setCreateMessage("Please login first.");
      return;
    }
    const createRes = await fetch(`${API}/admin/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name,
        slug: slug || slugify(name),
        description,
        lead_time_days: Number(leadTime || "5"),
      }),
    });
    const createData = await createRes.json();
    if (!createRes.ok) {
      setCreateMessage(createData.detail || "Failed to create product");
      return;
    }
    setCreateMessage("Product created");
    setName("");
    setSlug("");
    setDescription("");
    setLeadTime("5");
    await refreshProducts();
    if (createData.id) setSelectedId(createData.id);
  }

  async function saveEdit() {
    setEditMessage("");
    if (!token || !selected) {
      if (!token) setNeedsLogin(true);
      setEditMessage("Select a product and login.");
      return;
    }
    const res = await fetch(`${API}/admin/products/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: editName,
        slug: editSlug,
        description: editDescription,
        lead_time_days: Number(editLeadTime || "5"),
        is_active: editActive,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setEditMessage(data.detail || "Failed to update product");
      return;
    }
    setEditMessage("Product updated");
    await refreshProducts();
    await refreshSelectedDetails(selected.id);
  }

  async function deleteProduct() {
    setEditMessage("");
    if (!token || !selected) return;
    if (!confirm(`Delete product "${selected.name}"? This removes its variants and images.`)) return;

    const res = await fetch(`${API}/admin/products/${selected.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      setEditMessage(data.detail || "Failed to delete product");
      return;
    }
    setEditMessage("Product deleted");
    setSelectedId(null);
    setSelectedDetails(null);
    await refreshProducts();
  }

  async function addVariant() {
    setVariantMessage("");
    if (!token || !selected) {
      if (!token) setNeedsLogin(true);
      setVariantMessage("Select a product and login.");
      return;
    }
    const res = await fetch(`${API}/admin/products/${selected.id}/variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        size: variantSize,
        material: variantMaterial,
        sku: variantSku,
        price_cad: Number(variantPrice),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setVariantMessage(data.detail || "Failed to add variant");
      return;
    }
    setVariantMessage("Variant added");
    setVariantSku("");
    await refreshProducts();
    await refreshSelectedDetails(selected.id);
  }

  async function deleteVariant(variantId: number) {
    setVariantMessage("");
    if (!token || !selected) return;
    if (!confirm(`Delete variant #${variantId}?`)) return;

    const res = await fetch(`${API}/admin/products/${selected.id}/variants/${variantId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      setVariantMessage(data.detail || "Failed to delete variant");
      return;
    }
    setVariantMessage("Variant deleted");
    await refreshProducts();
    await refreshSelectedDetails(selected.id);
  }

  async function uploadImage() {
    setImageMessage("");
    if (!token || !selected || !imageFile) {
      if (!token) setNeedsLogin(true);
      setImageMessage("Select a product and choose an image.");
      return;
    }
    const fd = new FormData();
    fd.append("image", imageFile);

    const res = await fetch(`${API}/admin/products/${selected.id}/images`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) {
      setImageMessage(data.detail || "Failed to upload image");
      return;
    }
    setImageMessage("Image uploaded");
    setImageFile(null);
    await refreshProducts();
    await refreshSelectedDetails(selected.id);
  }

  async function deleteImage(imageId: number) {
    setImageMessage("");
    if (!token || !selected) return;
    if (!confirm(`Delete image #${imageId}?`)) return;

    const res = await fetch(`${API}/admin/products/${selected.id}/images/${imageId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      setImageMessage(data.detail || "Failed to delete image");
      return;
    }
    setImageMessage("Image deleted");
    await refreshProducts();
    await refreshSelectedDetails(selected.id);
  }

  return (
    <AdminShell title={siteContent.admin.sidebar[1]} subtitle="Create products, add descriptions/images/variants, and remove records.">
      {needsLogin && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Admin session required. Please sign in first.
          <div className="mt-3">
            <Button href="/admin/login" variant="secondary" className="px-4 py-2 text-xs">
              Go To Admin Login
            </Button>
          </div>
        </div>
      )}
      <div className="space-y-8">
        <div className="rounded-2xl border border-slate-200 p-4">
          <h2 className="text-lg font-bold text-slate-900">Create Product</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={name}
              onChange={(e) => {
                const next = e.target.value;
                setName(next);
                if (!slug) setSlug(slugify(next));
              }}
              placeholder="Name"
            />
            <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="Slug" />
            <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm md:col-span-2" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} placeholder="Lead time days" />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={createProduct}>Create Product</Button>
            <button onClick={refreshProducts} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              Refresh
            </button>
          </div>
          {createMessage && <p className="mt-3 text-sm font-medium text-blue-700">{createMessage}</p>}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="border-b bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">Product Records</div>
            <div className="max-h-[500px] overflow-y-auto">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`flex w-full items-start justify-between border-b px-4 py-3 text-left text-sm ${
                    selectedId === p.id ? "bg-blue-50" : "bg-white hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.slug}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      variants: {p.variants_count} | images: {p.images_count}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs ${p.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                    {p.is_active ? "active" : "inactive"}
                  </span>
                </button>
              ))}
              {products.length === 0 && <p className="p-4 text-sm text-slate-500">No products found.</p>}
            </div>
          </div>

          <div className="space-y-4">
            {!selected ? (
              <p className="text-sm text-slate-500">Select a product to manage details.</p>
            ) : (
              <>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-bold text-slate-900">Edit Product #{selected.id}</h3>
                    <button onClick={deleteProduct} className="rounded-full border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50">
                      Delete Product
                    </button>
                  </div>
                  <div className="mt-3 grid gap-3">
                    <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" />
                    <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={editSlug} onChange={(e) => setEditSlug(slugify(e.target.value))} placeholder="Slug" />
                    <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Description" />
                    <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={editLeadTime} onChange={(e) => setEditLeadTime(e.target.value)} placeholder="Lead time days" />
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" checked={editActive} onChange={(e) => setEditActive(e.target.checked)} />
                      Active
                    </label>
                  </div>
                  <div className="mt-4">
                    <Button onClick={saveEdit}>Save Changes</Button>
                  </div>
                  {editMessage && <p className="mt-2 text-sm text-blue-700">{editMessage}</p>}
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="text-base font-bold text-slate-900">Variants</h3>
                  <div className="mt-3 space-y-2">
                    {(selectedDetails?.variants || []).map((v) => (
                      <div key={v.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm">
                        <span>
                          #{v.id} · {v.size}/{v.material} · {v.sku} · CAD {v.price_cad}
                        </span>
                        <button onClick={() => deleteVariant(v.id)} className="rounded-full border border-rose-300 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50">
                          Delete
                        </button>
                      </div>
                    ))}
                    {(selectedDetails?.variants || []).length === 0 && <p className="text-sm text-slate-500">No variants yet.</p>}
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={variantSize} onChange={(e) => setVariantSize(e.target.value)} placeholder="Size (S/M/L)" />
                    <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={variantMaterial} onChange={(e) => setVariantMaterial(e.target.value)} placeholder="Material" />
                    <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm md:col-span-2" value={variantSku} onChange={(e) => setVariantSku(e.target.value)} placeholder="SKU (unique)" />
                    <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={variantPrice} onChange={(e) => setVariantPrice(e.target.value)} placeholder="Price CAD" />
                  </div>
                  <div className="mt-4">
                    <Button onClick={addVariant}>Add Variant</Button>
                  </div>
                  {variantMessage && <p className="mt-2 text-sm text-blue-700">{variantMessage}</p>}
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="text-base font-bold text-slate-900">Images</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {(selectedDetails?.images || []).map((img) => (
                      <div key={img.id} className="rounded-xl border border-slate-200 p-2">
                        <img src={`${API}${img.url}`} alt={img.alt_text || `product-${img.id}`} className="h-28 w-full rounded-lg object-cover" />
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                          <span>#{img.id}</span>
                          <button onClick={() => deleteImage(img.id)} className="rounded-full border border-rose-300 px-2 py-1 font-semibold text-rose-700 hover:bg-rose-50">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {(selectedDetails?.images || []).length === 0 && <p className="text-sm text-slate-500">No images yet.</p>}
                  </div>
                  <input type="file" accept="image/*" className="mt-4 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                  <div className="mt-4">
                    <Button onClick={uploadImage}>Upload Image</Button>
                  </div>
                  {imageMessage && <p className="mt-2 text-sm text-blue-700">{imageMessage}</p>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
