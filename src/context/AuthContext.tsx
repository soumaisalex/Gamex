import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  totalPoints: number;
  isGuest: boolean;
}

interface AuthContextType {
  user: User | null;
  loginWithGoogle: (credentialResponse: any) => void;
  loginAsGuest: () => void;
  logout: () => void;
  loading: boolean;
  addPoints: (points: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('@GeGames:user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const loginWithGoogle = (credentialResponse: any) => {
    const decoded: any = jwtDecode(credentialResponse.credential);
    
    const newUser: User = {
      id: decoded.sub, // ID único do Google
      name: decoded.name,
      email: decoded.email,
      avatar_url: decoded.picture,
      totalPoints: 0,
      isGuest: false
    };

    setUser(newUser);
    localStorage.setItem('@GeGames:user', JSON.stringify(newUser));
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: `guest_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Convidado',
      email: '',
      avatar_url: '',
      totalPoints: 0,
      isGuest: true
    };
    setUser(guestUser);
    localStorage.setItem('@GeGames:user', JSON.stringify(guestUser));
  };

  const addPoints = (points: number) => {
    if (user) {
      const updatedUser = { ...user, totalPoints: (user.totalPoints || 0) + points };
      setUser(updatedUser);
      localStorage.setItem('@GeGames:user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@GeGames:user');
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, loginAsGuest, logout, loading, addPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};
