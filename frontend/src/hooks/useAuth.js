import { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * Simple AuthContext
 * - Keeps { user, token } in React state and localStorage
 * - Exposes login(user, token), logout()
 * - Helpers: isAuthed, isEmployer, isFreelancer
 */
const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     // e.g. { _id, email, role }
  const [token, setToken] = useState(null);   // JWT string

  // Load from localStorage on mount
  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t) setToken(t);
    if (u) {
      try { setUser(JSON.parse(u)); } catch {}
    }
  }, []);

  // Persist on change
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Call this after successful login API
  const login = (nextUser, nextToken) => {
    setUser(nextUser || null);
    setToken(nextToken || null);
  };

  // Clear everything
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = useMemo(() => ({
    user,
    token,
    login,
    logout,
    isAuthed: !!token,
    isEmployer: user?.role === "employer",
    isFreelancer: user?.role === "freelancer",
  }), [user, token]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}
