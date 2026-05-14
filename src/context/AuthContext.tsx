import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  avatar_url: string;
  totalPoints: number;
  isGuest: boolean;
}

interface AuthContextType {
  user: User | null;
  loginWithGoogle: () => void;
  loginAsGuest: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica se há sessão ao carregar o app
  useEffect(() => {
    const savedUser = localStorage.getItem('@GeGames:user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = () => {
    // Aqui entrará a integração com o Google GSI / Firebase / Supabase
    console.log("Iniciando fluxo Google...");
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: crypto.randomUUID(),
      name: `Jogador_${Math.floor(1000 + Math.random() * 9000)}`,
      avatar_url: '',
      totalPoints: 0,
      isGuest: true
    };
    setUser(guestUser);
    localStorage.setItem('@GeGames:user', JSON.stringify(guestUser));
  };

  const logout = () => {
    localStorage.removeItem('@GeGames:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, loginAsGuest, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};
