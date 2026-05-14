import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const LoginModal: React.FC = () => {
  const { loginWithGoogle, loginAsGuest } = useAuth();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      
      <div className="relative bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-6">
          🎮
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-2">GêGames</h2>
        <p className="text-sm text-slate-500 mb-8">Escolha como deseja entrar:</p>

        <div className="w-full flex justify-center mb-6">
          <GoogleLogin
            onSuccess={(response) => loginWithGoogle(response)}
            onError={() => console.log('Erro no Login do Google')}
            useOneTap
            theme="filled_blue"
            shape="pill"
          />
        </div>

        <button 
          onClick={loginAsGuest}
          className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
        >
          Continuar como Convidado
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
