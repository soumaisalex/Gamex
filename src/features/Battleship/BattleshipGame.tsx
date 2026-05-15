import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

type CellState = 'empty' | 'ship' | 'hit' | 'miss' | 'radar';
type Board = CellState[][];
type Weapon = 'normal' | 'radar' | 'cross';

const GRID_SIZE = 8;

const BattleshipGame = ({ onBack }: { onBack: () => void }) => {
  const { user, addPoints } = useAuth();
  
  const [enemyBoard, setEnemyBoard] = useState<Board>([]);
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon>('normal');
  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Encontre os navios inimigos!');

  // Inicializa o tabuleiro
  useEffect(() => {
    setEnemyBoard(generateRandomEnemyBoard());
  }, []);

  function generateRandomEnemyBoard() {
    const board = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'));
    let shipsPlaced = 0;
    while (shipsPlaced < 8) { 
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      if (board[r][c] === 'empty') {
        board[r][c] = 'ship';
        shipsPlaced++;
      }
    }
    return board;
  }

  // Lógica de Ataque Centralizada
  const handleCellClick = (row: number, col: number) => {
    if (turn !== 'player' || gameOver) return;

    const newBoard = [...enemyBoard.map(r => [...r])];

    if (selectedWeapon === 'normal') {
      executeAttack(newBoard, row, col);
    } else if (selectedWeapon === 'radar') {
      executeRadar(newBoard, row, col);
    } else if (selectedWeapon === 'cross') {
      executeCrossShot(newBoard, row, col);
    }

    setEnemyBoard(newBoard);
    
    if (checkVictory(newBoard)) {
      setGameOver(true);
      setMessage('VITÓRIA! +10 pontos salvos.');
      addPoints(10);
    } else {
      setSelectedWeapon('normal'); // Volta para arma normal após especial
    }
  };

  // --- HABILIDADES ESPECIAIS ---

  const executeAttack = (board: Board, r: number, c: number) => {
    if (board[r][c] === 'hit' || board[r][c] === 'miss') return;
    board[r][c] = board[r][c] === 'ship' || board[r][c] === 'radar' ? 'hit' : 'miss';
  };

  const executeRadar = (board: Board, r: number, c: number) => {
    // Revela área 3x3
    for (let i = r - 1; i <= r + 1; i++) {
      for (let j = c - 1; j <= c + 1; j++) {
        if (i >= 0 && i < GRID_SIZE && j >= 0 && j < GRID_SIZE) {
          if (board[i][j] === 'ship') board[i][j] = 'radar';
        }
      }
    }
    setMessage('Radar ativado! Navios detectados em azul.');
  };

  const executeCrossShot = (board: Board, r: number, c: number) => {
    const cells = [[r, c], [r-1, c], [r+1, c], [r, c-1], [r, c+1]];
    cells.forEach(([row, col]) => {
      if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
        executeAttack(board, row, col);
      }
    });
    setMessage('DISPARO EM CRUZ! Área atingida.');
  };

  const checkVictory = (board: Board) => !board.flat().includes('ship') && !board.flat().includes('radar');

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500 pb-10">
      <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="text-slate-400 font-bold text-xs uppercase tracking-widest">← Sair</button>
          <h2 className="text-xl font-black text-slate-800">Batalha Naval</h2>
          <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold">MISSÃO 01</div>
        </div>

        {/* MENSAGEM DE STATUS */}
        <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl mb-6 text-center">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">{message}</p>
        </div>

        {/* SELETOR DE ARMAS ESPECIAIS */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          <WeaponBtn 
            icon="🎯" label="Normal" 
            active={selectedWeapon === 'normal'} 
            onClick={() => setSelectedWeapon('normal')} 
          />
          <WeaponBtn 
            icon="📡" label="Radar" 
            cost={50}
            active={selectedWeapon === 'radar'} 
            locked={user?.totalPoints! < 50}
            onClick={() => setSelectedWeapon('radar')} 
          />
          <WeaponBtn 
            icon="➕" label="Cruz" 
            cost={150}
            active={selectedWeapon === 'cross'} 
            locked={user?.totalPoints! < 150}
            onClick={() => setSelectedWeapon('cross')} 
          />
        </div>

        {/* TABULEIRO */}
        <div className="grid grid-cols-8 gap-1 bg-slate-200 p-1 rounded-2xl border-4 border-slate-200 aspect-square">
          {enemyBoard.map((row, rIdx) => 
            row.map((cell, cIdx) => (
              <button
                key={`${rIdx}-${cIdx}`}
                onClick={() => handleCellClick(rIdx, cIdx)}
                className={`h-full w-full rounded-lg transition-all duration-300 flex items-center justify-center text-lg shadow-sm
                  ${cell === 'empty' || cell === 'ship' ? 'bg-sky-400 hover:bg-sky-300 active:scale-90' : ''}
                  ${cell === 'radar' ? 'bg-indigo-400 animate-pulse border-2 border-white' : ''}
                  ${cell === 'hit' ? 'bg-rose-500 rotate-12 scale-110 z-10' : ''}
                  ${cell === 'miss' ? 'bg-sky-100 opacity-60' : ''}
                `}
              >
                {cell === 'hit' ? '💥' : cell === 'miss' ? '💧' : cell === 'radar' ? '🔍' : ''}
              </button>
            ))
          )}
        </div>

        {gameOver && (
          <button onClick={() => window.location.reload()} className="w-full mt-6 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-lg animate-bounce">
            REJOGAR
          </button>
        )}
      </div>
    </div>
  );
};

const WeaponBtn = ({ icon, label, cost, active, locked, onClick }: any) => (
  <button 
    onClick={onClick}
    disabled={locked}
    className={`flex-shrink-0 flex flex-col items-center p-3 rounded-2xl border-2 transition-all min-w-[80px]
    ${active ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 bg-white'}
    ${locked ? 'opacity-30 grayscale cursor-not-allowed border-dashed' : 'hover:border-indigo-200'}`}
  >
    <span className="text-xl mb-1">{icon}</span>
    <p className="text-[10px] font-black uppercase leading-none">{label}</p>
    {cost && <p className="text-[9px] mt-1 font-bold text-indigo-500">{cost} pts</p>}
  </button>
);

export default BattleshipGame;
