import React from 'react';

interface RankingEntry {
  name: string;
  avatar_url: string;
  points: number;
}

interface RankingModalProps {
  gameName: string;
  data: RankingEntry[];
  onClose: () => void;
  onPlay: () => void;
}

const RankingModal: React.FC<RankingModalProps> = ({ gameName, data, onClose, onPlay }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Background desfoque */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>
      
      {/* Painel do Modal */}
      <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-4 duration-300">
        
        {/* Header do Modal */}
        <div className="bg-indigo-600 p-6 text-white text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
            ✕
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">Ranking Global</span>
          <h2 className="text-2xl font-black">{gameName}</h2>
        </div>

        {/* Lista de Jogadores */}
        <div className="max-h-[60vh] overflow-y-auto p-4 bg-slate-50">
          {data.length > 0 ? (
            <div className="space-y-2">
              {data.map((player, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:scale-[1.01]`}
                >
                  {/* Posição */}
                  <span className={`w-6 text-center font-black ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-600' : 'text-slate-300'}`}>
                    {index + 1}º
                  </span>
                  
                  {/* Avatar */}
                  <img 
                    src={player.avatar_url || `https://ui-avatars.com/api/?name=${player.name}`} 
                    alt={player.name} 
                    className="w-10 h-10 rounded-full border-2 border-slate-100 shadow-inner"
                  />
                  
                  {/* Nome */}
                  <span className="flex-1 font-bold text-slate-700 truncate">{player.name}</span>
                  
                  {/* Pontos */}
                  <span className="bg-indigo-50 text-indigo-700 font-black px-3 py-1 rounded-lg text-sm">
                    {player.points} pts
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <p className="text-3xl mb-2">🐢</p>
              <p className="font-medium">Ninguém pontuou ainda.<br/>Seja o primeiro!</p>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="p-6 bg-white border-t border-slate-100">
          <button 
            onClick={onPlay}
            className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            Jogar Agora!
          </button>
        </div>

      </div>
    </div>
  );
};

export default RankingModal;
