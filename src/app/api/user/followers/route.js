import createConnection from "@/server/database/mysql";

export async function POST(request) {
    const connection = await createConnection();
    const data = await request.json();
    const limit = parseInt(data.limit);
    const offset = parseInt(data.start);
    const [followers] = await connection.execute(`
      SELECT f.follower_id, u.username, u.avatar_url, u.first_name, u.last_name
      FROM followers f
      INNER JOIN users u ON f.follower_id = u.id
      WHERE f.following_id = ?
      LIMIT ${limit} OFFSET ${offset}
      `, [data.userId]);
    
  return Response.json({ followers })
}