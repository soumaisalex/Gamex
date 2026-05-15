import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

type CellState = 'empty' | 'ship' | 'hit' | 'miss' | 'radar';
type Board = CellState[][];
type Weapon = 'normal' | 'radar' | 'cross';

const GRID_SIZE = 8;

const BattleshipGame = ({ onBack }: { onBack: () => void }) => {
  const { user, addPoints } = useAuth();
  
  const [enemyBoard, setEnemyBoard] = useState<Board>([]);
  const [playerBoard, setPlayerBoard] = useState<Board>([]);
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon>('normal');
  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Posicione-se! O inimigo está à espreita.');

  useEffect(() => {
    setEnemyBoard(generateRandomBoard());
    setPlayerBoard(generateRandomBoard()); // Gera seus navios aleatoriamente também
  }, []);

  function generateRandomBoard() {
    const board = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'));
    let ships = 0;
    while (ships < 8) {
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      if (board[r][c] === 'empty') {
        board[r][c] = 'ship';
        ships++;
      }
    }
    return board;
  }

  const handleCellClick = (row: number, col: number) => {
    if (turn !== 'player' || gameOver || enemyBoard[row][col] === 'hit' || enemyBoard[row][col] === 'miss') return;

    const newEnemyBoard = [...enemyBoard.map(r => [...r])];

    // Ataque do Jogador
    if (selectedWeapon === 'normal') executeAttack(newEnemyBoard, row, col);
    else if (selectedWeapon === 'radar') executeRadar(newEnemyBoard, row, col);
    else if (selectedWeapon === 'cross') executeCrossShot(newEnemyBoard, row, col);

    setEnemyBoard(newEnemyBoard);

    if (checkVictory(newEnemyBoard)) {
      setGameOver(true);
      setMessage('VITÓRIA NAVAL! +10 pontos.');
      addPoints(10);
    } else {
      setTurn('enemy');
      setMessage('O inimigo está calculando o disparo...');
      setTimeout(enemyTurn, 1000);
    }
  };

  const enemyTurn = () => {
    if (gameOver) return;

    const newPlayerBoard = [...playerBoard.map(r => [...r])];
    let r, c;
    
    // IA Simples: Escolhe uma casa que ainda não foi atingida
    do {
      r = Math.floor(Math.random() * GRID_SIZE);
      c = Math.floor(Math.random() * GRID_SIZE);
    } while (newPlayerBoard[r][c] === 'hit' || newPlayerBoard[r][c] === 'miss');

    const isHit = newPlayerBoard[r][c] === 'ship';
    newPlayerBoard[r][c] = isHit ? 'hit' : 'miss';
    
    setPlayerBoard(newPlayerBoard);

    if (checkVictory(newPlayerBoard)) {
      setGameOver(true);
      setMessage('FROTA DESTRUÍDA! O inimigo venceu.');
    } else {
      setTurn('player');
      setMessage(isHit ? 'CUIDADO! Fomos atingidos!' : 'O inimigo errou o alvo.');
      setSelectedWeapon('normal');
    }
  };

  const executeAttack = (board: Board, r: number, c: number) => {
    if (board[r][c] === 'hit' || board[r][c] === 'miss') return;
    board[r][c] = (board[r][c] === 'ship' || board[r][c] === 'radar') ? 'hit' : 'miss';
  };

  // Funções de Especial (Radar e Cruz) mantidas como no passo anterior...
  const executeRadar = (board: Board, r: number, c: number) => {
    for (let i = r - 1; i <= r + 1; i++) {
      for (let j = c - 1; j <= c + 1; j++) {
        if (i >= 0 && i < GRID_SIZE && j >= 0 && j < GRID_SIZE && board[i][j] === 'ship') board[i][j] = 'radar';
      }
    }
  };

  const executeCrossShot = (board: Board, r: number, c: number) => {
    [[r,c],[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([i,j]) => {
      if (i >= 0 && i < GRID_SIZE && j >= 0 && j < GRID_SIZE) executeAttack(board, i, j);
    });
  };

  const checkVictory = (board: Board) => !board.flat().includes('ship') && !board.flat().includes('radar');

  return (
    <div className="flex flex-col items-center pb-10">
      <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        
        {/* Header e Mensagem */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={onBack} className="text-slate-400 font-bold text-xs uppercase tracking-widest">← Sair</button>
          <div className={`px-3 py-1 rounded-full text-[10px] font-black ${turn === 'player' ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white'}`}>
            {turn === 'player' ? 'SEU TURNO' : 'TURNO INIMIGO'}
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl mb-4 text-center border border-slate-100">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">{message}</p>
        </div>

        {/* Radar e Habilidades (Apenas visíveis no turno do jogador) */}
        <div className={`flex gap-2 mb-4 transition-opacity ${turn === 'player' ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <WeaponBtn icon="🎯" label="Normal" active={selectedWeapon === 'normal'} onClick={() => setSelectedWeapon('normal')} />
          <WeaponBtn icon="📡" label="Radar" cost={50} active={selectedWeapon === 'radar'} locked={user?.totalPoints! < 50} onClick={() => setSelectedWeapon('radar')} />
          <WeaponBtn icon="➕" label="Cruz" cost={150} active={selectedWeapon === 'cross'} locked={user?.totalPoints! < 150} onClick={() => setSelectedWeapon('cross')} />
        </div>

        {/* TABULEIRO INIMIGO (Para Atacar) */}
        <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Área de Ataque</p>
        <div className="grid grid-cols-8 gap-1 bg-slate-800 p-1 rounded-xl mb-6 aspect-square">
          {enemyBoard.map((row, rIdx) => row.map((cell, cIdx) => (
            <button key={`e-${rIdx}-${cIdx}`} onClick={() => handleCellClick(rIdx, cIdx)}
              className={`h-full w-full rounded-sm flex items-center justify-center text-xs transition-all
              ${cell === 'empty' || cell === 'ship' ? 'bg-slate-700 hover:bg-slate-600' : ''}
              ${cell === 'radar' ? 'bg-indigo-500 animate-pulse' : ''}
              ${cell === 'hit' ? 'bg-rose-500' : ''}
              ${cell === 'miss' ? 'bg-slate-900' : ''}`}>
              {cell === 'hit' ? '💥' : cell === 'miss' ? '💧' : cell === 'radar' ? '📡' : ''}
            </button>
          )))}
        </div>

        {/* SEU TABULEIRO (Para Defesa - Visual apenas) */}
        <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Sua Frota</p>
        <div className="grid grid-cols-8 gap-1 bg-slate-200 p-1 rounded-xl aspect-square opacity-80 scale-90">
          {playerBoard.map((row, rIdx) => row.map((cell, cIdx) => (
            <div key={`p-${rIdx}-${cIdx}`} className={`h-full w-full rounded-sm flex items-center justify-center text-[8px]
              ${cell === 'ship' ? 'bg-emerald-400' : 'bg-slate-300'}
              ${cell === 'hit' ? 'bg-rose-500' : ''}
              ${cell === 'miss' ? 'bg-white' : ''}`}>
              {cell === 'ship' ? '🚢' : cell === 'hit' ? '🔥' : ''}
            </div>
          )))}
        </div>

        {gameOver && (
          <button onClick={() => window.location.reload()} className="w-full mt-6 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg">
            NOVA BATALHA
          </button>
        )}
      </div>
    </div>
  );
};

const WeaponBtn = ({ icon, label, cost, active, locked, onClick }: any) => (
  <button onClick={onClick} disabled={locked} className={`flex-1 flex flex-col items-center p-2 rounded-xl border-2 transition-all ${active ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 bg-white'} ${locked ? 'opacity-30 grayscale' : ''}`}>
    <span className="text-lg">{icon}</span>
    <p className="text-[8px] font-black uppercase">{label}</p>
    {cost && <p className="text-[8px] font-bold text-indigo-500">{cost}p</p>}
  </button>
);

export default BattleshipGame;
