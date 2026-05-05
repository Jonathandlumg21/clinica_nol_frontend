import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('clinica_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    localStorage.setItem('clinica_user', JSON.stringify(userData));
    if (userData.token) localStorage.setItem('clinica_token', userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('clinica_user');
    localStorage.removeItem('clinica_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
