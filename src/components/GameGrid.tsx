import React from 'react';

interface GameCardProps {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: string;
  onOpenRanking: (id: number, name: string) => void;
  isLocked?: boolean;
}

const GameGrid = ({ onOpenRanking }: { onOpenRanking: (id: number, name: string) => void }) => {
  const games = [
    {
      id: 1,
      title: "Jogo da Velha",
      description: "Top 10 disponível agora.",
      icon: "⭕",
      status: "0 VITÓRIAS",
      isLocked: false
    },
    {
      id: 2,
      title: "Batalha Naval",
      description: "Habilidades especiais liberadas!",
      icon: "🚢",
      status: "NOVO",
      isLocked: false // LIBERADO!
    },
    {
      id: 3,
      title: "Dominó",
      description: "Encaixe suas pedras antes da IA.",
      icon: "🎲",
      status: "NOVO",
      isLocked: false // DESTRAVADO!
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <div key={game.id} className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col h-full transition-all ${game.isLocked ? 'opacity-75' : 'hover:shadow-md hover:-translate-y-1'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
              {game.icon}
            </div>
            <span className={`text-[10px] font-black px-2 py-1 rounded-lg tracking-wider ${game.isLocked ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600'}`}>
              {game.status}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-1">{game.title}</h3>
          <p className="text-sm text-slate-400 mb-6 flex-1">{game.description}</p>
          
          <button
            onClick={() => !game.isLocked && onOpenRanking(game.id, game.title)}
            disabled={game.isLocked}
            className={`w-full py-3 rounded-2xl font-bold transition-all ${
              game.isLocked 
              ? 'bg-slate-50 text-slate-400 cursor-not-allowed' 
              : 'bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white shadow-sm'
            }`}
          >
            {game.isLocked ? "Em breve" : "Ver Ranking"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default GameGrid;
