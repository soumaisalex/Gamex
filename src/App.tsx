import { AuthProvider, useAuth } from './context/AuthContext';
import Lobby from './pages/Lobby';
import LoginModal from './components/LoginModal';

const AppContent = () => {
  const { user, loginWithGoogle, loginAsGuest, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;

  return (
    <>
      {/* Se não houver usuário, trava a tela com o Modal de Login */}
      {!user && (
        <LoginModal 
          onGoogleLogin={loginWithGoogle} 
          onGuestLogin={loginAsGuest} 
        />
      )}
      
      {/* A página do Lobby só é interagível se houver user */}
      <Lobby />
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
