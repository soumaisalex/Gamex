const GameCard = ({ title, slug, stats, isLocked = false }) => (
  <div className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all ${isLocked ? 'opacity-60' : 'hover:border-indigo-300 hover:shadow-md'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-indigo-50 rounded-xl text-2xl">
        {slug === 'tic-tac-toe' ? '⭕' : slug === 'battleship' ? '🚢' : '🎲'}
      </div>
      {!isLocked && (
        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded-md uppercase">
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
      className="w-full py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-indigo-600 hover:text-white transition-colors"
    >
      {isLocked ? 'Em Breve' : 'Jogar'}
    </button>
  </div>
);
