import { AuthProvider, useAuth } from './context/AuthContext';
import Lobby from './pages/Lobby';
import LoginModal from './components/LoginModal';

const AppContent = () => {
  const { user, loginWithGoogle, loginAsGuest, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;

return (
    <>
      {!user && (
        <LoginModal 
          onGoogleLogin={loginWithGoogle} 
          onGuestLogin={loginAsGuest} 
        />
      )}
      
      {/* Adicionamos um blur ou desabilitamos a interação se não houver user */}
      <div className={!user ? 'blur-sm pointer-events-none select-none' : ''}>
        <Lobby />
      </div>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
