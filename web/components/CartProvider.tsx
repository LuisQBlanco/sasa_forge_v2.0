"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Item = { variant_id: number; quantity: number; name: string; price: number };
type CartCtx = { items: Item[]; add: (i: Item) => void; clear: () => void };

const Ctx = createContext<CartCtx>({ items: [], add: () => {}, clear: () => {} });

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const add = (item: Item) =>
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.variant_id === item.variant_id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx].quantity += item.quantity;
        return next;
      }
      return [...prev, item];
    });

  const clear = () => setItems([]);

  return <Ctx.Provider value={{ items, add, clear }}>{children}</Ctx.Provider>;
}

export const useCart = () => useContext(Ctx);
