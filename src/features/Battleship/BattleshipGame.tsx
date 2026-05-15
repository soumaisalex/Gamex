import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

type CellState = 'empty' | 'miss' | 'radar' | string; 
type Board = CellState[][];
type Weapon = 'normal' | 'radar' | 'cross';

const GRID_SIZE = 8;
const FLEET_SIZES = [5, 4, 3, 3, 2];

const BattleshipGame = ({ onBack }: { onBack: () => void }) => {
  const { user, addPoints } = useAuth();
  
  const [enemyBoard, setEnemyBoard] = useState<Board>([]);
  const [playerBoard, setPlayerBoard] = useState<Board>([]);
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon>('normal');
  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Capitão, a frota aguarda suas ordens!');

  useEffect(() => {
    setEnemyBoard(generateRandomBoardWithFleet());
    setPlayerBoard(generateRandomBoardWithFleet());
  }, []);

  function generateRandomBoardWithFleet(): Board {
    let board: Board;
    let allPlaced = false;

    while (!allPlaced) {
      board = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'));
      allPlaced = true;

      const attemptPlaceShip = (boardToCheck: Board, size: number, shipId: string) => {
        for (let attempt = 0; attempt < 100; attempt++) {
          const isHorizontal = Math.random() < 0.5;
          const r = Math.floor(Math.random() * GRID_SIZE);
          const c = Math.floor(Math.random() * GRID_SIZE);

          let canPlace = true;
          if (isHorizontal) {
            if (c + size > GRID_SIZE) canPlace = false;
            else {
              for (let i = 0; i < size; i++) {
                if (boardToCheck[r][c + i] !== 'empty') { canPlace = false; break; }
              }
            }
          } else {
            if (r + size > GRID_SIZE) canPlace = false;
            else {
              for (let i = 0; i < size; i++) {
                if (boardToCheck[r + i][c] !== 'empty') { canPlace = false; break; }
              }
            }
          }

          if (canPlace) {
            for (let i = 0; i < size; i++) {
              if (isHorizontal) boardToCheck[r][c + i] = `ship-${size}-${shipId}`;
              else boardToCheck[r + i][c] = `ship-${size}-${shipId}`;
            }
            return true;
          }
        }
        return false;
      };

      for (let i = 0; i < FLEET_SIZES.length; i++) {
        if (!attemptPlaceShip(board, FLEET_SIZES[i], i.toString())) {
          allPlaced = false;
          break;
        }
      }
    }
    return board!;
  }

  const saveVictory = async () => {
    try {
      const response = await fetch('/api/leaderboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          game_id: 2, 
          points: 20
        })
      });

      if (response.ok) {
        addPoints(20); // Atualiza o estado global e localStorage
      }
    } catch (error) {
      console.error("Erro ao salvar vitória:", error);
    }
  };

  const handleCellClick = async (row: number, col: number) => {
    if (turn !== 'player' || gameOver || enemyBoard[row][col].startsWith('hit') || enemyBoard[row][col] === 'miss') return;

    const newEnemyBoard = [...enemyBoard.map(r => [...r])];

    if (selectedWeapon === 'normal') executeAttack(newEnemyBoard, row, col);
    else if (selectedWeapon === 'radar') executeRadar(newEnemyBoard, row, col);
    else if (selectedWeapon === 'cross') executeCrossShot(newEnemyBoard, row, col);

    setEnemyBoard(newEnemyBoard);

    if (checkVictory(newEnemyBoard)) {
      setGameOver(true);
      setMessage('VITÓRIA! Relatório enviado ao comando.');
      await saveVictory();
    } else {
      setTurn('enemy');
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
    } while (newPlayerBoard[r][c].startsWith('hit') || newPlayerBoard[r][c] === 'miss');

    const cell = newPlayerBoard[r][c];
    if (cell.startsWith('ship') || cell === 'radar') {
      newPlayerBoard[r][c] = cell.replace('ship', 'hit').replace('radar', 'hit');
      setMessage('Fomos atingidos!');
    } else {
      newPlayerBoard[r][c] = 'miss';
      setMessage('O inimigo errou.');
    }
    
    setPlayerBoard(newPlayerBoard);

    if (checkVictory(newPlayerBoard)) {
      setGameOver(true);
      setMessage('Derrota. A frota foi afundada.');
    } else {
      setTurn('player');
      setSelectedWeapon('normal');
    }
  };

  const executeAttack = (board: Board, r: number, c: number) => {
    const cell = board[r][c];
    if (cell.startsWith('hit') || cell === 'miss') return;
    board[r][c] = (cell.startsWith('ship') || cell === 'radar') ? cell.replace('ship', 'hit').replace('radar', 'hit') : 'miss';
  };

  const executeRadar = (board: Board, r: number, c: number) => {
    for (let i = r - 1; i <= r + 1; i++) {
      for (let j = c - 1; j <= c + 1; j++) {
        if (i >= 0 && i < GRID_SIZE && j >= 0 && j < GRID_SIZE && board[i][j].startsWith('ship')) {
          board[i][j] = 'radar';
        }
      }
    }
  };

  const executeCrossShot = (board: Board, r: number, c: number) => {
    [[r,c],[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([i,j]) => {
      if (i >= 0 && i < GRID_SIZE && j >= 0 && j < GRID_SIZE) executeAttack(board, i, j);
    });
  };

  const checkVictory = (board: Board) => !board.flat().some(cell => cell.startsWith('ship') || cell === 'radar');

  const getCellColor = (cell: string, isEnemy: boolean) => {
    if (cell === 'miss') return 'bg-slate-800';
    if (cell === 'radar') return 'bg-indigo-500 animate-pulse';
    if (cell.startsWith('hit')) {
      if (cell.includes('ship-5') || cell.includes('hit-5')) return 'bg-purple-600';
      if (cell.includes('ship-4') || cell.includes('hit-4')) return 'bg-emerald-600';
      if (cell.includes('ship-3') || cell.includes('hit-3')) return 'bg-amber-500';
      if (cell.includes('ship-2') || cell.includes('hit-2')) return 'bg-orange-600';
      return 'bg-rose-500';
    }
    if (!isEnemy && cell.startsWith('ship')) return 'bg-emerald-400 shadow-inner';
    return isEnemy ? 'bg-sky-500 hover:bg-sky-400' : 'bg-white';
  };

  return (
    <div className="flex flex-col items-center pb-20 animate-in fade-in duration-500 max-w-md mx-auto">
      <div className="w-full bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
        
        <div className="flex justify-between items-center mb-4 px-2">
          <button onClick={onBack} className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">← Voltar</button>
          <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest ${turn === 'player' ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white'}`}>
            {turn === 'player' ? 'SUA VEZ' : 'INIMIGO'}
          </div>
        </div>

        <div className="bg-slate-50 p-2 rounded-xl mb-4 text-center border border-slate-100">
          <p className="text-[10px] font-bold text-slate-500 uppercase italic tracking-tight">{message}</p>
        </div>

        <div className={`flex gap-2 mb-4 px-1 ${turn === 'player' ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <WeaponBtn icon="🎯" label="Normal" active={selectedWeapon === 'normal'} onClick={() => setSelectedWeapon('normal')} />
          <WeaponBtn icon="📡" label="Radar" cost={50} active={selectedWeapon === 'radar'} locked={(user?.totalPoints || 0) < 50} onClick={() => setSelectedWeapon('radar')} />
          <WeaponBtn icon="➕" label="Cruz" cost={150} active={selectedWeapon === 'cross'} locked={(user?.totalPoints || 0) < 150} onClick={() => setSelectedWeapon('cross')} />
        </div>

        {/* Tabuleiro Inimigo */}
        <div className="grid grid-cols-8 gap-0.5 bg-slate-200 p-0.5 rounded-lg mb-6 shadow-inner aspect-square">
          {enemyBoard.map((row, rIdx) => row.map((cell, cIdx) => (
            <button key={`e-${rIdx}-${cIdx}`} onClick={() => handleCellClick(rIdx, cIdx)}
              className={`aspect-square w-full rounded-sm flex items-center justify-center text-[10px] transition-all ${getCellColor(cell, true)}`}>
              {cell.startsWith('hit') ? '💥' : cell === 'miss' ? '💧' : cell === 'radar' ? '📡' : ''}
            </button>
          )))}
        </div>

        {/* Sua Frota */}
        <p className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-1">Sua Frota (Defesa)</p>
        <div className="grid grid-cols-8 gap-0.5 bg-slate-100 p-0.5 rounded-lg opacity-90 scale-[0.98]">
          {playerBoard.map((row, rIdx) => row.map((cell, cIdx) => (
            <div key={`p-${rIdx}-${cIdx}`} className={`aspect-square w-full rounded-sm flex items-center justify-center text-[8px] ${getCellColor(cell, false)}`}>
              {cell.startsWith('ship') ? '🚢' : cell.startsWith('hit') ? '🔥' : ''}
            </div>
          )))}
        </div>

        {gameOver && (
          <button onClick={() => window.location.reload()} className="w-full mt-4 py-3 bg-indigo-600 text-white font-black rounded-xl text-xs tracking-widest shadow-lg active:scale-95 transition-all">
            NOVA PARTIDA
          </button>
        )}
      </div>
    </div>
  );
};

const WeaponBtn = ({ icon, label, cost, active, locked, onClick }: any) => (
  <button 
    onClick={onClick} disabled={locked} 
    className={`flex-1 py-2 rounded-xl border-2 flex flex-col items-center transition-all 
    ${active ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-50 bg-white opacity-80'} 
    ${locked ? 'grayscale cursor-not-allowed border-dashed opacity-40' : 'hover:border-indigo-100'}`}
  >
    <span className="text-base">{icon}</span>
    <span className="text-[7px] font-black uppercase tracking-tighter">{label}</span>
    {cost && <span className="text-[7px] text-indigo-600 font-bold">{cost}p</span>}
  </button>
);

export default BattleshipGame;
