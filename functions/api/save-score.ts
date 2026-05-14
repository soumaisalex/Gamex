import { neon } from '@neondatabase/serverless';

export const onRequestPost: PagesFunction<{ DATABASE_URL: string }> = async (context) => {
  try {
    // Pega os dados enviados pelo jogo
    const body = await context.request.json() as { 
      userId: string; 
      gameId: number; 
      points: number;
      isGuest: boolean;
    };

    const { userId, gameId, points, isGuest } = body;

    // Se for convidado, podemos optar por não salvar no banco real 
    // ou apenas retornar sucesso para ele atualizar localmente.
    if (isGuest) {
      return new Response(JSON.stringify({ success: true, message: "Pontos locais (Convidado)" }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!userId || !gameId || points === undefined) {
      return new Response(JSON.stringify({ error: 'Dados inválidos' }), { status: 400 });
    }

    // Conecta ao banco Neon
    const sql = neon(context.env.DATABASE_URL);

    // 1. Atualiza ou insere o ranking do usuário neste jogo específico
    // (A sintaxe ON CONFLICT exige que você tenha uma constraint UNIQUE(user_id, game_id) na tabela)
    await sql`
      INSERT INTO leaderboards (user_id, game_id, points)
      VALUES (${userId}, ${gameId}, ${points})
      ON CONFLICT (user_id, game_id)
      DO UPDATE SET points = leaderboards.points + EXCLUDED.points;
    `;

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Erro no servidor', details: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
