import React from 'react';

interface GameGridProps {
  onOpenRanking?: (id: number, name: string) => void;
}

const GameGrid: React.FC<GameGridProps> = ({ onOpenRanking }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Jogo da Velha - O Único Liberado por enquanto */}
      <GameCard 
        title="Jogo da Velha" 
        slug="tic-tac-toe" 
        stats={{ wins: 0 }}
        onClick={() => onOpenRanking?.(1, 'Jogo da Velha')}
      />
      
      {/* Batalha Naval */}
      <GameCard 
        title="Batalha Naval" 
        slug="battleship" 
        stats={{ wins: 0 }}
        isLocked={true}
      />

      {/* Dominó */}
      <GameCard 
        title="Dominó" 
        slug="domino" 
        stats={{ wins: 0 }}
        isLocked={true}
      />
    </div>
  );
};

// Sub-componente apenas visual (O Card de cada jogo)
const GameCard = ({ title, slug, stats, isLocked = false, onClick }: any) => (
  <div 
    onClick={!isLocked ? onClick : undefined}
    className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-indigo-300 hover:shadow-md cursor-pointer group'}`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-indigo-50 rounded-xl text-2xl group-hover:scale-110 transition-transform">
        {slug === 'tic-tac-toe' ? '⭕' : slug === 'battleship' ? '🚢' : '🎲'}
      </div>
      {!isLocked && (
        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded-md uppercase tracking-wider">
          {stats.wins} Vitórias
        </span>
      )}
    </div>
    <h3 className="font-bold text-lg text-slate-800">{title}</h3>
    <p className="text-sm text-slate-500 mb-4">
      {isLocked ? 'Em desenvolvimento...' : 'Top 10 disponível agora.'}
    </p>
    <button 
      disabled={isLocked}
      className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${
        isLocked 
        ? 'bg-slate-100 text-slate-400' 
        : 'bg-slate-100 text-slate-700 group-hover:bg-indigo-600 group-hover:text-white'
      }`}
    >
      {isLocked ? 'Em Breve' : 'Ver Ranking'}
    </button>
  </div>
);

export default GameGrid;
