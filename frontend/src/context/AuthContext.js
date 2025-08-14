import { createContext, useContext, useState } from "react";
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser]   = useState(() => JSON.parse(localStorage.getItem("user")||"null"));

  function login(data) {
    const token = data.token;
    const user = data.user || { id: data.id, name: data.name, email: data.email };
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }
  function logout() {
    setToken(null); setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  return <Ctx.Provider value={{ token, user, login, logout }}>{children}</Ctx.Provider>;
}
