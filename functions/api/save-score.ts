import { neon } from '@neondatabase/serverless';

export const onRequestPost: PagesFunction<{ DATABASE_URL: string }> = async (context) => {
  try {
    const body = await context.request.json() as { 
      userId: string; 
      gameId: number; 
      points: number;
      isGuest: boolean;
    };

    const { userId, gameId, points, isGuest } = body;

    // Se for convidado, não poluímos o banco de dados real.
    // O React cuidará de somar na tela temporariamente.
    if (isGuest) {
      return new Response(JSON.stringify({ success: true, message: "Pontos locais (Convidado)" }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!userId || !gameId || points === undefined) {
      return new Response(JSON.stringify({ error: 'Dados incompletos' }), { status: 400 });
    }

    const sql = neon(context.env.DATABASE_URL);

    // Faz o Update ou Insert na sua tabela leaderboards usando a Chave Primária Composta
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
    return new Response(JSON.stringify({ error: 'Erro ao salvar pontos', details: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
