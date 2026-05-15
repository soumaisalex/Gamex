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
        const fetchUserData = async () => {
          const savedUser = localStorage.getItem('@GeGames:user');
          if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            
            try {
              // Busca os pontos reais somados de todos os jogos
              const response = await fetch(`/api/user-stats?email=${parsedUser.email}`);
              const stats = await response.json();
              
              setUser({
                ...parsedUser,
                totalPoints: stats.total_points || 0 // Mapeia total_points para totalPoints
              });
            } catch (error) {
              setUser(parsedUser);
            }
          }
          setLoading(false);
        };
  
        fetchUserData();
      }, []);  
  
  // Login com o Google
  const loginWithGoogle = async (credentialResponse: any) => {
    const decoded: any = jwtDecode(credentialResponse.credential);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          avatar_url: decoded.picture,
        })
      });

      const dbUser = await response.json();

      const finalUser: User = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        avatar_url: dbUser.avatar_url,
        totalPoints: dbUser.total_points || 0, // Garante que inicia com o que está no banco
        isGuest: false
      };

      setUser(finalUser);
      localStorage.setItem('@GeGames:user', JSON.stringify(finalUser));
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };
  
  // Login como Convidado
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
