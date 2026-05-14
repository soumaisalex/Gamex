import React from 'react';

const MainLayout = ({ children, user }) => {
  return (
    const { user, logout } = useAuth();
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* HEADER - Mobile First */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight text-indigo-600">GêGames</h1>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-slate-500">Olá, {user?.name || 'Visitante'}</p>
              <p className="text-xs text-indigo-500 font-bold">⭐ {user?.totalPoints || 0} pts</p>
            </div>
            <img 
              src={user.avatar_url || 'https://via.placeholder.com/40'} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border-2 border-indigo-100 shadow-sm"
            />
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 pb-24 pt-6 px-4 max-w-4xl mx-auto w-full">
        {children}
      </main>

      {/* BOTTOM NAVIGATION - Mobile Priority */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 safe-area-bottom sm:max-w-md sm:mx-auto sm:rounded-t-2xl sm:shadow-lg-up">
        <NavItem icon="🏠" label="Início" active />
        <NavItem icon="🏆" label="Ranking" />
        <NavItem icon="👥" label="Amigos" />
        <NavItem icon="⚙️" label="Ajustes" />
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <button className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export default MainLayout;
