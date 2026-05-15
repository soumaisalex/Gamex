import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import GameGrid from '../components/GameGrid';
import RankingModal from '../components/RankingModal';
import TicTacToeGame from '../features/TicTacToe/TicTacToeGame';
import BattleshipGame from '../features/Battleship/BattleshipGame';
import DominoGame from '../features/Domino/DominoGame';
import { useAuth } from '../context/AuthContext';

const Lobby = () => {
  const { user, logout } = useAuth();
  
  // Controle das Abas (Navegação Inferior)
  const [activeTab, setActiveTab] = useState('home');
  
  // Controle do Jogo Ativo e Modal de Ranking
  const [selectedGame, setSelectedGame] = useState<null | { id: number, name: string }>(null);
  const [rankingData, setRankingData] = useState([]);
  const [isRankingLoading, setIsRankingLoading] = useState(false);
  const [activeGameId, setActiveGameId] = useState<number | null>(null);

  // Função que abre o modal e busca os dados no Neon
  const handleOpenRanking = async (id: number, name: string) => {
    setSelectedGame({ id, name });
    setIsRankingLoading(true);
    try {
      const response = await fetch(`/api/ranking?gameId=${id}`);
      const data = await response.json();
      setRankingData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar ranking:", error);
      setRankingData([]);
    } finally {
      setIsRankingLoading(false);
    }
  };

  // Função que esconde o modal e monta o Jogo da Velha na tela
  const handlePlayGame = () => {
    if (selectedGame) {
      setActiveGameId(selectedGame.id);
      setSelectedGame(null); // Esconde o modal
    }
  };

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      
      {/* ABA INÍCIO */}
      {activeTab === 'home' && (
        !activeGameId ? (
          // Mostra a Grade de Jogos se não houver jogo ativo
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
          // Mostra o Tabuleiro do Jogo se houver jogo ativo
          <div className="pt-4 animate-in zoom-in-95 duration-300">
            {activeGameId === 1 && <TicTacToeGame onBack={() => setActiveGameId(null)} />}
            {activeGameId === 2 && <BattleshipGame onBack={() => setActiveGameId(null)} />}
            {activeGameId === 3 && <DominoGame onBack={() => setActiveGameId(null)} />}
          </div>
        )
      )}

      {/* ABA RANKING */}
      {activeTab === 'ranking' && (
        <div className="text-center py-12 animate-in fade-in duration-300">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Hall da Fama</h2>
          <p className="text-slate-500">Em breve você verá os líderes globais de todos os jogos aqui.</p>
        </div>
      )}

      {/* ABA AMIGOS */}
      {activeTab === 'friends' && (
        <div className="text-center py-12 animate-in fade-in duration-300">
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Seus Amigos</h2>
          <p className="text-slate-500">Adicione amigos para desafiá-los na Batalha Naval!</p>
        </div>
      )}

      {/* ABA AJUSTES */}
      {activeTab === 'settings' && (
        <div className="flex flex-col items-center py-8 animate-in fade-in duration-300">
          <img 
            src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}`} 
            alt="Avatar" 
            className="w-24 h-24 rounded-full border-4 border-indigo-100 shadow-md mb-4 bg-white"
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
