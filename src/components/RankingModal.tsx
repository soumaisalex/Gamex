import React from 'react';

interface RankItem {
  position: number;
  name: string;
  points: number;
  avatar_url?: string;
  isCurrentUser?: boolean;
}

interface RankingModalProps {
  gameName: string;
  data: RankItem[];
  onClose: () => void;
  onPlay: () => void;
}

const RankingModal: React.FC<RankingModalProps> = ({ gameName, data, onClose, onPlay }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header do Ranking */}
        <div className="bg-indigo-600 p-6 text-white text-center">
          <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Leaderboard</p>
          <h2 className="text-2xl font-black">{gameName}</h2>
        </div>

        {/* Lista do Top 10 */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {data.map((item) => (
            <div 
              key={item.position}
              className={`flex items-center gap-4 p-3 rounded-xl mb-2 transition-colors ${
                item.isCurrentUser ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50'
              }`}
            >
              <span className={`w-6 text-center font-black ${
                item.position === 1 ? 'text-yellow-500' : 
                item.position === 2 ? 'text-slate-400' : 
                item.position === 3 ? 'text-amber-600' : 'text-slate-300'
              }`}>
                {item.position}
              </span>
              
              <img 
                src={item.avatar_url || `https://ui-avatars.com/api/?name=${item.name}&background=random`} 
                className="w-8 h-8 rounded-full shadow-sm" 
                alt={item.name} 
              />
              
              <span className={`flex-1 font-bold text-sm ${item.isCurrentUser ? 'text-indigo-700' : 'text-slate-700'}`}>
                {item.name} {item.isCurrentUser && '(Você)'}
              </span>
              
              <span className="text-xs font-black text-slate-400">
                {item.points} pts
              </span>
            </div>
          ))}
        </div>

        {/* Ações */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Voltar
          </button>
          <button 
            onClick={onPlay}
            className="flex-[2] py-3 text-sm font-bold bg-indigo-600 text-white rounded-xl shadow-indigo-200 shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
          >
            Jogar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankingModal;
