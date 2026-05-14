import React, { createContext, useContext, useState, useEffect } from 'react';
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
  addPoints: (points: number) => void; // <-- 1. Adicionar isto aqui
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
    // Aqui entrará a integração com o Google GSI / Firebase / Neon
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

  // 2. Criar a função que soma os pontos
  const addPoints = (points: number) => {
    if (user) {
      const updatedUser = { ...user, totalPoints: (user.totalPoints || 0) + points };
      setUser(updatedUser);
      localStorage.setItem('@GeGames:user', JSON.stringify(updatedUser));
    }
  };

  return (
    // 3. Não esquecer de passar o addPoints no value do Provider
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
