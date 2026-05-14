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
const handleOpenRanking = (id: number, name: string) => {
  // 1. Fetch dos dados do ranking no Neon (via API)
  // 2. Abrir o modal
  setSelectedGame({ id, name });
};

return (
  <>
    {/* ... rest of the Lobby ... */}
    {selectedGame && (
      <RankingModal 
        gameName={selectedGame.name}
        data={mockData} // Aqui virão os dados do Neon
        onClose={() => setSelectedGame(null)}
        onPlay={() => console.log('Iniciar jogo:', selectedGame.id)}
      />
    )}
  </>
);
