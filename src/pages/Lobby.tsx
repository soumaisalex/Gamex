import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import GameGrid from '../components/GameGrid';
import RankingModal from '../components/RankingModal';
import TicTacToeGame from '../features/TicTacToe/TicTacToeGame'; // Importe o jogo
import { useAuth } from '../context/AuthContext';

const Lobby = () => {
  const { user } = useAuth();
  const [selectedGame, setSelectedGame] = useState<null | { id: number, name: string }>(null);
  const [rankingData, setRankingData] = useState([]);
  const [isRankingLoading, setIsRankingLoading] = useState(false);
  
  // NOVO: Controle de qual jogo está aberto na tela
  const [activeGameId, setActiveGameId] = useState<number | null>(null);

  const handleOpenRanking = async (id: number, name: string) => {
    setSelectedGame({ id, name });
    setIsRankingLoading(true);
    try {
      const response = await fetch(`/api/ranking?gameId=${id}`);
      const data = await response.json();
      setRankingData(Array.isArray(data) ? data : []); // Previne quebrar se a API falhar
    } catch (error) {
      console.error("Erro ao carregar ranking:", error);
    } finally {
      setIsRankingLoading(false);
    }
  };

  const handlePlayGame = () => {
    if (selectedGame) {
      setActiveGameId(selectedGame.id); // Define o jogo ativo
      setSelectedGame(null); // Fecha o modal
    }
  };

  return (
    <MainLayout>
      {/* Se não houver jogo ativo, mostra o Lobby normal */}
      {!activeGameId ? (
        <>
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
              onPlay={handlePlayGame} // Conecta o botão Jogar!
            />
          )}
        </>
      ) : (
        /* Se houver jogo ativo, renderiza o componente correspondente */
        <div className="pt-4">
          {activeGameId === 1 && <TicTacToeGame onBack={() => setActiveGameId(null)} />}
          {/* Futuramente: activeGameId === 2 && <BattleshipGame /> */}
        </div>
      )}
    </MainLayout>
  );
};

export default Lobby;
