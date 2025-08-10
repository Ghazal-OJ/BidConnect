import { createContext, useContext, useState } from "react";
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser]   = useState(() => JSON.parse(localStorage.getItem("user")||"null"));

  function login(data) {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  function logout() {
    setToken(null); setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  return <Ctx.Provider value={{ token, user, login, logout }}>{children}</Ctx.Provider>;
}
