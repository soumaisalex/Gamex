import MainLayout from '../components/MainLayout';
import GameGrid from '../components/GameGrid';

const Lobby = () => {
  return (
    <MainLayout user={user}>
      <section className="mb-8">
        <h2 className="text-2xl font-black text-slate-800">Seus Jogos</h2>
        <p className="text-slate-500">Escolha um desafio e comece a pontuar.</p>
      </section>
      
      {/* Aqui entra a grade de jogos */}
      <GameGrid />
    </MainLayout>
  );
};

const [selectedGame, setSelectedGame] = useState<null | { id: number, name: string }>(null);

// No clique do botão "Jogar" do GameCard:
// Adicione este estado para os dados do ranking
const [rankingData, setRankingData] = useState([]);
const [isRankingLoading, setIsRankingLoading] = useState(false);

const handleOpenRanking = async (id: number, name: string) => {
  setSelectedGame({ id, name });
  setIsRankingLoading(true);

  try {
    // Chamada para a nossa nova Function do Cloudflare
    const response = await fetch(`/api/ranking?gameId=${id}`);
    const data = await response.json();
    setRankingData(data);
  } catch (error) {
    console.error("Erro ao carregar ranking:", error);
  } finally {
    setIsRankingLoading(false);
  }
};
