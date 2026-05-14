import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Tipagem básica
type CellState = 'empty' | 'ship' | 'hit' | 'miss' | 'radar';
type Board = CellState[][];

const GRID_SIZE = 8; // Tabuleiro 8x8 para ser rápido e mobile-friendly

const BattleshipGame = ({ onBack }: { onBack: () => void }) => {
  const { user, addPoints } = useAuth();
  
  // Estados do Jogo
  const [playerBoard, setPlayerBoard] = useState<Board>([]);
  const [enemyBoard, setEnemyBoard] = useState<Board>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [gameOver, setGameOver] = useState(false);

  // Inicializa os tabuleiros
  useEffect(() => {
    const createEmptyBoard = () => 
      Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'));
    
    setPlayerBoard(createEmptyBoard());
    setEnemyBoard(generateRandomEnemyBoard());
  }, []);

  // Lógica para gerar navios inimigos (Simples por enquanto)
  function generateRandomEnemyBoard() {
    const board = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'));
    let shipsPlaced = 0;
    while (shipsPlaced < 5) { // 5 navios de 1 bloco para teste inicial
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      if (board[r][c] === 'empty') {
        board[r][c] = 'ship';
        shipsPlaced++;
      }
    }
    return board;
  }

  // Função de Tiro Normal
  const handleFire = (row: number, col: number) => {
    if (turn !== 'player' || gameOver || enemyBoard[row][col] === 'hit' || enemyBoard[row][col] === 'miss') return;

    const newEnemyBoard = [...enemyBoard];
    const isHit = enemyBoard[row][col] === 'ship';
    newEnemyBoard[row][col] = isHit ? 'hit' : 'miss';
    
    setEnemyBoard(newEnemyBoard);
    
    if (checkVictory(newEnemyBoard)) {
      setGameOver(true);
      addPoints(10); // Batalha Naval dá mais pontos!
    } else {
      setTurn('enemy');
      setTimeout(enemyMove, 800);
    }
  };

  const enemyMove = () => {
    // Lógica básica da IA de ataque aqui...
    setTurn('player');
  };

  const checkVictory = (board: Board) => !board.flat().includes('ship');

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="text-slate-400 font-bold text-sm">← Sair</button>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Batalha Naval</h2>
          <div className="bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 text-xs font-bold">
            LVL 1
          </div>
        </div>

        {/* Info de munição especial (A ideia que você deu!) */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <SpecialWeapon icon="🎯" label="Normal" count="∞" active />
          <SpecialWeapon icon="📡" label="Radar" count="2" locked={user?.totalPoints! < 50} />
          <SpecialWeapon icon="➕" label="Cruz" count="1" locked={user?.totalPoints! < 150} />
        </div>

        {/* Tabuleiro Inimigo (Onde você clica) */}
        <div className="grid grid-cols-8 gap-1 bg-slate-200 p-1 rounded-xl border-4 border-slate-200">
          {enemyBoard.map((row, rIdx) => 
            row.map((cell, cIdx) => (
              <button
                key={`${rIdx}-${cIdx}`}
                onClick={() => handleFire(rIdx, cIdx)}
                className={`h-10 w-full rounded-sm transition-all duration-300 flex items-center justify-center text-xs
                  ${cell === 'empty' || cell === 'ship' ? 'bg-sky-400 hover:bg-sky-500' : ''}
                  ${cell === 'hit' ? 'bg-rose-500 animate-bounce' : ''}
                  ${cell === 'miss' ? 'bg-sky-100' : ''}
                `}
              >
                {cell === 'hit' ? '💥' : cell === 'miss' ? '💧' : ''}
              </button>
            ))
          )}
        </div>

        <p className="mt-4 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
          {turn === 'player' ? 'Sua vez de atacar' : 'Inimigo atacando...'}
        </p>
      </div>
    </div>
  );
};

const SpecialWeapon = ({ icon, label, count, active = false, locked = false }: any) => (
  <button 
    disabled={locked}
    className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all
    ${active ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 bg-white'}
    ${locked ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:border-indigo-200'}`}
  >
    <span>{icon}</span>
    <div className="text-left">
      <p className="text-[10px] font-black uppercase leading-none">{label}</p>
      <p className="text-[10px] text-slate-400 font-bold">{locked ? 'Bloqueado' : `Qtd: ${count}`}</p>
    </div>
  </button>
);

export default BattleshipGame;
