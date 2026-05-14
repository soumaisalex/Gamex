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
