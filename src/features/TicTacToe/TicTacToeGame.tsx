import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

type Player = 'X' | 'O' | null;

interface TicTacToeProps {
  onBack: () => void;
  // futuramente passaremos: onGameOver: (points: number) => void
}

const TicTacToeGame: React.FC<TicTacToeProps> = ({ onBack }) => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true); // Player é sempre 'X'
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  
  const [scoreSaved, setScoreSaved] = useState(false); // Previne envio duplo
  const { user, addPoints } = useAuth(); // Puxa também a função addPoints
  const { user } = useAuth(); // Puxa quem está jogando
  
  // Efeito que dispara a pontuação
  useEffect(() => {
    if (winner && !scoreSaved) {
      let earnedPoints = 0;
      if (winner === 'X') earnedPoints = 3;
      else if (winner === 'Draw') earnedPoints = 1;

      if (earnedPoints > 0 && user) {
        // 1. Atualiza o ecrã (Header) instantaneamente
        addPoints(earnedPoints);

        // 2. Envia para o banco de dados (Worker)
        fetch('/api/save-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            gameId: 1, // 1 = Jogo da Velha
            points: earnedPoints,
            isGuest: user.isGuest
          })
        }).catch(err => console.error("Erro ao salvar pontos:", err));
      }
      
      setScoreSaved(true); // Marca como salvo para não repetir
    }
  }, [winner, scoreSaved, user, addPoints]);

  
  // Novo Efeito: Dispara quando o "winner" for definido
  useEffect(() => {
    if (winner) {
      let earnedPoints = 0;
      if (winner === 'X') earnedPoints = 3;      // Vitória
      else if (winner === 'Draw') earnedPoints = 1; // Empate
      // 'O' (IA) dá 0 pontos

      if (earnedPoints > 0 && user) {
        // Envia para o nosso novo Worker
        fetch('/api/save-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            gameId: 1, // ID 1 = Jogo da Velha (como está no seu banco)
            points: earnedPoints,
            isGuest: user.isGuest
          })
        }).catch(err => console.error("Erro ao salvar pontos:", err));
      }
    }
  }, [winner, user]);
  
  // Verifica as combinações de vitória
  const checkWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
      [0, 4, 8], [2, 4, 6]             // diagonais
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.includes(null) ? null : 'Draw';
  };

  // Algoritmo Minimax (O "Cérebro" da IA)
  const minimax = (newBoard: Player[], isMaximizing: boolean): number => {
    const result = checkWinner(newBoard);
    if (result === 'O') return 10;
    if (result === 'X') return -10;
    if (result === 'Draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!newBoard[i]) {
          newBoard[i] = 'O';
          const score = minimax(newBoard, false);
          newBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!newBoard[i]) {
          newBoard[i] = 'X';
          const score = minimax(newBoard, true);
          newBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  // Efeito que aciona a jogada da IA
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const makeAIMove = () => {
        let bestScore = -Infinity;
        let move = -1;
        const newBoard = [...board];

        for (let i = 0; i < 9; i++) {
          if (!newBoard[i]) {
            newBoard[i] = 'O';
            const score = minimax(newBoard, false);
            newBoard[i] = null;
            if (score > bestScore) {
              bestScore = score;
              move = i;
            }
          }
        }

        if (move !== -1) {
          newBoard[move] = 'O';
          setBoard(newBoard);
          const gameWinner = checkWinner(newBoard);
          if (gameWinner) setWinner(gameWinner);
          else setIsPlayerTurn(true);
        }
      };
      
      // Delay de 500ms para parecer que a IA está "pensando" e não assustar o jogador
      setTimeout(makeAIMove, 500); 
    }
  }, [isPlayerTurn, board, winner]);

  const handleCellClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setIsPlayerTurn(false);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
    setScoreSaved(false); // Liberta para o próximo jogo!
  };

  return (
    <div className="flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        
        {/* Cabeçalho do Jogo */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors">
            ← Sair
          </button>
          <h2 className="text-xl font-black text-slate-800">Jogo da Velha</h2>
          <div className="w-10"></div> {/* Espaçador fantasma para centralizar o título */}
        </div>

        {/* Status da Partida */}
        <div className="text-center mb-6 h-8 flex items-center justify-center">
          {winner ? (
            <span className={`text-sm font-bold px-4 py-2 rounded-xl uppercase tracking-widest ${
              winner === 'X' ? 'bg-emerald-100 text-emerald-700' : 
              winner === 'O' ? 'bg-rose-100 text-rose-700' : 
              'bg-slate-100 text-slate-700'
            }`}>
              {winner === 'X' ? '🎉 Você Venceu!' : winner === 'O' ? '🤖 IA Venceu!' : '🤝 Empate!'}
            </span>
          ) : (
            <span className="text-slate-500 font-medium text-sm animate-pulse">
              {isPlayerTurn ? 'Sua vez (X)' : 'Aguarde a IA (O)...'}
            </span>
          )}
        </div>

        {/* Tabuleiro */}
        <div className="grid grid-cols-3 gap-2 mb-6 bg-slate-100 p-2 rounded-2xl">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleCellClick(i)}
              disabled={!!cell || !!winner || !isPlayerTurn}
              className={`h-24 w-full bg-white rounded-xl text-5xl font-black shadow-sm transition-all flex items-center justify-center
                ${!cell && isPlayerTurn && !winner ? 'hover:bg-indigo-50 hover:scale-[1.02] active:scale-95 cursor-pointer' : ''}
                ${cell === 'X' ? 'text-indigo-600' : 'text-rose-500'}
              `}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Ações pós-jogo */}
        <div className="h-14">
          {winner && (
            <button
              onClick={resetGame}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors active:scale-95"
            >
              Jogar Novamente
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default TicTacToeGame;
