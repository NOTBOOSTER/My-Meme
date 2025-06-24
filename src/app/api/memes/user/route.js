import createConnection from "@/server/database/mysql";

export async function POST(request) {
    const connection = await createConnection();
    const data = await request.json();
    const limit = parseInt(data.limit);
    const offset = parseInt(data.start);
    const [memes] = await connection.execute(`SELECT * FROM memes WHERE user_id = ? AND status = ? ORDER BY id DESC LIMIT ${limit} OFFSET ${offset};`, [data.userId, "completed"]);
  return Response.json({ memes })
}