import { createContext, useContext, useEffect, useState } from "react";
import api, { setToken } from "../services/api.js";

const AuthContext = createContext(null);
const KEY = "dwda-admin-token";

// The token is kept in sessionStorage, so it is cleared when the browser closes.
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [ready, setReady] = useState(false);

  function logout() {
    setToken(null);
    try { sessionStorage.removeItem(KEY); } catch { /* storage unavailable */ }
    setAdmin(null);
  }

  useEffect(() => {
    let token = null;
    try { token = sessionStorage.getItem(KEY); } catch { /* storage unavailable */ }
    if (!token) { setReady(true); return; }
    setToken(token);
    api.get("/auth/me").then((r) => setAdmin(r.data.admin)).catch(() => logout()).finally(() => setReady(true));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.token);
    try { sessionStorage.setItem(KEY, data.token); } catch { /* storage unavailable */ }
    setAdmin(data.admin);
    return data.admin;
  };

  return <AuthContext.Provider value={{ admin, ready, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
