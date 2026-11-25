import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Donation basket for "Donate to a specific need". Kept in this browser until checkout.
const BasketContext = createContext(null);
const KEY = "dwda-donation-basket";
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };

export function BasketProvider({ children }) {
  const [items, setItems] = useState(read); // [{ need, quantity }] — need is the public need object
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage unavailable */ } }, [items]);

  const value = useMemo(() => ({
    items,
    count: items.length,
    total: items.reduce((s, i) => s + i.quantity * i.need.unitCost, 0),
    has: (id) => items.some((i) => i.need._id === id),
    quantityOf: (id) => items.find((i) => i.need._id === id)?.quantity || 0,
    add: (need, quantity) => setItems((cur) => {
      const q = Math.max(1, Math.min(quantity, need.quantityRemaining));
      return cur.some((i) => i.need._id === need._id) ? cur.map((i) => (i.need._id === need._id ? { need, quantity: q } : i)) : [...cur, { need, quantity: q }];
    }),
    setQuantity: (id, quantity) => setItems((cur) => cur.map((i) => (i.need._id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.need.quantityRemaining)) } : i))),
    remove: (id) => setItems((cur) => cur.filter((i) => i.need._id !== id)),
    clear: () => setItems([]),
  }), [items]);

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}
export const useBasket = () => useContext(BasketContext);