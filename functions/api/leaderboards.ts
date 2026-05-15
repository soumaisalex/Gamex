import { neon } from '@neondatabase/serverless';

export const onRequestPost: PagesFunction<{ DATABASE_URL: string }> = async (context) => {
  try {
    const { email, game_id, points } = await context.request.json() as { 
      email: string; 
      game_id: number; 
      points: number;
    };

    const sql = neon(context.env.DATABASE_URL);

    // 1. Primeiro, buscamos o ID do usuário pelo email
    const userResult = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
    const userId = userResult[0]?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), { status: 404 });
    }

    // 2. Registramos a pontuação na tabela de ranking
    // Usamos ON CONFLICT para atualizar os pontos se o usuário já tiver registro para esse jogo, 
    // ou você pode apenas inserir uma nova linha se quiser um histórico completo.
    // Aqui vou inserir uma nova linha para somar depois.
    await sql`
      INSERT INTO leaderboards (user_id, game_id, points)
      VALUES (${userId}, ${game_id}, ${points})
    `;

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
