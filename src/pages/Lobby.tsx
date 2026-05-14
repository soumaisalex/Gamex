import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import GameGrid from '../components/GameGrid';
import RankingModal from '../components/RankingModal';
import TicTacToeGame from '../features/TicTacToe/TicTacToeGame';
import { useAuth } from '../context/AuthContext';

const Lobby = () => {
  const { user, logout } = useAuth();
  
  // Controle do Menu Inferior
  const [activeTab, setActiveTab] = useState('home');
  
  // Controle dos Jogos (Seus códigos atuais)
  const [selectedGame, setSelectedGame] = useState<null | { id: number, name: string }>(null);
  const [rankingData, setRankingData] = useState([]);
  const [isRankingLoading, setIsRankingLoading] = useState(false);
  const [activeGameId, setActiveGameId] = useState<number | null>(null);

  const handleOpenRanking = async (id: number, name: string) => {
    // ... seu código de fetch do ranking continua igual
  };

  const handlePlayGame = () => {
    // ... seu código de iniciar o jogo continua igual
  };

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      
      {/* ============================== */}
      {/* ABA 1: INÍCIO (Onde ficam os jogos) */}
      {/* ============================== */}
      {activeTab === 'home' && (
        !activeGameId ? (
          <div className="animate-in fade-in duration-300">
            <section className="mb-8">
              <h2 className="text-2xl font-black text-slate-800">Seus Jogos</h2>
              <p className="text-slate-500">Escolha um desafio e comece a pontuar.</p>
            </section>
            
            <GameGrid onOpenRanking={handleOpenRanking} />
            
            {selectedGame && (
              <RankingModal 
                gameName={selectedGame.name}
                data={rankingData}
                onClose={() => setSelectedGame(null)}
                onPlay={handlePlayGame}
              />
            )}
          </div>
        ) : (
          <div className="pt-4">
            {activeGameId === 1 && <TicTacToeGame onBack={() => setActiveGameId(null)} />}
          </div>
        )
      )}

      {/* ============================== */}
      {/* ABA 2: RANKING GLOBAL */}
      {/* ============================== */}
      {activeTab === 'ranking' && (
        <div className="text-center py-12 animate-in fade-in duration-300">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Hall da Fama</h2>
          <p className="text-slate-500">Em breve você verá os líderes globais de todos os jogos aqui.</p>
        </div>
      )}

      {/* ============================== */}
      {/* ABA 3: AMIGOS */}
      {/* ============================== */}
      {activeTab === 'friends' && (
        <div className="text-center py-12 animate-in fade-in duration-300">
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Seus Amigos</h2>
          <p className="text-slate-500">Adicione amigos para desafiá-los na Batalha Naval!</p>
        </div>
      )}

      {/* ============================== */}
      {/* ABA 4: AJUSTES */}
      {/* ============================== */}
      {activeTab === 'settings' && (
        <div className="flex flex-col items-center py-8 animate-in fade-in duration-300">
          <img 
            src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}`} 
            alt="Avatar" 
            className="w-24 h-24 rounded-full border-4 border-indigo-100 shadow-md mb-4"
          />
          <h2 className="text-2xl font-black text-slate-800">{user?.name}</h2>
          <p className="text-slate-500 font-medium mb-8">{user?.email || 'Convidado'}</p>
          
          <button 
            onClick={logout} 
            className="w-full max-w-xs py-4 bg-rose-50 text-rose-600 font-bold rounded-2xl border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            Sair da Conta
          </button>
        </div>
      )}

    </MainLayout>
  );
};

export default Lobby;
