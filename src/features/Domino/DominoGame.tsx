import React, { useState, useEffect } from 'react';

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
      default: return null; // Zero
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-1 w-full h-full">
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full max-w-[20px] max-h-[20px] sm:max-w-[24px] sm:max-h-[24px] items-center justify-items-center">
         {renderDots()}
      </div>
    </div>
  );
};


const DominoGame = ({ onBack }: { onBack: () => void }) => {
  const [playerHand, setPlayerHand] = useState<Piece[]>([]);
  const [botHand, setBotHand] = useState<Piece[]>([]);
  const [boneyard, setBoneyard] = useState<Piece[]>([]);
  const [table, setTable] = useState<Piece[]>([]);
  const [turn, setTurn] = useState<'player' | 'bot'>('player');
  const [message, setMessage] = useState('Sua vez! Jogue qualquer pedra para começar.');

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
    setMessage('Sua vez! Jogue qualquer pedra para começar.');
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

      if (piece[0] === rightEnd) {
        newTable.push(piece);
        played = true;
      } else if (piece[1] === rightEnd) {
        newTable.push([piece[1], piece[0]]); 
        played = true;
      } else if (piece[1] === leftEnd) {
        newTable.unshift(piece);
        played = true;
      } else if (piece[0] === leftEnd) {
        newTable.unshift([piece[1], piece[0]]); 
        played = true;
      }
    }

    if (played) {
      setTable(newTable);
      if (isPlayer) {
        setPlayerHand(hand.filter(p => p !== piece));
        setTurn('bot');
        setMessage('Vez do adversário...');
      } else {
        setBotHand(hand.filter(p => p !== piece));
        setTurn('player');
        setMessage('Sua vez!');
      }
      return true;
    }
    return false;
  };

  const handlePlayerPlay = (piece: Piece) => {
    if (turn !== 'player') return;
    const success = tryPlayPiece(piece, playerHand, true);
    if (!success) setMessage('Pedra inválida! Não encaixa nas pontas.');
  };

  const drawPiece = (isPlayer: boolean) => {
    if (boneyard.length === 0) {
      setMessage(isPlayer ? 'O monte está vazio! Você passou a vez.' : 'Bot passou a vez.');
      setTurn(isPlayer ? 'bot' : 'player');
      return null;
    }

    const newBoneyard = [...boneyard];
    const drawnPiece = newBoneyard.pop()!;
    setBoneyard(newBoneyard);

    if (isPlayer) setPlayerHand([...playerHand, drawnPiece]);
    else setBotHand([...botHand, drawnPiece]);
    
    return drawnPiece;
  };

  useEffect(() => {
    if (turn === 'bot') {
      const playBot = async () => {
        await new Promise(resolve => setTimeout(resolve, 1200));

        let currentHand = [...botHand];
        let played = false;

        for (const piece of currentHand) {
          if (tryPlayPiece(piece, currentHand, false)) {
            played = true;
            break;
          }
        }

        if (!played) {
          setMessage('Adversário está comprando...');
          let pieceDrawn = drawPiece(false);
          
          if (pieceDrawn) {
            await new Promise(resolve => setTimeout(resolve, 800));
            if (!tryPlayPiece(pieceDrawn, [...currentHand, pieceDrawn], false)) {
               setTurn('player');
               setMessage('O adversário comprou e passou a vez.');
            }
          }
        }
      };
      playBot();
    }
  }, [turn, botHand, table, boneyard]);


  return (
    <div className="flex flex-col items-center pb-20 animate-in fade-in duration-500 max-w-3xl mx-auto w-full">
      <div className="w-full bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={onBack} className="text-slate-400 font-bold text-xs uppercase tracking-widest">← Voltar</button>
          <div className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest bg-indigo-600 text-white shadow-sm">
            DOMINÓ
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-6 text-center flex justify-between items-center px-4">
          <div className="text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase">Bot: {botHand.length} pedras</p>
          </div>
          <p className="text-xs font-bold text-slate-600 uppercase italic tracking-tight flex-1 px-2">{message}</p>
          <div className="text-right">
             <button 
                onClick={() => drawPiece(true)} 
                disabled={turn !== 'player' || boneyard.length === 0}
                className="text-[10px] font-black uppercase bg-slate-200 hover:bg-indigo-500 hover:text-white text-slate-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-30"
              >
                Comprar ({boneyard.length})
             </button>
          </div>
        </div>

        {/* MESA DE JOGO - Agora com Flex-Wrap */}
        <div className="flex-1 bg-emerald-700 rounded-2xl shadow-inner border-4 border-slate-800 flex items-center justify-center p-4 sm:p-6 mb-6">
          {table.length === 0 ? (
            <div className="text-emerald-300/50 font-black uppercase tracking-widest">
              A mesa está vazia
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
              {table.map((piece, idx) => (
                <div key={idx} className="flex bg-amber-50 rounded shadow-md border border-slate-800 h-10 w-20 sm:h-12 sm:w-24 divide-x-2 divide-slate-300 transform transition-all duration-300 hover:scale-105">
                  <DominoHalf value={piece[0]} />
                  <DominoHalf value={piece[1]} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sua Mão (Vertical) */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 text-center">Suas Pedras</p>
          <div className="flex flex-wrap justify-center gap-2">
            {playerHand.map((piece, idx) => (
              <button 
                key={idx}
                onClick={() => handlePlayerPlay(piece)}
                disabled={turn !== 'player'}
                className="flex flex-col items-center w-10 h-20 sm:w-12 sm:h-24 bg-amber-50 rounded-lg border-2 border-slate-300 shadow-sm hover:-translate-y-2 hover:border-indigo-400 transition-all duration-300 disabled:hover:translate-y-0 disabled:opacity-80 divide-y-2 divide-slate-300"
              >
                <DominoHalf value={piece[0]} />
                <DominoHalf value={piece[1]} />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DominoGame;
