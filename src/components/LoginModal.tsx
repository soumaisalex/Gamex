import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

interface LoginModalProps {
  onGoogleSuccess: (credentialResponse: any) => void;
  onGoogleError: () => void;
  onGuestLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onGoogleSuccess, onGoogleError, onGuestLogin }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      
      <div className="relative bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">
          🎮
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-2">GêGames</h2>
        <p className="text-sm text-slate-500 mb-8">
          Faça login para salvar seus pontos e dominar o ranking.
        </p>

        <div className="w-full flex justify-center mb-4">
          {/* Botão Oficial do Google */}
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={onGoogleError}
            theme="filled_blue"
            shape="pill"
            text="continue_with"
          />
        </div>

        <div className="w-full flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ou</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <button 
          onClick={onGuestLogin}
          className="w-full py-3 rounded-xl font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          Entrar como Convidado
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
