import { neon } from '@neondatabase/serverless';

export const onRequestPost: PagesFunction<{ DATABASE_URL: string }> = async (context) => {
  try {
    const { email, game_id, points } = await context.request.json() as { 
      email: string; 
      game_id: number; 
      points: number;
    };

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email não fornecido' }), { status: 400 });
    }

    const sql = neon(context.env.DATABASE_URL);

    // 1. Pega o ID do usuário pelo email
    const userResult = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
    const userId = userResult[0]?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Usuário não encontrado no sistema' }), { status: 404 });
    }

    // 2. Faz o "Upsert": Insere ou Atualiza somando os pontos e vitórias
    await sql`
      INSERT INTO leaderboards (user_id, game_id, points, wins)
      VALUES (${userId}, ${game_id}, ${points}, 1)
      ON CONFLICT (user_id, game_id) 
      DO UPDATE SET 
        points = leaderboards.points + EXCLUDED.points,
        wins = leaderboards.wins + 1,
        updated_at = CURRENT_TIMESTAMP;
    `;

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
