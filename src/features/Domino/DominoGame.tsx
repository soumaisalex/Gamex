import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

type Piece = [number, number];

// --- COMPONENTE VISUAL PARA OS PONTINHOS (PIPS) ---
const DominoHalf = ({ value }: { value: number }) => {
  const renderDots = () => {
    switch (value) {
      case 1: return <div className="col-start-2 row-start-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />;
      case 2: return <>
        <div className="col-start-3 row-start-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
        <div className="col-start-1 row-start-3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
      </>;
      case 3: return <>
        <div className="col-start-3 row-start-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
        <div className="col-start-2 row-start-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
        <div className="col-start-1 row-start-3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
      </>;
      case 4: return <>
        <div className="col-start-1 row-start-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
        <div className="col-start-3 row-start-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
        <div className="col-start-1 row-start-3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
        <div className="col-start-3 row-start-3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
      </>;
      case 5: return <>
        <div className="col-start-1 row-start-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
        <div className="col-start-3 row-start-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
        <div className="col-start-2 row-start-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
        <div className="col-start-1 row-start-3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
        <div className="col-start-3 row-start-3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
      </>;
      case 6: return <>
        <div className="col-start-1 row-start-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
        <div className="col-start-1 row-start-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
        <div className="col-start-1 row-start-3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
        <div className="col-start-3 row-start-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
        <div className="col-start-3 row-start-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
        <div className="col-start-3 row-start-3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full" />
      </>;
      default: return null;
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-1 w-full h-full">
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full max-w-[24px] max-h-[24px] items-center justify-items-center">
         {renderDots()}
      </div>
    </div>
  );
};

const DominoGame = ({ onBack }: { onBack: () => void }) => {
  const { user, addPoints } = useAuth();
  const [playerHand, setPlayerHand] = useState<Piece[]>([]);
  const [botHand, setBotHand] = useState<Piece[]>([]);
  const [boneyard, setBoneyard] = useState<Piece[]>([]);
  const [table, setTable] = useState<Piece[]>([]);
  const [turn, setTurn] = useState<'player' | 'bot'>('player');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Sua vez de jogar!');

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const pieces: Piece[] = [];
    for (let i = 0; i <= 6; i++) {
      for (let j = i; j <= 6; j++) pieces.push([i, j]);
    }
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    setPlayerHand(pieces.slice(0, 7));
    setBotHand(pieces.slice(7, 14));
    setBoneyard(pieces.slice(14, 28));
    setTable([]);
    setTurn('player');
    setGameOver(false);
    setMessage('Sua vez! Jogue qualquer pedra para começar.');
  };

  const saveVictory = async () => {
    try {
      await fetch('/api/leaderboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, game_id: 3, points: 20 })
      });
      addPoints(20);
    } catch (e) { console.error(e); }
  };

  const checkEndGame = (newPlayerHand: Piece[], newBotHand: Piece[], currentTable: Piece[], currentBoneyard: Piece[]) => {
    if (newPlayerHand.length === 0) {
      setGameOver(true);
      setMessage('BATEU! Você venceu a partida! +20 pontos.');
      saveVictory();
      return true;
    }
    if (newBotHand.length === 0) {
      setGameOver(true);
      setMessage('O adversário bateu! Você perdeu.');
      return true;
    }

    // Checar se o jogo trancou (ninguém pode jogar e monte vazio)
    if (currentBoneyard.length === 0 && currentTable.length > 0) {
      const leftEnd = currentTable[0][0];
      const rightEnd = currentTable[currentTable.length - 1][1];
      const playerCanPlay = newPlayerHand.some(p => p[0] === leftEnd || p[1] === leftEnd || p[0] === rightEnd || p[1] === rightEnd);
      const botCanPlay = newBotHand.some(p => p[0] === leftEnd || p[1] === leftEnd || p[0] === rightEnd || p[1] === rightEnd);

      if (!playerCanPlay && !botCanPlay) {
        const playerPoints = newPlayerHand.reduce((acc, p) => acc + p[0] + p[1], 0);
        const botPoints = newBotHand.reduce((acc, p) => acc + p[0] + p[1], 0);
        setGameOver(true);
        if (playerPoints < botPoints) {
          setMessage(`Jogo trancado! Você venceu nos pontos (${playerPoints} vs ${botPoints}).`);
          saveVictory();
        } else {
          setMessage(`Jogo trancado! Você perdeu nos pontos (${playerPoints} vs ${botPoints}).`);
        }
        return true;
      }
    }
    return false;
  };

  const tryPlayPiece = (piece: Piece, hand: Piece[], isPlayer: boolean): boolean => {
    const newTable = [...table];
    let played = false;

    if (newTable.length === 0) {
      newTable.push(piece);
      played = true;
    } else {
      const leftEnd = newTable[0][0];
      const rightEnd = newTable[newTable.length - 1][1];
      if (piece[0] === rightEnd) { newTable.push(piece); played = true; }
      else if (piece[1] === rightEnd) { newTable.push([piece[1], piece[0]]); played = true; }
      else if (piece[1] === leftEnd) { newTable.unshift(piece); played = true; }
      else if (piece[0] === leftEnd) { newTable.unshift([piece[1], piece[0]]); played = true; }
    }

    if (played) {
      const nextHand = hand.filter(p => p !== piece);
      setTable(newTable);
      if (isPlayer) {
        setPlayerHand(nextHand);
        if (!checkEndGame(nextHand, botHand, newTable, boneyard)) {
          setTurn('bot');
          setMessage('Vez do adversário...');
        }
      } else {
        setBotHand(nextHand);
        if (!checkEndGame(playerHand, nextHand, newTable, boneyard)) {
          setTurn('player');
          setMessage('Sua vez!');
        }
      }
      return true;
    }
    return false;
  };

  const drawPiece = (isPlayer: boolean) => {
    if (boneyard.length === 0 || gameOver) return null;
    const newBoneyard = [...boneyard];
    const drawn = newBoneyard.pop()!;
    setBoneyard(newBoneyard);
    if (isPlayer) setPlayerHand([...playerHand, drawn]);
    else setBotHand([...botHand, drawn]);
    return drawn;
  };

  // Turno do BOT
  useEffect(() => {
    if (turn === 'bot' && !gameOver) {
      const botProcess = async () => {
        await new Promise(r => setTimeout(r, 1500));
        let played = false;
        for (const p of botHand) {
          if (tryPlayPiece(p, botHand, false)) { played = true; break; }
        }
        if (!played) {
          if (boneyard.length > 0) {
            setMessage('Adversário comprando...');
            const p = drawPiece(false);
            if (p) {
              await new Promise(r => setTimeout(r, 1000));
              if (!tryPlayPiece(p, [...botHand, p], false)) {
                setTurn('player');
                setMessage('Adversário comprou e passou.');
              }
            }
          } else {
            setTurn('player');
            setMessage('Adversário não tem peças e passou.');
          }
        }
      };
      botProcess();
    }
  }, [turn, gameOver]);

  return (
    <div className="flex flex-col items-center pb-20 max-w-4xl mx-auto w-full px-2">
      <div className="w-full bg-white p-4 md:p-8 rounded-[40px] shadow-sm border border-slate-100 min-h-[650px] flex flex-col">
        
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">← Sair</button>
          <div className="px-5 py-2 rounded-full text-[10px] font-black tracking-widest bg-indigo-600 text-white shadow-indigo-100 shadow-lg">DOMINÓ</div>
        </div>

        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 mb-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-lg">🤖</div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Adversário</p>
                <p className="text-sm font-black text-slate-700">{botHand.length} peças</p>
             </div>
          </div>
          <p className="text-xs font-bold text-indigo-600 uppercase italic px-4 text-center">{message}</p>
          <button onClick={() => drawPiece(true)} disabled={turn !== 'player' || boneyard.length === 0 || gameOver}
            className="bg-white border-2 border-slate-100 hover:border-indigo-500 hover:text-indigo-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase transition-all disabled:opacity-20">
            Comprar ({boneyard.length})
          </button>
        </div>

        <div className="flex-1 bg-emerald-800 rounded-[32px] shadow-inner border-[6px] border-emerald-900 flex items-center justify-center p-8 mb-8 relative overflow-hidden">
          {table.length === 0 ? (
            <div className="text-emerald-400/30 font-black uppercase tracking-[0.3em] text-sm animate-pulse">Aguardando início</div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2 max-w-full">
              {table.map((p, i) => (
                <div key={i} className="flex bg-white rounded-lg shadow-xl border-b-4 border-slate-200 h-12 w-24 divide-x-2 divide-slate-100 overflow-hidden">
                  <DominoHalf value={p[0]} />
                  <DominoHalf value={p[1]} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Sua Mão</p>
          <div className="flex flex-wrap justify-center gap-3">
            {playerHand.map((p, i) => (
              <button key={i} onClick={() => handlePlayerPlay(p)} disabled={turn !== 'player' || gameOver}
                className="flex flex-col items-center w-12 h-24 bg-white rounded-xl border-2 border-slate-100 shadow-sm hover:-translate-y-3 hover:border-indigo-400 hover:shadow-indigo-100 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 divide-y-2 divide-slate-50">
                <DominoHalf value={p[0]} />
                <DominoHalf value={p[1]} />
              </button>
            ))}
          </div>
        </div>

        {gameOver && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Fim de Jogo</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">{message}</p>
              <button onClick={startNewGame} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-indigo-200 shadow-xl hover:bg-indigo-700 transition-all">JOGAR NOVAMENTE</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DominoGame;
