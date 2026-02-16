"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { siteContent } from "@/content/siteContent";
import { API } from "@/lib/api";

type SubmitState = "idle" | "loading" | "success" | "error";

export default function QuotePage() {
  const params = useSearchParams();
  const prefillProduct = params.get("product");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [material, setMaterial] = useState("PLA");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState(prefillProduct ? `Product reference: ${prefillProduct}` : "");
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState("");
  const [state, setState] = useState<SubmitState>("idle");

  const canSubmit = useMemo(() => name.trim() && email.trim(), [name, email]);

  async function submitQuote() {
    if (!canSubmit) return;
    setState("loading");
    try {
      const createRes = await fetch(`${API}/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_email: email,
          customer_phone: phone || null,
          material,
          deadline: deadline || null,
          notes,
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.detail || "create failed");

      setCode(createData.public_code || "");

      if (file && createData.id) {
        const fd = new FormData();
        fd.append("file", file);
        const uploadRes = await fetch(`${API}/quotes/${createData.id}/files`, { method: "POST", body: fd });
        if (!uploadRes.ok) {
          throw new Error("upload failed");
        }
      }

      setState("success");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="bg-clinic py-12">
      <Container className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Custom Work</p>
          <h1 className="mt-2 text-4xl font-extrabold text-slate-900">{siteContent.quote.title}</h1>
          <p className="mt-3 text-slate-600">{siteContent.quote.subtitle}</p>
          <Card className="mt-6 space-y-2">
            <p className="text-sm text-slate-600">{siteContent.quote.uploadHelper}</p>
            <p className="text-sm text-slate-600">{siteContent.quote.processNote}</p>
          </Card>
        </div>
        <Card>
          <div className="grid gap-3">
            <label className="text-sm font-medium text-slate-700">
              {siteContent.quote.fields.name}
              <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="text-sm font-medium text-slate-700">
              {siteContent.quote.fields.email}
              <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="text-sm font-medium text-slate-700">
              {siteContent.quote.fields.phone}
              <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label className="text-sm font-medium text-slate-700">
              {siteContent.quote.fields.material}
              <select className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" value={material} onChange={(e) => setMaterial(e.target.value)}>
                {siteContent.quote.materials.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              {siteContent.quote.fields.deadline}
              <input type="date" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </label>
            <label className="text-sm font-medium text-slate-700">
              {siteContent.quote.fields.notes}
              <textarea className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
            <input type="file" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="pt-2">
              <Button onClick={submitQuote} className={!canSubmit || state === "loading" ? "pointer-events-none opacity-60" : ""}>
                {siteContent.quote.submit}
              </Button>
            </div>
            {state === "success" && (
              <>
                <p className="text-sm font-medium text-emerald-700">{siteContent.quote.success}</p>
                {code && <p className="text-xs text-slate-600">Quote Code: {code}</p>}
              </>
            )}
            {state === "error" && <p className="text-sm font-medium text-rose-600">{siteContent.quote.error}</p>}
          </div>
        </Card>
      </Container>
    </section>
  );
}
