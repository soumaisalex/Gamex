import React, { useState, useEffect } from 'react';

// Lógica inicial para o tabuleiro 3x3
const TicTacToeGame = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  
  // Próximos passos: 
  // 1. Algoritmo Minimax para IA
  // 2. Integração com o ranking do Neon (+3 pts por vitória)
  
  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-3 gap-2 bg-slate-200 p-2 rounded-xl">
        {board.map((cell, i) => (
          <button key={i} className="w-20 h-20 bg-white rounded-lg text-2xl font-bold">
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TicTacToeGame;
