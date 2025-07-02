import createConnection from "@/server/database/mysql";

export async function POST(request) {
    const connection = await createConnection();
    const data = await request.json();
    const limit = parseInt(data.limit);
    const offset = parseInt(data.start);
    const [followings] = await connection.execute(`SELECT * FROM followers WHERE follower_id = ? ORDER BY id DESC LIMIT ${limit} OFFSET ${offset};`, [data.userId]);
    
  return Response.json({ followings })
}