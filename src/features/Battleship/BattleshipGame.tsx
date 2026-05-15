import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

type CellState = 'empty' | 'ship' | 'hit' | 'miss' | 'radar';
type Board = CellState[][];
type Weapon = 'normal' | 'radar' | 'cross';

const GRID_SIZE = 10; // Atualizado para 10x10

const BattleshipGame = ({ onBack }: { onBack: () => void }) => {
  const { user, addPoints } = useAuth();
  
  const [enemyBoard, setEnemyBoard] = useState<Board>([]);
  const [playerBoard, setPlayerBoard] = useState<Board>([]);
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon>('normal');
  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Capitão, posicione a frota!');

  useEffect(() => {
    setEnemyBoard(generateRandomBoard());
    setPlayerBoard(generateRandomBoard());
  }, []);

  function generateRandomBoard() {
    const board = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'));
    let ships = 0;
    while (ships < 20) { // Aumentei para 12 navios já que o grid é maior
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      if (board[r][c] === 'empty') {
        board[r][c] = 'ship';
        ships++;
      }
    }
    return board;
  }

  const handleCellClick = async (row: number, col: number) => {
    if (turn !== 'player' || gameOver || enemyBoard[row][col] === 'hit' || enemyBoard[row][col] === 'miss') return;
  
    const newEnemyBoard = [...enemyBoard.map(r => [...r])];
  
    if (selectedWeapon === 'normal') executeAttack(newEnemyBoard, row, col);
    else if (selectedWeapon === 'radar') executeRadar(newEnemyBoard, row, col);
    else if (selectedWeapon === 'cross') executeCrossShot(newEnemyBoard, row, col);
  
    setEnemyBoard(newEnemyBoard);
  
    if (checkVictory(newEnemyBoard)) {
      setGameOver(true);
      setMessage('VITÓRIA NAVAL! +20 pontos salvos.');
      await saveVictory(); // AQUI: Chama a função que grava no Neon
    } else {
      setTurn('enemy');
      setMessage('Inimigo disparando...');
      setTimeout(enemyTurn, 800);
    }
  };

  const enemyTurn = () => {
    if (gameOver) return;
    const newPlayerBoard = [...playerBoard.map(r => [...r])];
    let r, c;
    do {
      r = Math.floor(Math.random() * GRID_SIZE);
      c = Math.floor(Math.random() * GRID_SIZE);
    } while (newPlayerBoard[r][c] === 'hit' || newPlayerBoard[r][c] === 'miss');

    const isHit = newPlayerBoard[r][c] === 'ship';
    newPlayerBoard[r][c] = isHit ? 'hit' : 'miss';
    setPlayerBoard(newPlayerBoard);

    if (checkVictory(newPlayerBoard)) {
      setGameOver(true);
      setMessage('DERROTA! Perdemos a frota.');
    } else {
      setTurn('player');
      setMessage(isHit ? 'Fomos atingidos!' : 'O inimigo errou.');
      setSelectedWeapon('normal');
    }
  };

  const executeAttack = (board: Board, r: number, c: number) => {
    if (board[r][c] === 'hit' || board[r][c] === 'miss') return;
    board[r][c] = (board[r][c] === 'ship' || board[r][c] === 'radar') ? 'hit' : 'miss';
  };
  
  const saveVictory = async () => {
    await fetch('/api/leaderboards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user?.email,
        game_id: 2, // ID da Batalha Naval no seu banco
        points: 20
      })
    });
    addPoints(20);
  };
  
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
    <div className="flex flex-col items-center pb-20 max-w-md mx-auto">
      <div className="w-full bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-2">
          <button onClick={onBack} className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">← Voltar</button>
          <div className={`px-3 py-0.5 rounded-full text-[9px] font-black ${turn === 'player' ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white'}`}>
            {turn === 'player' ? 'SEU TURNO' : 'TURNO INIMIGO'}
          </div>
        </div>

        <div className="bg-slate-50 p-2 rounded-xl mb-4 text-center border border-slate-100">
          <p className="text-[10px] font-bold text-slate-600 uppercase italic">{message}</p>
        </div>

        {/* Armas */}
        <div className={`flex gap-2 mb-4 px-2 ${turn === 'player' ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <WeaponBtn icon="🎯" label="Normal" active={selectedWeapon === 'normal'} onClick={() => setSelectedWeapon('normal')} />
          /*<WeaponBtn icon="📡" label="Radar" cost={10} active={selectedWeapon === 'radar'} locked={user?.totalPoints! < 10} onClick={() => setSelectedWeapon('radar')} />*/
          /*<WeaponBtn icon="➕" label="Cruz" cost={20} active={selectedWeapon === 'cross'} locked={user?.totalPoints! < 20} onClick={() => setSelectedWeapon('cross')} />*/
          <WeaponBtn 
            icon="📡" label="Radar" cost={10} 
            active={selectedWeapon === 'radar'} 
            locked={false} // Mude temporariamente de user?.totalPoints! < 50 para false
            onClick={() => setSelectedWeapon('radar')} 
          />
          
          <WeaponBtn 
            icon="➕" label="Cruz" cost={20} 
            active={selectedWeapon === 'cross'} 
            locked={false} // Mude temporariamente para false
            onClick={() => setSelectedWeapon('cross')} 
          />
        </div>

        {/* TABULEIRO ATAQUE (10x10) */}
        <div className="grid grid-cols-10 gap-0.5 bg-slate-200 p-0.5 rounded-lg mb-6 shadow-inner">
          {enemyBoard.map((row, rIdx) => row.map((cell, cIdx) => (
            <button key={`e-${rIdx}-${cIdx}`} onClick={() => handleCellClick(rIdx, cIdx)}
              className={`aspect-square w-full rounded-sm flex items-center justify-center text-[10px] transition-all
              ${cell === 'empty' || cell === 'ship' ? 'bg-sky-500 hover:bg-sky-400' : ''}
              ${cell === 'radar' ? 'bg-indigo-500 animate-pulse' : ''}
              ${cell === 'hit' ? 'bg-rose-500' : ''}
              ${cell === 'miss' ? 'bg-slate-800' : ''}`}>
              {cell === 'hit' ? '💥' : cell === 'miss' ? '💧' : cell === 'radar' ? '📡' : ''}
            </button>
          )))}
        </div>

        {/* SEU TABULEIRO (Defesa) */}
        <div className="flex justify-between items-end mb-2 px-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Sua Frota (Defesa)</p>
        </div>
        <div className="grid grid-cols-10 gap-0.5 bg-slate-100 p-0.5 rounded-lg opacity-90">
          {playerBoard.map((row, rIdx) => row.map((cell, cIdx) => (
            <div key={`p-${rIdx}-${cIdx}`} className={`aspect-square w-full rounded-sm flex items-center justify-center text-[8px]
              ${cell === 'ship' ? 'bg-emerald-400 shadow-inner' : 'bg-white'}
              ${cell === 'hit' ? 'bg-rose-500' : ''}
              ${cell === 'miss' ? 'bg-slate-200' : ''}`}>
              {cell === 'ship' ? '🚢' : cell === 'hit' ? '🔥' : ''}
            </div>
          )))}
        </div>

        {gameOver && (
          <button onClick={() => window.location.reload()} className="w-full mt-4 py-3 bg-indigo-600 text-white font-black rounded-xl text-sm shadow-lg tracking-widest active:scale-95 transition-transform">
            NOVA MISSÃO
          </button>
        )}
      </div>
    </div>
  );
};

const WeaponBtn = ({ icon, label, cost, active, locked, onClick }: any) => (
  <button onClick={onClick} disabled={locked} className={`flex-1 py-1.5 rounded-xl border-2 flex flex-col items-center transition-all ${active ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-100 bg-white opacity-60'} ${locked ? 'grayscale cursor-not-allowed border-dashed' : ''}`}>
    <span className="text-sm">{icon}</span>
    <span className="text-[7px] font-black uppercase tracking-tighter">{label}</span>
    {cost && <span className="text-[7px] text-indigo-500 font-bold">{cost}p</span>}
  </button>
);

export default BattleshipGame;
