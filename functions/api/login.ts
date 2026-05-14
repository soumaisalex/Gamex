import { neon } from '@neondatabase/serverless';

export const onRequestPost: PagesFunction<{ DATABASE_URL: string }> = async (context) => {
  try {
    const user = await context.request.json() as { 
      id: string; 
      name: string; 
      email: string; 
      avatar_url: string;
    };

    const sql = neon(context.env.DATABASE_URL);

    // Faz o "Upsert": Se o usuário já existe (pelo email), atualiza os dados. 
    // Se não existe, cria um novo.
    // Usaremos o ID do Google no campo google_id da sua tabela.
    await sql`
      INSERT INTO users (google_id, name, email, avatar_url, is_guest)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${user.avatar_url}, false)
      ON CONFLICT (email) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        avatar_url = EXCLUDED.avatar_url,
        google_id = EXCLUDED.google_id;
    `;

    // Busca o usuário completo do banco para retornar ao front (incluindo o UUID gerado)
    const dbUser = await sql`SELECT * FROM users WHERE email = ${user.email} LIMIT 1`;

    return new Response(JSON.stringify(dbUser[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
