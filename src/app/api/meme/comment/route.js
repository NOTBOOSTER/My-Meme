import createConnection from "@/server/database/mysql";
import { NextResponse } from "next/server";

export async function POST(request) {
    const data = await request.json();
    console.log(data);
    const limit = parseInt(data.limit);
    const offset = parseInt(data.offset);
    const connection = await createConnection();
    const [comments] = await connection.execute(`SELECT c.id, c.content, c.created_at, u.username, u.avatar_url FROM comments c INNER JOIN users u ON c.user_id = u.id WHERE meme_id = ? ORDER BY c.id DESC  LIMIT ${limit} OFFSET ${offset}`, [data.memeId]);
    return NextResponse.json({ comments });
}