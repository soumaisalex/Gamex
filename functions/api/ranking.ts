import { neon } from '@neondatabase/serverless';

export const onRequest: PagesFunction<{ DATABASE_URL: string }> = async (context) => {
  // 1. Pegar o ID do jogo via Query String (ex: /api/ranking?gameId=1)
  const { searchParams } = new URL(context.request.url);
  const gameId = searchParams.get('gameId');

  if (!gameId) {
    return new Response(JSON.stringify({ error: 'gameId é obrigatório' }), { status: 400 });
  }

  // 2. Conectar ao Neon usando a variável de ambiente configurada no painel do Cloudflare
  const sql = neon(context.env.DATABASE_URL);

  try {
    // 3. Executar a Query do Top 10
    const results = await sql`
      SELECT 
        u.name, 
        u.avatar_url, 
        l.points,
        RANK() OVER (ORDER BY l.points DESC) as position
      FROM leaderboards l
      JOIN users u ON l.user_id = u.id
      WHERE l.game_id = ${parseInt(gameId)}
      ORDER BY l.points DESC
      LIMIT 10
    `;

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao buscar ranking' }), { status: 500 });
  }
};
