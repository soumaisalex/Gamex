import { neon } from '@neondatabase/serverless';

export const onRequestGet: PagesFunction<{ DATABASE_URL: string }> = async (context) => {
  try {
    const { searchParams } = new URL(context.request.url);
    const email = searchParams.get('email');

    if (!email) return new Response(JSON.stringify({ error: 'Email não fornecido' }), { status: 400 });

    const sql = neon(context.env.DATABASE_URL);

    // Soma todos os pontos de todos os jogos que o usuário participou
    const result = await sql`
      SELECT SUM(points) as total 
      FROM leaderboards l
      JOIN users u ON l.user_id = u.id
      WHERE u.email = ${email}
    `;

    const total = result[0]?.total || 0;

    return new Response(JSON.stringify({ total_points: Number(total) }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
