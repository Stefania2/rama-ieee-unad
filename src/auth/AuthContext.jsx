import { createContext, useContext, useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import { getUserByEmail } from '../services/api';

const AuthContext = createContext(null);

const MOCK_USERS = [
  { email: 'stefania@unad.edu.co', nombre: 'Stefania Aguilar', rol: 'ADMIN', capitulo: 'GLOBAL', picture: '' },
  { email: 'aess@unad.edu.co', nombre: 'Líder AESS', rol: 'LIDER', capitulo: 'AESS', picture: '' },
  { email: 'wie@unad.edu.co', nombre: 'Líder WIE', rol: 'LIDER', capitulo: 'WIE', picture: '' },
  { email: 'cs@unad.edu.co', nombre: 'Líder CS', rol: 'LIDER', capitulo: 'CS', picture: '' },
  { email: 'visitante@unad.edu.co', nombre: 'Visitante', rol: 'VISITANTE', capitulo: 'GLOBAL', picture: '' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ieee_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('ieee_user'); }
    }
  }, []);

  const loginWithGoogle = async (credentialResponse) => {
    setLoading(true);
    try {
      const email = credentialResponse?.email || 'stefania@unad.edu.co';
      const picture = credentialResponse?.picture || '';

      let appUser = null;
      try {
        appUser = await getUserByEmail(email);
      } catch {
        appUser = MOCK_USERS.find(u => u.email === email) || null;
      }

      if (!appUser && email.endsWith('@unad.edu.co')) {
        appUser = { email, nombre: email.split('@')[0], rol: 'VISITANTE', capitulo: 'GLOBAL', picture };
      }

      if (!appUser) {
        throw new Error('Correo no autorizado');
      }

      appUser.picture = picture || appUser.picture;
      setUser(appUser);
      localStorage.setItem('ieee_user', JSON.stringify(appUser));
      return appUser;
    } finally {
      setLoading(false);
    }
  };

  const loginMock = (email) => {
    const found = MOCK_USERS.find(u => u.email === email);
    if (found) {
      setUser(found);
      localStorage.setItem('ieee_user', JSON.stringify(found));
      return found;
    }
    return null;
  };

  const logout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('ieee_user');
  };

  const hasRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.rol);
  };

  const canEditCapitulo = (capitulo) => {
    if (!user) return false;
    if (user.rol === 'ADMIN') return true;
    if (user.rol === 'LIDER' && user.capitulo === capitulo) return true;
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginMock, logout, hasRole, canEditCapitulo }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
