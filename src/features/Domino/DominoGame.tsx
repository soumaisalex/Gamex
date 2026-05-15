import React, { useState, useEffect } from 'react';

// Tipagem de uma pedra de dominó: [Lado A, Lado B]
type Piece = [number, number];

const DominoGame = ({ onBack }: { onBack: () => void }) => {
  const [playerHand, setPlayerHand] = useState<Piece[]>([]);
  const [botHand, setBotHand] = useState<Piece[]>([]);
  const [boneyard, setBoneyard] = useState<Piece[]>([]); // O "monte" para comprar
  const [table, setTable] = useState<Piece[]>([]); // Pedras jogadas na mesa
  const [turn, setTurn] = useState<'player' | 'bot'>('player');

  // Função para gerar as 28 pedras do jogo (0-0 até 6-6)
  const generatePieces = (): Piece[] => {
    const pieces: Piece[] = [];
    for (let i = 0; i <= 6; i++) {
      for (let j = i; j <= 6; j++) {
        pieces.push([i, j]);
      }
    }
    return pieces;
  };

  // Embaralha o array de pedras (Algoritmo Fisher-Yates)
  const shuffle = (array: Piece[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Inicializa a partida distribuindo as pedras
  const startNewGame = () => {
    const allPieces = shuffle(generatePieces());
    
    // Distribui 7 para cada e deixa 14 no monte
    setPlayerHand(allPieces.slice(0, 7));
    setBotHand(allPieces.slice(7, 14));
    setBoneyard(allPieces.slice(14, 28));
    setTable([]);
    setTurn('player');
  };

  useEffect(() => {
    startNewGame();
  }, []);

  // Componente visual simples para a Pedra
  const DominoPiece = ({ piece, onClick }: { piece: Piece, onClick?: () => void }) => (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-between w-10 h-20 bg-amber-50 rounded-lg border-2 border-slate-300 shadow-sm hover:-translate-y-2 hover:shadow-md transition-all duration-300"
    >
      <div className="flex-1 w-full flex items-center justify-center font-black text-slate-800 text-lg border-b border-slate-300">
        {piece[0]}
      </div>
      <div className="flex-1 w-full flex items-center justify-center font-black text-slate-800 text-lg">
        {piece[1]}
      </div>
    </button>
  );

  return (
    <div className="flex flex-col items-center pb-20 animate-in fade-in duration-500 max-w-2xl mx-auto w-full">
      <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="text-slate-400 font-bold text-xs uppercase tracking-widest">← Voltar</button>
          <div className="px-4 py-1.5 rounded-full text-xs font-black bg-indigo-600 text-white shadow-sm">
            DOMINÓ
          </div>
        </div>

        {/* Info do Adversário */}
        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adversário (IA)</p>
            <p className="font-black text-slate-700">{botHand.length} pedras restantes</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monte</p>
            <p className="font-black text-slate-700">{boneyard.length} pedras</p>
          </div>
        </div>

        {/* Mesa (Onde as pedras serão jogadas) */}
        <div className="flex-1 bg-emerald-700 rounded-2xl shadow-inner border-4 border-slate-800 flex items-center justify-center p-4 mb-8 overflow-x-auto">
          {table.length === 0 ? (
            <p className="text-emerald-300/50 font-black uppercase tracking-widest">Mesa Vazia</p>
          ) : (
            <p className="text-white">Pedras jogadas aparecerão aqui...</p>
          )}
        </div>

        {/* Sua Mão */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1 text-center">Sua Mão</p>
          <div className="flex flex-wrap justify-center gap-2">
            {playerHand.map((piece, idx) => (
              <DominoPiece key={idx} piece={piece} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DominoGame;
