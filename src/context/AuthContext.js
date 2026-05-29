import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('clinica_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    const userObj = userData.usuario
      ? { ...userData.usuario, token: userData.token }
      : userData;
    localStorage.setItem('clinica_user', JSON.stringify(userObj));
    localStorage.setItem('clinica_token', userObj.token);
    setUser(userObj);
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
