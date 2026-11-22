import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.js";

// Site-wide official values (helpline, head office, At a glance figures) and
// reference lists (districts, categories). Loaded once.
const SiteContext = createContext({ settings: null, meta: null, reload: () => {} });

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [meta, setMeta] = useState(null);
  const load = () => {
    api.get("/settings").then((r) => setSettings(r.data)).catch(() => setSettings({}));
    api.get("/meta").then((r) => setMeta(r.data)).catch(() => setMeta(null));
  };
  useEffect(load, []);
  return <SiteContext.Provider value={{ settings, meta, reload: load }}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
