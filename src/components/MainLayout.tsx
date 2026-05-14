import React from 'react';
import { useAuth } from '../context/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab = 'home', onTabChange }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight text-indigo-600">Gamex</h1>
          
          <div className="flex items-center gap-3">
            {/* Desktop: Nome + Pontos */}
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-slate-500">Olá, {user?.name || 'Visitante'}</p>
              <p className="text-xs text-indigo-500 font-bold">⭐ {user?.totalPoints || 0} pts</p>
            </div>
            
            {/* Mobile: Apenas Pontos (Compacto) */}
            <div className="sm:hidden bg-indigo-50 px-2 py-1 rounded-lg">
              <p className="text-[10px] text-indigo-600 font-bold">⭐ {user?.totalPoints || 0}</p>
            </div>

            <img 
              src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name || 'Visitante'}`} 
              alt="Avatar" 
              onClick={() => onTabChange?.('settings')}
              title="Abrir Ajustes"
              className="w-10 h-10 rounded-full border-2 border-indigo-100 shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 pt-6 px-4 max-w-4xl mx-auto w-full">
        {children}
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 safe-area-bottom sm:max-w-md sm:mx-auto sm:rounded-t-2xl sm:shadow-lg-up">
        <NavItem icon="🏠" label="Início" active={activeTab === 'home'} onClick={() => onTabChange?.('home')} />
        <NavItem icon="🏆" label="Ranking" active={activeTab === 'ranking'} onClick={() => onTabChange?.('ranking')} />
        <NavItem icon="👥" label="Amigos" active={activeTab === 'friends'} onClick={() => onTabChange?.('friends')} />
        <NavItem icon="⚙️" label="Ajustes" active={activeTab === 'settings'} onClick={() => onTabChange?.('settings')} />
      </nav>
    </div>
  );
};

// Componente do Botão
const NavItem = ({ icon, label, active = false, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export default MainLayout;
