import React, { useState } from 'react'; // Adicione imports
import MainLayout from '../components/MainLayout';
import GameGrid from '../components/GameGrid';
import RankingModal from '../components/RankingModal';
import { useAuth } from '../context/AuthContext';

const Lobby = () => {
  const { user } = useAuth(); // Pegue o user do context
  const [selectedGame, setSelectedGame] = useState<null | { id: number, name: string }>(null);
  const [rankingData, setRankingData] = useState([]);
  const [isRankingLoading, setIsRankingLoading] = useState(false);

  const handleOpenRanking = async (id: number, name: string) => {
    setSelectedGame({ id, name });
    setIsRankingLoading(true);
    try {
      const response = await fetch(`/api/ranking?gameId=${id}`);
      const data = await response.json();
      setRankingData(data);
    } catch (error) {
      console.error("Erro ao carregar ranking:", error);
    } finally {
      setIsRankingLoading(false);
    }
  };

  return (
    <MainLayout user={user}>
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
          onPlay={() => console.log("Iniciar", selectedGame.id)}
        />
      )}
    </MainLayout>
  );
};

export default Lobby;
