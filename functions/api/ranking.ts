import { neon } from '@neondatabase/serverless';

export const onRequestGet: PagesFunction<{ DATABASE_URL: string }> = async (context) => {
  try {
    const { searchParams } = new URL(context.request.url);
    const gameId = searchParams.get('gameId');

    if (!gameId) {
      return new Response(JSON.stringify({ error: 'ID do jogo não fornecido' }), { status: 400 });
    }

    const sql = neon(context.env.DATABASE_URL);

    // Busca o Top 10 fazendo JOIN para pegar os dados do usuário
    const ranking = await sql`
      SELECT 
        u.name, 
        u.avatar_url, 
        l.points
      FROM leaderboards l
      JOIN users u ON l.user_id = u.id
      WHERE l.game_id = ${gameId}
      ORDER BY l.points DESC
      LIMIT 10
    `;

    return new Response(JSON.stringify(ranking), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store' // Garante que o ranking venha sempre fresco
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
