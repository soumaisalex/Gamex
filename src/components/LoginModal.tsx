import React from 'react';

interface LoginModalProps {
  onGoogleLogin: () => void;
  onGuestLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onGoogleLogin, onGuestLogin }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Overlay Escuro */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"></div>

      {/* Card do Modal */}
      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 border-t border-slate-200 sm:border-none">
        <div className="p-8">
          
          {/* Indicador de "arrastar" para fechar no Mobile (estético) */}
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden"></div>

          {/* Header do Login */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-inner">
              🎮
            </div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Bem-vindo ao GêGames</h2>
            <p className="text-slate-500 mt-2 text-sm px-4">Conecte-se para salvar seu progresso e subir no ranking global.</p>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-4">
            {/* Botão Google - O Principal */}
            <button 
              onClick={onGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 py-4 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google Logo" />
              Entrar com Google
            </button>

            {/* Separador */}
            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] bg-slate-100 flex-1"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ou</span>
              <div className="h-[1px] bg-slate-100 flex-1"></div>
            </div>

            {/* Botão Convidado */}
            <button 
              onClick={onGuestLogin}
              className="w-full py-3 rounded-xl font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all active:scale-[0.98]"
            >
              Continuar como Convidado
            </button>
          </div>

          {/* Rodapé Informativo */}
          <p className="text-[10px] text-center text-slate-400 mt-8 px-6 leading-relaxed">
            Ao utilizar o portal, você concorda que o progresso de <strong>convidado</strong> é salvo apenas localmente e não pontua no ranking mensal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
